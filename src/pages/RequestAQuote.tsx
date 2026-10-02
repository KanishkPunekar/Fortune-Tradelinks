import { EmailLink } from '../components/ContactValues';
import { InlineList } from '../components/InlineList';
import { ProcessSteps, type ProcessStep } from '../components/ProcessSteps';
import { QuoteForm } from '../components/QuoteForm';
import { PageHeader, Section } from '../components/Section';
import { site } from '../config/site';
import './RequestAQuote.css';

/* Copy: PROJECT_BRIEF.md, Section 9.9 (verbatim). Form fields: Section 10 (QuoteForm). */

const formHeadingId = 'quote-form-heading';

const nextSteps: ProcessStep[] = [
  {
    title: 'Requirement Review',
    text: 'Our team reviews the product, quantity and destination details.',
  },
  {
    title: 'Availability Check',
    text: 'We check available supply sources.',
  },
  {
    title: 'Commercial Discussion',
    text: 'Applicable product, freight, tax and payment terms are discussed.',
  },
  {
    title: 'Quotation',
    text: 'A commercial offer is shared based on the confirmed details.',
  },
  {
    title: 'Order Processing',
    text: 'Once terms are mutually agreed, the transaction proceeds according to the agreed conditions.',
  },
];

const emailMention = ['Product', 'Quantity', 'Destination', 'Required Date'];

/**
 * Request a Quote — /request-a-quote (Brief 9.9). The main conversion page:
 * a compact intro, then the form high on the page with "What Happens Next?"
 * beside it on wide screens. The form comes first in the DOM, so it also
 * comes first on mobile.
 */
export default function RequestAQuote() {
  return (
    <div className="quote-page">
      <PageHeader title="Request a Quote">
        <h2 className="quote-intro__title">Looking for Bulk Ethanol?</h2>
        <p>
          Tell us about your requirement and our team will review the details and respond with availability and
          applicable commercial terms.
        </p>
      </PageHeader>

      <Section className="quote-main">
        <div className="split quote-layout">
          <div className="quote-layout__form">
            <h2 id={formHeadingId}>Your Requirement</h2>
            <QuoteForm labelledBy={formHeadingId} />
          </div>

          <div className="quote-layout__aside">
            <div className="quote-aside">
              <div className="quote-aside__block">
                <h2>What Happens Next?</h2>
                <ProcessSteps steps={nextSteps} layout="stack" />
              </div>

              <div className="quote-aside__block quote-aside__email">
                <h2>Prefer Email?</h2>
                <p>
                  Send your requirement directly to:
                  <br />
                  <EmailLink email={site.emailSales} className="quote-aside__email-link" />
                </p>
                <p className="quote-aside__mention-label">Please mention:</p>
                <InlineList items={emailMention} separator="+" />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
