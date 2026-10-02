import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Link } from 'react-router';
import { pages } from '../config/pages';
import { site } from '../config/site';
import { cx } from '../lib/cx';
import {
  FIELD_ORDER,
  INITIAL_VALUES,
  MAX_LENGTHS,
  PRODUCT_OPTIONS,
  localDateString,
  toPayload,
  validate,
  type Choice,
  type FieldName,
  type QuoteErrors,
  type QuotePayload,
  type QuoteValues,
  type ValidationContext,
  type YesNo,
} from '../lib/quote';
import { EmailLink } from './ContactValues';
import './QuoteForm.css';

/**
 * Request a Quote form (PROJECT_BRIEF.md, Section 10).
 *
 * Prerendered like the rest of the page, so without JavaScript it is a plain
 * HTML form with native validation. After hydration JavaScript takes over:
 * inline error messages, mobile number normalisation, the conditional
 * frequency field, and a JSON POST through submitQuote().
 */

type TextFieldName = Exclude<FieldName, 'transport_required' | 'recurring'>;

const YES_NO: { value: YesNo; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

/** Native no-JS check for the mobile number: optional +91 or 0, then 10 digits; spaces and dashes allowed. */
const MOBILE_PATTERN = String.raw`[\s\-]*(\+91|0)?([\s\-]*[0-9]){10}[\s\-]*`;

/** Give up on a hung endpoint and show the error state. */
const SUBMIT_TIMEOUT_MS = 20000;

/**
 * INTEGRATION POINT: the only place the form talks to a backend.
 * Resolves when the requirement was accepted; throws otherwise.
 *
 * - site.formEndpoint set: POST the payload as JSON; any 2xx response counts as sent.
 * - Empty, dev server: log the payload to the console and report success
 *   (the form also shows a "not connected" banner).
 * - Empty, production build: throw, so the visitor sees the error state with
 *   the sales email. A submission is never silently discarded.
 */
async function submitQuote(payload: QuotePayload): Promise<void> {
  if (site.formEndpoint) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`The form endpoint responded with HTTP ${res.status}.`);
    } finally {
      window.clearTimeout(timer);
    }
    return;
  }

  if (import.meta.env.DEV) {
    console.info('[QuoteForm] site.formEndpoint is empty, so nothing was sent. Payload:', payload);
    return;
  }

  throw new Error('site.formEndpoint is empty in src/config/site.ts, so the Request a Quote form is not connected.');
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  hidden?: boolean;
  children: ReactNode;
}

/** Label, control and error slot for one field. The error's id is `${id}-error`. */
function Field({ id, label, optional = false, error, className, hidden, children }: FieldProps) {
  return (
    <div className={cx('quote-form__field', className)} hidden={hidden}>
      <label className="quote-form__label" htmlFor={id}>
        {label}
        {optional && <span className="quote-form__optional"> (optional)</span>}
      </label>
      {children}
      <div className="quote-form__message">
        {error && (
          <p id={`${id}-error`} className="quote-form__error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

interface YesNoGroupProps {
  id: string;
  legend: string;
  name: 'transport_required' | 'recurring';
  value: Choice;
  error?: string;
  className?: string;
  onChange: (value: YesNo) => void;
  onBlur: () => void;
}

/** Required Yes/No radio group in a fieldset. The error's id is `${id}-error`. */
function YesNoGroup({ id, legend, name, value, error, className, onChange, onBlur }: YesNoGroupProps) {
  const errorId = `${id}-error`;
  return (
    <fieldset className={cx('quote-form__field quote-form__group', className)}>
      <legend className="quote-form__label">{legend}</legend>
      <div className={cx('quote-form__options', error && 'quote-form__options--invalid')}>
        {YES_NO.map((option) => (
          <label key={option.value} className="quote-form__option" htmlFor={`${id}-${option.value}`}>
            <input
              id={`${id}-${option.value}`}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onBlur={onBlur}
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <div className="quote-form__message">
        {error && (
          <p id={errorId} className="quote-form__error">
            {error}
          </p>
        )}
      </div>
    </fieldset>
  );
}

export interface QuoteFormProps {
  /** id of the visible "Your Requirement" H2 that labels the form. */
  labelledBy?: string;
}

/** The Request a Quote form: fields, submit button, privacy note, success and error states. */
export function QuoteForm({ labelledBy }: QuoteFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const trapRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const focusNext = useRef<FieldName | null>(null);

  const [values, setValues] = useState<QuoteValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  // Browser-only state. Starts empty so the first client render matches the prerendered HTML.
  const [enhanced, setEnhanced] = useState(false);
  const [today, setToday] = useState('');

  useEffect(() => {
    setEnhanced(true);
    setToday(localDateString(new Date()));

    const form = formRef.current;
    const data = form ? new FormData(form) : null;
    const transportParam = new URLSearchParams(window.location.search).get('transport');
    setValues((prev) => {
      let next = prev;
      // Keep anything typed or chosen before the page finished loading.
      if (data) {
        for (const name of FIELD_ORDER) {
          const value = data.get(name);
          if (typeof value === 'string' && value !== next[name]) next = { ...next, [name]: value };
        }
      }
      // /request-a-quote?transport=yes preselects "Transportation Required: Yes".
      if (transportParam === 'yes' && !next.transport_required) next = { ...next, transport_required: 'yes' };
      return next;
    });
  }, []);

  // After a failed submit: move focus to the first invalid field once its error is rendered.
  useEffect(() => {
    const name = focusNext.current;
    if (!name) return;
    focusNext.current = null;
    const control = formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`);
    if (!control) return;
    control.focus({ preventScroll: true });
    (control.closest('.quote-form__field') ?? control).scrollIntoView({ block: 'nearest' });
  }, [errors]);

  useEffect(() => {
    if (status === 'success') doneRef.current?.focus();
  }, [status]);

  // Only called from event handlers (after hydration), so reading the clock here is safe.
  // Computed per call so a tab left open past midnight still rejects yesterday's date.
  const context = (): ValidationContext => ({
    today: localDateString(new Date()),
    dateIncomplete: dateRef.current?.validity.badInput ?? false,
  });

  function change(name: FieldName, value: string) {
    const next = { ...values, [name]: value } as QuoteValues;
    setValues(next);
    // Errors already showing clear (or update) as the user fixes them; no new ones appear while typing.
    if (Object.keys(errors).length > 0) {
      const fresh = validate(next, context());
      setErrors((prev) => {
        const kept: QuoteErrors = {};
        for (const key of Object.keys(prev) as FieldName[]) {
          if (fresh[key]) kept[key] = fresh[key];
        }
        return kept;
      });
    }
  }

  function blur(name: FieldName) {
    if (!attempted) return;
    const message = validate(values, context())[name];
    setErrors((prev) => {
      if (prev[name] === message) return prev;
      const next = { ...prev };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    const found = validate(values, context());
    setAttempted(true);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((name) => found[name]);
    if (firstInvalid) {
      setStatus('idle');
      focusNext.current = firstInvalid;
      return;
    }

    // Honeypot filled in: almost certainly a bot. Show success and send nothing.
    if (trapRef.current?.value) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    try {
      await submitQuote(toPayload(values));
      setStatus('success');
    } catch (error) {
      console.error('[QuoteForm] The requirement was not sent.', error);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div ref={doneRef} className="quote-form quote-form--done" role="status" tabIndex={-1}>
        <p>
          Requirement submitted. Our team will review the details and respond with availability and applicable
          commercial terms.
        </p>
      </div>
    );
  }

  const submitting = status === 'submitting';
  const fieldId = (name: FieldName) => `${uid}-${name}`;

  /** Shared props for a text-like control bound to `name`. */
  const bind = (name: TextFieldName) => ({
    id: fieldId(name),
    name,
    value: values[name],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => change(name, e.target.value),
    onBlur: () => blur(name),
    maxLength: MAX_LENGTHS[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${fieldId(name)}-error` : undefined,
  });

  return (
    <form
      ref={formRef}
      className="quote-form"
      method="post"
      action={site.formEndpoint || undefined}
      noValidate={enhanced}
      aria-labelledby={labelledBy}
      onSubmit={handleSubmit}
    >
      {import.meta.env.DEV && !site.formEndpoint && (
        <p className="quote-form__dev">
          <strong>Development only:</strong> this form isn't connected. <code>site.formEndpoint</code> is empty in{' '}
          <code>src/config/site.ts</code>, so submissions are only logged to the browser console.
        </p>
      )}

      <div className="quote-form__grid">
        <Field id={fieldId('company')} label="Company Name" error={errors.company}>
          <input {...bind('company')} className="quote-form__control" type="text" autoComplete="organization" required />
        </Field>

        <Field id={fieldId('contact_name')} label="Contact Person" error={errors.contact_name}>
          <input {...bind('contact_name')} className="quote-form__control" type="text" autoComplete="name" required />
        </Field>

        <Field id={fieldId('mobile')} label="Mobile Number" error={errors.mobile}>
          <input
            {...bind('mobile')}
            className="quote-form__control"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            pattern={MOBILE_PATTERN}
            required
          />
        </Field>

        <Field id={fieldId('email')} label="Business Email" error={errors.email}>
          <input {...bind('email')} className="quote-form__control" type="email" autoComplete="email" required />
        </Field>

        <Field id={fieldId('product')} label="Product Required" error={errors.product} className="quote-form__field--full">
          <select {...bind('product')} className="quote-form__control quote-form__select" required>
            {PRODUCT_OPTIONS.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </Field>

        <Field id={fieldId('quantity_kl')} label="Required Quantity (KL)" error={errors.quantity_kl}>
          <input
            {...bind('quantity_kl')}
            className="quote-form__control"
            type="number"
            inputMode="decimal"
            min="0.001"
            step="any"
            required
          />
        </Field>

        <Field id={fieldId('specification')} label="Product Specification / Grade" optional error={errors.specification}>
          <input {...bind('specification')} className="quote-form__control" type="text" />
        </Field>

        <Field id={fieldId('delivery_location')} label="Delivery Location" error={errors.delivery_location}>
          <input {...bind('delivery_location')} className="quote-form__control" type="text" required />
        </Field>

        <Field id={fieldId('delivery_date')} label="Required Delivery Date" optional error={errors.delivery_date}>
          <input
            {...bind('delivery_date')}
            ref={dateRef}
            className="quote-form__control"
            type="date"
            min={today || undefined}
            onFocus={() => setToday(localDateString(new Date()))}
          />
        </Field>

        <YesNoGroup
          id={fieldId('transport_required')}
          legend="Transportation Required"
          name="transport_required"
          value={values.transport_required}
          error={errors.transport_required}
          className="quote-form__field--new-row"
          onChange={(value) => change('transport_required', value)}
          onBlur={() => blur('transport_required')}
        />

        <YesNoGroup
          id={fieldId('recurring')}
          legend="Recurring Requirement"
          name="recurring"
          value={values.recurring}
          error={errors.recurring}
          onChange={(value) => change('recurring', value)}
          onBlur={() => blur('recurring')}
        />

        {/* Always in the markup; CSS hides it without JS, the hidden attribute with JS. */}
        <Field
          id={fieldId('frequency')}
          label="Expected Delivery Frequency"
          error={errors.frequency}
          className="quote-form__field--frequency"
          hidden={enhanced && values.recurring !== 'yes'}
        >
          <input
            {...bind('frequency')}
            className="quote-form__control"
            type="text"
            placeholder="e.g. Weekly, 2 loads per month"
            required={values.recurring === 'yes'}
          />
        </Field>

        <Field id={fieldId('notes')} label="Additional Requirements" optional error={errors.notes} className="quote-form__field--full">
          <textarea {...bind('notes')} className="quote-form__control quote-form__textarea" rows={5} />
        </Field>
      </div>

      {/* Honeypot for spam bots: hidden from people and assistive technology. */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Leave this field empty</label>
        <input ref={trapRef} id={`${uid}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="quote-form__actions">
        {/* Without an endpoint a no-JS submit would go nowhere, so the button stays disabled until hydration.
            [PROPOSED COPY] noscript sentence. */}
        {!site.formEndpoint && (
          <noscript>
            <p className="quote-form__noscript">
              This form needs JavaScript to send. You can also email your requirement to{' '}
              <EmailLink email={site.emailSales} />.
            </p>
          </noscript>
        )}

        <div className="quote-form__alert" role="alert">
          {status === 'error' && (
            <p>
              Your requirement couldn't be sent. Check your connection and try again, or email it to{' '}
              <EmailLink email={site.emailSales} />.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn--primary quote-form__submit"
          disabled={!enhanced && !site.formEndpoint}
          aria-disabled={submitting ? true : undefined}
        >
          {submitting ? 'Submitting…' : 'Submit Requirement'}
        </button>

        <p className="quote-form__privacy">
          We use these details only to respond to your requirement. See our{' '}
          <Link to={pages.privacy.path}>Privacy Policy</Link>.
        </p>
      </div>
    </form>
  );
}
