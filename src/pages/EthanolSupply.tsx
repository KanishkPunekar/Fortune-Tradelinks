import { ButtonLink } from '../components/ButtonLink';
import { EmailLink } from '../components/ContactValues';
import { CtaBand } from '../components/CtaBand';
import { FeatureGrid, type Feature } from '../components/FeatureGrid';
import { FlowDiagram } from '../components/FlowDiagram';
import { InlineList } from '../components/InlineList';
import { ProcessSteps, type ProcessStep } from '../components/ProcessSteps';
import { PageHeader, Section } from '../components/Section';
import { pages } from '../config/pages';
import { optionalContent, site } from '../config/site';
import './EthanolSupply.css';

const handled: Feature[] = [
  {
    title: 'Bulk Requirements',
    text: 'We coordinate requirements ranging from individual tanker loads to recurring bulk requirements, subject to availability.',
  },
  {
    title: 'Source Coordination',
    text: 'We communicate with suitable supply sources to check availability against customer requirements.',
  },
  {
    title: 'Commercial Coordination',
    text: 'We coordinate product pricing, quantity, freight, taxes and other applicable commercial terms.',
  },
  {
    title: 'Transportation',
    text: 'Suitable tanker transportation can be coordinated according to the route and supply arrangement.',
  },
  {
    title: 'Delivery Coordination',
    text: 'We coordinate loading and delivery schedules with the relevant parties.',
  },
];

/** Step 1's "Provide:" run. Each item is kept on one line and lines only break after a "·". */
const provideItems = [
  'Product',
  'Quantity',
  'Specification',
  'Delivery location',
  'Required delivery date',
  'Transportation requirement',
];
const NBSP = ' ';

/** How It Works: a real sequence, so it is numbered. */
const steps: ProcessStep[] = [
  {
    title: 'Submit Your Requirement',
    text: `Provide: ${provideItems.map((item) => item.replaceAll(' ', NBSP)).join(`${NBSP}· `)}`,
  },
  {
    title: 'Availability Check',
    text: 'Our team checks the requirement against available supply sources.',
  },
  {
    title: 'Commercial Offer',
    text: 'We provide applicable commercial terms based on the confirmed supply arrangement.',
  },
  {
    title: 'Order Confirmation',
    text: 'Once the commercial terms are mutually agreed, the transaction is processed according to the agreed conditions.',
  },
  {
    title: 'Loading',
    text: 'Vehicle and loading arrangements are coordinated with the supply source.',
  },
  {
    title: 'Transportation & Delivery',
    text: 'The tanker is dispatched to the designated customer location and delivery is coordinated.',
  },
];

const recurringTerms = ['Monthly Quantity', 'Delivery Locations', 'Frequency', 'Specification'];

const quoteDetails = [
  'Quantity',
  'Product',
  'Destination',
  'Required Date',
  'Specification',
  'Transportation Required: Yes / No',
];

const HOW_HEADING_ID = 'how-it-works-heading';

/** Bulk Ethanol Supply — /ethanol-supply (Brief 9.4). For buyers searching for ethanol suppliers. */
export default function EthanolSupply() {
  const { typicalQuantities } = optionalContent;

  return (
    <>
      <PageHeader title="Bulk Ethanol Supply" />

      <Section heading="Your Bulk Ethanol Requirement, Coordinated From Source to Destination" className="ethanol-intro">
        <p className="lead">
          Fortune Tradelinks facilitates bulk ethanol supply by coordinating sourcing, commercial requirements,
          transportation and delivery.
        </p>
        <p>
          We work with customers who require ethanol in bulk quantities and coordinate the supply process according to
          the agreed transaction terms.
        </p>
      </Section>

      <Section heading="What We Handle">
        <FeatureGrid items={handled} columns={3} />
      </Section>

      {/* Optional block, off by default: shown only once the owner confirms the quantities. */}
      {typicalQuantities.enabled && (
        <Section heading="Typical Requirements We Handle">
          <InlineList items={typicalQuantities.items} separator="·" />
        </Section>
      )}

      <Section alt className="ethanol-how">
        <h2 id={HOW_HEADING_ID}>How It Works</h2>
        {/* A visual summary of the numbered steps below, so hidden from screen readers. */}
        <div className="ethanol-how__flow" aria-hidden="true">
          <FlowDiagram steps={steps.map((step) => step.title)} size="compact" />
        </div>
        <ProcessSteps steps={steps} columns={3} />
      </Section>

      <Section heading="Recurring Requirements">
        <p>If your business requires regular ethanol supply, contact us with your expected:</p>
        <InlineList items={recurringTerms} />
        <p>We can discuss the applicable supply arrangement based on availability and commercial terms.</p>
        <div className="btn-row">
          <ButtonLink to={pages.quote.path}>Discuss Your Requirement</ButtonLink>
        </div>
      </Section>

      <CtaBand heading="Request a Quote" button={{ label: 'Request a Quote', to: pages.quote.path }}>
        <p>For a quotation, please provide:</p>
        <ul className="list list--columns ethanol-quote__list">
          {quoteDetails.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
        <p className="ethanol-quote__email">
          <EmailLink email={site.emailSales} />
        </p>
      </CtaBand>
    </>
  );
}
