import { Link } from 'react-router';
import { PlaceholderText } from '../components/ContactValues';
import { PageHeader, Section } from '../components/Section';
import { pages } from '../config/pages';
import { hasGstin, site } from '../config/site';
import './Compliance.css';

/* Copy: PROJECT_BRIEF.md, Section 9.8 (verbatim). List permits or licences
   only if the owner confirms they are held and applicable. Never show bank details. */

const practices = [
  'Clear commercial communication',
  'Proper transaction documentation',
  'Responsible supplier coordination',
  'Professional customer relationships',
  'Compliance with applicable requirements',
];

/** Compliance — /compliance (Brief 9.8). */
export default function Compliance() {
  return (
    <>
      <PageHeader title="Compliance" />

      <Section heading="Professional Business Practices">
        <p className="lead">
          Fortune Tradelinks aims to conduct its business in accordance with applicable commercial, tax, transportation
          and regulatory requirements.
        </p>
      </Section>

      {/* Three areas side by side on wide screens; each keeps its own H2. */}
      <Section alt>
        <div className="compliance-areas">
          <div className="compliance-areas__item">
            <h2>Tax &amp; Commercial Documentation</h2>
            <p>
              Transactions are documented according to the applicable tax and commercial requirements, including
              applicable invoicing and e-way bill requirements.
            </p>
            {/* Shown only once site.gstin is set. */}
            {hasGstin && (
              <p className="compliance-gstin">
                GSTIN: <PlaceholderText value={site.gstin} />
              </p>
            )}
          </div>
          <div className="compliance-areas__item">
            <h2>Transportation Compliance</h2>
            <p>
              Transportation arrangements are coordinated with consideration to applicable requirements for the
              product, vehicle, route and destination.
            </p>
          </div>
          <div className="compliance-areas__item">
            <h2>Product &amp; Supply Requirements</h2>
            <p>
              Product specifications, documentation and supply arrangements are confirmed according to the applicable
              transaction and customer requirements.
            </p>
          </div>
        </div>
      </Section>

      <Section heading="Responsible Business">
        <p>We aim to maintain:</p>
        <ul className="list list--columns compliance-practices">
          {practices.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="compliance-notice">
          <h2>Important</h2>
          <p>
            Specific regulatory requirements can vary according to the product, quantity, source, destination,
            transportation route and applicable laws.
          </p>
          <p>
            Customers and suppliers should ensure that their respective obligations are satisfied before proceeding
            with a transaction.
          </p>
          <p>
            For transaction-specific documentation requirements, <Link to={pages.contact.path}>contact our team</Link>.
          </p>
        </div>
        <div className="closing compliance-closing">
          <p>{site.name}</p>
        </div>
      </Section>
    </>
  );
}
