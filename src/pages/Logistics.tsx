import { CtaBand } from '../components/CtaBand';
import { FeatureGrid, type Feature } from '../components/FeatureGrid';
import { FlowDiagram } from '../components/FlowDiagram';
import { SiteImage } from '../components/SiteImage';
import { PageHeader, Section } from '../components/Section';
import { pages } from '../config/pages';
import { images } from '../config/site';
import './Logistics.css';

/* Copy: PROJECT_BRIEF.md, Section 9.6 (verbatim). */

const coordination: Feature[] = [
  {
    title: 'Tanker Arrangement',
    text: 'Suitable tanker vehicles can be coordinated according to product, quantity, route and applicable requirements.',
  },
  {
    title: 'Loading Coordination',
    text: 'We coordinate with the supply source and transporter to arrange loading schedules.',
  },
  {
    title: 'Route Coordination',
    text: 'Delivery routes and schedules are coordinated according to the agreed destination and transportation arrangement.',
  },
  {
    title: 'Delivery Scheduling',
    text: 'We coordinate dispatch and delivery timing with the relevant parties.',
  },
  {
    title: 'Documentation Coordination',
    text: 'Applicable transportation and transaction documents are coordinated as required for the shipment.',
  },
];

/** Supply Chain: the main use of the signature flow diagram. */
const supplyChain = ['Supplier', 'Loading Point', 'Tanker Transportation', 'Customer Location'];

const deliveryDetails = [
  'Loading location',
  'Delivery location',
  'Quantity',
  'Product',
  'Required delivery date',
  'Vehicle requirement',
  'Any specific customer instructions',
];

/** Pre-selects "Transportation Required: Yes" on the quote form. */
const logisticsQuotePath = `${pages.quote.path}?transport=yes`;

const SUPPLY_CHAIN_HEADING_ID = 'logistics-supply-chain-heading';

/** Logistics & Transportation — /logistics (Brief 9.6). */
export default function Logistics() {
  return (
    <>
      <PageHeader title="Logistics & Transportation" />

      <Section>
        <div className="split logistics-intro">
          <div>
            <h2>Coordinated Bulk Liquid Transportation</h2>
            <p className="lead">Efficient transportation is an important part of every bulk ethanol transaction.</p>
            <p>
              Fortune Tradelinks coordinates tanker transportation and delivery arrangements according to the agreed
              supply requirements.
            </p>
          </div>

          {/* Narrow screens: the photo follows the copy (a placeholder stays hidden there). */}
          <div className="logistics-intro__aside">
            <SiteImage
              image={images.logistics}
              placeholderLabel="Photo: a road tanker truck (plain, unbranded tank) on a highway or at a loading point, side or three-quarter view, in daylight. No readable company name or number plate."
              placeholderDetails="Landscape 3:2 · at least 1200 × 800 px"
              ratio="3 / 2"
            />
          </div>
        </div>
      </Section>

      <Section heading="Our Logistics Coordination">
        <FeatureGrid items={coordination} columns={3} />
      </Section>

      <Section alt className="logistics-chain">
        <h2 id={SUPPLY_CHAIN_HEADING_ID}>Supply Chain</h2>
        <div className="logistics-chain__flow">
          <FlowDiagram steps={supplyChain} labelledBy={SUPPLY_CHAIN_HEADING_ID} />
        </div>
        <p className="lead">
          Our objective is to keep communication clear between the supplier, transporter and customer throughout the
          delivery process.
        </p>
      </Section>

      <CtaBand
        heading="Bulk Delivery Requirements"
        button={{ label: 'Request Logistics Support', to: logisticsQuotePath }}
      >
        <p>When requesting transportation, please provide:</p>
        <ul className="list list--columns logistics-delivery__list">
          {deliveryDetails.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </CtaBand>
    </>
  );
}
