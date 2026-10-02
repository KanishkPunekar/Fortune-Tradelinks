import { CtaBand } from '../components/CtaBand';
import { FeatureGrid, type Feature } from '../components/FeatureGrid';
import { PageHeader, Section } from '../components/Section';
import { pages } from '../config/pages';
import './Industries.css';

/* Copy: PROJECT_BRIEF.md, Section 9.5 (verbatim). Don't add further
   industries or specific applications unless the owner confirms them. */

const customerGroups: Feature[] = [
  {
    title: 'Industrial & Manufacturing Customers',
    text: 'We coordinate bulk ethanol requirements for eligible industrial and manufacturing applications according to customer specifications.',
  },
  {
    title: 'Energy & Fuel-Related Businesses',
    text: 'We can coordinate bulk ethanol requirements for eligible businesses involved in fuel and energy-related operations, subject to applicable requirements.',
  },
  {
    title: 'Commercial Buyers',
    text: 'We work with commercial procurement teams requiring bulk quantities and organized delivery coordination.',
  },
];

const scheduleFactors = [
  'Monthly quantity',
  'Delivery frequency',
  'Delivery locations',
  'Product specifications',
  'Transportation requirements',
  'Commercial terms',
];

const quoteIncludes = ['Product', 'Quantity', 'Specification', 'Destination', 'Delivery Date'];

/** Industries We Serve — /industries. */
export default function Industries() {
  return (
    <>
      <PageHeader title="Industries We Serve" />

      <Section heading="Supporting Bulk Industrial Supply Requirements">
        <p className="lead">
          Fortune Tradelinks works with B2B customers requiring bulk ethanol supply, subject to product
          suitability, availability and applicable regulations.
        </p>
        <FeatureGrid items={customerGroups} columns={3} />
      </Section>

      <Section heading="Recurring Industrial Requirements">
        <p>For customers with regular requirements, we can discuss supply schedules based on:</p>
        <ul className="list list--columns industries-factors">
          {scheduleFactors.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <CtaBand
        heading="Have a Bulk Requirement?"
        include={quoteIncludes}
        button={{ label: 'Request a Quote', to: pages.quote.path }}
      >
        <p>Share your requirement with our sales team.</p>
      </CtaBand>
    </>
  );
}
