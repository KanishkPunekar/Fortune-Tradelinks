import { FeatureGrid, type Feature } from '../components/FeatureGrid';
import { FlowDiagram } from '../components/FlowDiagram';
import { PageHeader, Section } from '../components/Section';
import './AboutUs.css';

/* Copy: PROJECT_BRIEF.md, Section 9.2 (verbatim). */

const introHeadingId = 'about-intro-heading';

const introFlow = ['Sourcing', 'Commercial Coordination', 'Logistics', 'Delivery'];

const activities = [
  'Bulk ethanol sourcing and trading',
  'Commercial supply coordination',
  'Supplier and customer coordination',
  'Tanker transportation coordination',
  'Loading and delivery coordination',
  'Transaction documentation coordination',
];

const commitments: Feature[] = [
  {
    title: 'Reliability',
    text: 'We focus on dependable coordination from sourcing through delivery.',
  },
  {
    title: 'Transparency',
    text: 'We communicate product, quantity, pricing, freight and applicable taxes as clearly as possible.',
  },
  {
    title: 'Responsiveness',
    text: 'We understand that bulk procurement often depends on timing, and we aim to respond promptly to customer requirements.',
  },
  {
    title: 'Long-Term Relationships',
    text: 'We aim to develop professional and mutually beneficial relationships with suppliers, transport partners and customers.',
  },
];

/** About Us — /about-us. */
export default function AboutUs() {
  return (
    <>
      <PageHeader title="About Fortune Tradelinks" />

      <Section>
        <h2 id={introHeadingId}>Building Reliable B2B Supply Connections</h2>
        <p className="lead">
          Fortune Tradelinks is a B2B trading and supply company focused on bulk ethanol requirements.
        </p>
        <p>
          We work to connect customer requirements with suitable supply sources while coordinating the
          commercial and logistical aspects of each transaction.
        </p>
        <p>
          Our business approach is centered around reliable sourcing, clear commercial communication,
          efficient logistics coordination and professional customer service.
        </p>
        <div className="about-intro__flow">
          <FlowDiagram steps={introFlow} labelledBy={introHeadingId} size="compact" />
        </div>
      </Section>

      <Section heading="What We Do">
        <p>Our activities include:</p>
        <ul className="list list--columns about-activities">
          {activities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          We work according to the product specifications, quantities, delivery locations and commercial terms
          agreed for each transaction.
        </p>
      </Section>

      <Section heading="Our Approach">
        <p className="lead">Every bulk requirement is different.</p>
        <p>
          Quantity, product specification, source availability, destination, freight and delivery schedule can
          all affect a transaction.
        </p>
        <p>
          Our role is to coordinate these requirements and communicate the applicable commercial terms clearly
          to our customers.
        </p>
      </Section>

      <Section heading="Our Commitment" alt>
        <FeatureGrid items={commitments} columns={2} />
      </Section>

      <Section>
        <div className="split split--even">
          <div className="about-purpose__item">
            <h2>Our Vision</h2>
            <p className="lead">
              To develop Fortune Tradelinks into a trusted B2B trading and supply partner for bulk industrial
              products, beginning with a strong focus on ethanol.
            </p>
          </div>
          <div className="about-purpose__item">
            <h2>Our Mission</h2>
            <p className="lead">
              To provide customers with dependable sourcing, efficient commercial coordination and organized
              logistics support for their bulk supply requirements.
            </p>
          </div>
        </div>
        <div className="closing about-closing">
          <p>Fortune Tradelinks — Connecting Supply With Opportunity.</p>
        </div>
      </Section>
    </>
  );
}
