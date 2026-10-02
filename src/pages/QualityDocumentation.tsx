import { EmailLink } from '../components/ContactValues';
import { PageHeader, Section } from '../components/Section';
import { site } from '../config/site';
import './QualityDocumentation.css';

/* Copy: PROJECT_BRIEF.md, Section 9.7 (verbatim). Never show certificates
   unless the owner supplies genuine, current ones. */

const productDocuments = [
  'Product specification',
  'Certificate of Analysis (COA)',
  'Quality-related documents',
  'Batch information',
  'Other supplier documentation',
];

const commercialDocuments = [
  'Quotation',
  'Purchase/Sale Order',
  'Tax Invoice',
  'E-way Bill',
  'Delivery documentation',
  'Transport documentation',
];

/** Quality & Documentation — /quality-documentation (Brief 9.7). Builds trust with corporate buyers. */
export default function QualityDocumentation() {
  return (
    <>
      <PageHeader title="Quality & Documentation" />

      <Section heading="Clear Documentation for Every Transaction">
        <p className="lead">
          Fortune Tradelinks understands that professional documentation is an important part of B2B bulk supply.
        </p>
        <p>
          Documentation is coordinated according to the product, transaction structure, supplier requirements and
          applicable regulations.
        </p>
      </Section>

      {/* Product and commercial documents as a specification-style pair. */}
      <Section alt>
        <div className="split split--even quality-docs">
          <div className="quality-docs__group">
            <h2>Product Documentation</h2>
            <p>Depending on the transaction, applicable product documentation may include:</p>
            <ul className="list">
              {productDocuments.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </div>
          <div className="quality-docs__group">
            <h2>Commercial Documentation</h2>
            <p>Applicable transaction documents may include:</p>
            <ul className="list">
              {commercialDocuments.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section heading="Customer Requirements">
        <p>
          If your organization requires specific documentation before loading or delivery, please communicate those
          requirements to our team during the quotation/order process.
        </p>
        <p>
          We will coordinate the applicable documents with the relevant parties wherever available and applicable.
        </p>
      </Section>

      <Section heading="Documentation Matters">
        <div className="quality-matters">
          <p className="lead">
            Our objective is to maintain clear communication and proper documentation throughout the supply process.
          </p>
          <p className="quality-matters__contact">
            For documentation requirements:
            <br />
            <EmailLink email={site.emailSales} />
          </p>
        </div>
      </Section>
    </>
  );
}
