/**
 * Request a Quote: fields, validation rules and payload (PROJECT_BRIEF.md, Section 10).
 *
 * Shared by the form (src/components/QuoteForm.tsx) and the server function that receives it
 * (api/quote.ts), so the browser and the server apply exactly the same rules.
 * Keep this file free of imports: the server function loads it without a bundler.
 */

/** Options for "Product Required". Add a product only once the owner confirms it is supplied. */
export const PRODUCT_OPTIONS: readonly string[] = ['Anhydrous Denatured Ethanol'];

export type Choice = '' | 'yes' | 'no';
export type YesNo = Exclude<Choice, ''>;

export interface QuoteValues {
  company: string;
  contact_name: string;
  mobile: string;
  email: string;
  product: string;
  quantity_kl: string;
  specification: string;
  delivery_location: string;
  delivery_date: string;
  transport_required: Choice;
  recurring: Choice;
  frequency: string;
  notes: string;
}

export type FieldName = keyof QuoteValues;
export type QuoteErrors = Partial<Record<FieldName, string>>;

/** Field names in DOM order: the first invalid one receives focus. */
export const FIELD_ORDER: FieldName[] = [
  'company',
  'contact_name',
  'mobile',
  'email',
  'product',
  'quantity_kl',
  'specification',
  'delivery_location',
  'delivery_date',
  'transport_required',
  'recurring',
  'frequency',
  'notes',
];

export const INITIAL_VALUES: QuoteValues = {
  company: '',
  contact_name: '',
  mobile: '',
  email: '',
  product: PRODUCT_OPTIONS[0],
  quantity_kl: '',
  specification: '',
  delivery_location: '',
  delivery_date: '',
  transport_required: '',
  recurring: 'no',
  frequency: '',
  notes: '',
};

/** Longest accepted value per field (the form's maxLength and the server's limit). */
export const MAX_LENGTHS: Record<FieldName, number> = {
  company: 200,
  contact_name: 120,
  mobile: 20,
  email: 254,
  product: 100,
  quantity_kl: 20,
  specification: 300,
  delivery_location: 300,
  delivery_date: 10,
  transport_required: 3,
  recurring: 3,
  frequency: 200,
  notes: 3000,
};

/** Inline error messages [PROPOSED COPY]. Each names the fix. */
export const MESSAGES = {
  company: 'Enter your company name.',
  contact_name: "Enter the contact person's name.",
  mobile: 'Enter a 10-digit mobile number.',
  email: 'Enter a valid email address.',
  product: 'Select a product.',
  quantity_kl: 'Enter a quantity greater than 0.',
  delivery_location: 'Enter the delivery location.',
  delivery_date: 'Choose today or a later date.',
  transport_required: 'Select whether transportation is required.',
  recurring: 'Select whether this is a recurring requirement.',
  frequency: 'Enter the expected delivery frequency.',
} satisfies QuoteErrors;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** "+91" plus the 10 digits, or null when the number isn't valid. */
export function normaliseMobile(value: string): string | null {
  const match = /^(?:\+91|0)?(\d{10})$/.exec(value.replace(/[\s-]/g, ''));
  return match ? `+91${match[1]}` : null;
}

/** Local calendar date as YYYY-MM-DD (the format of a date input's value). */
export function localDateString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export interface ValidationContext {
  /** The earliest allowed delivery date (YYYY-MM-DD); empty to skip the check. */
  today: string;
  /** The date input holds a partly typed date the browser can't read. */
  dateIncomplete: boolean;
}

/** Pure validation: field name → error message for every invalid field. */
export function validate(v: QuoteValues, ctx: ValidationContext): QuoteErrors {
  const errors: QuoteErrors = {};
  if (!v.company.trim()) errors.company = MESSAGES.company;
  if (!v.contact_name.trim()) errors.contact_name = MESSAGES.contact_name;
  if (!normaliseMobile(v.mobile)) errors.mobile = MESSAGES.mobile;
  if (!EMAIL_PATTERN.test(v.email.trim())) errors.email = MESSAGES.email;
  if (!PRODUCT_OPTIONS.includes(v.product)) errors.product = MESSAGES.product;

  const quantity = Number(v.quantity_kl);
  if (!v.quantity_kl.trim() || !Number.isFinite(quantity) || quantity <= 0) {
    errors.quantity_kl = MESSAGES.quantity_kl;
  }

  if (!v.delivery_location.trim()) errors.delivery_location = MESSAGES.delivery_location;

  const date = v.delivery_date;
  if (ctx.dateIncomplete || (date && (!DATE_PATTERN.test(date) || (ctx.today !== '' && date < ctx.today)))) {
    errors.delivery_date = MESSAGES.delivery_date;
  }

  if (!v.transport_required) errors.transport_required = MESSAGES.transport_required;
  if (!v.recurring) errors.recurring = MESSAGES.recurring;
  if (v.recurring === 'yes' && !v.frequency.trim()) errors.frequency = MESSAGES.frequency;
  return errors;
}

/** JSON body the form POSTs to site.formEndpoint. Keys match the form field names. */
export interface QuotePayload {
  company: string;
  contact_name: string;
  /** "+91" followed by the 10-digit number. */
  mobile: string;
  email: string;
  product: string;
  quantity_kl: number;
  specification: string;
  delivery_location: string;
  /** YYYY-MM-DD, or "" when not given. */
  delivery_date: string;
  transport_required: YesNo;
  recurring: YesNo;
  /** Present only when recurring is "yes". */
  frequency?: string;
  notes: string;
}

/** Field labels (final copy from the brief), in form order: used in the email to the sales team. */
export const FIELD_LABELS: [keyof QuotePayload, string][] = [
  ['company', 'Company Name'],
  ['contact_name', 'Contact Person'],
  ['mobile', 'Mobile Number'],
  ['email', 'Business Email'],
  ['product', 'Product Required'],
  ['quantity_kl', 'Required Quantity (KL)'],
  ['specification', 'Product Specification / Grade'],
  ['delivery_location', 'Delivery Location'],
  ['delivery_date', 'Required Delivery Date'],
  ['transport_required', 'Transportation Required'],
  ['recurring', 'Recurring Requirement'],
  ['frequency', 'Expected Delivery Frequency'],
  ['notes', 'Additional Requirements'],
];

/** Build the payload from values that have passed validate(). */
export function toPayload(v: QuoteValues): QuotePayload {
  const recurring = v.recurring as YesNo;
  return {
    company: v.company.trim(),
    contact_name: v.contact_name.trim(),
    mobile: normaliseMobile(v.mobile) ?? v.mobile.trim(),
    email: v.email.trim(),
    product: v.product,
    quantity_kl: Number(v.quantity_kl),
    specification: v.specification.trim(),
    delivery_location: v.delivery_location.trim(),
    delivery_date: v.delivery_date,
    transport_required: v.transport_required as YesNo,
    recurring,
    ...(recurring === 'yes' ? { frequency: v.frequency.trim() } : {}),
    notes: v.notes.trim(),
  };
}

/**
 * Server side: turn a submitted body (JSON payload or form fields) back into form values.
 * Unknown keys are ignored; values over MAX_LENGTHS make the submission invalid.
 */
export function valuesFromInput(input: Record<string, unknown>): { values: QuoteValues; tooLong: FieldName[] } {
  const values = { ...INITIAL_VALUES, product: '', recurring: '' } as QuoteValues;
  const tooLong: FieldName[] = [];
  for (const name of FIELD_ORDER) {
    const raw = input[name];
    const value = typeof raw === 'string' || typeof raw === 'number' ? String(raw) : '';
    if (value.length > MAX_LENGTHS[name]) tooLong.push(name);
    if (name === 'transport_required' || name === 'recurring') {
      values[name] = value === 'yes' || value === 'no' ? value : '';
    } else {
      values[name] = value;
    }
  }
  return { values, tooLong };
}
