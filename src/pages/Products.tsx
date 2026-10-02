import { ButtonLink } from '../components/ButtonLink';
import { EmailLink, PlaceholderText } from '../components/ContactValues';
import { SiteImage } from '../components/SiteImage';
import { PageHeader, Section } from '../components/Section';
import { SpecTable, type SpecRow } from '../components/SpecTable';
import { pages } from '../config/pages';
import { images, optionalContent, site } from '../config/site';
import './Products.css';

const supplyOptions = [
  'Bulk tanker quantities',
  'Scheduled deliveries',
  'Single-load requirements',
  'Recurring supply requirements',
  'Destination-based commercial supply',
];

/** "Need a Specific Quantity?" — what the buyer should tell us. */
const quantityRows: SpecRow[] = [
  { label: 'Product', value: 'Anhydrous Denatured Ethanol' },
  { label: 'Quantity', value: 'Required KL' },
  { label: 'Delivery Location', value: 'Customer plant/depot' },
  { label: 'Required Delivery Date', value: 'Preferred date' },
  { label: 'Specification', value: 'Required product specification' },
];

/**
 * The only rows the 9.3 dev note allows. Prices are never published (Section 4), so any
 * other row added to the config (a "Price" or "Rate" row, say) is dropped, not rendered.
 */
const ALLOWED_SPEC_LABELS = new Set([
  'Grade/specification',
  'Available quantities',
  'Packaging/transport mode',
  'Origin/source',
  'Delivery locations',
  'Applicable taxes',
  'Availability',
]);

/**
 * Optional product specification (9.3 dev note): only the rows the owner has
 * filled in. Empty while every value in the config is empty.
 */
const specificationRows: SpecRow[] = optionalContent.productSpecification
  .filter((row) => row.value.trim() !== '' && ALLOWED_SPEC_LABELS.has(row.label))
  .map((row) => ({ label: row.label, value: <PlaceholderText value={row.value} /> }));

/** Products — /products (Brief 9.3). Specification-style and easy to scan. */
export default function Products() {
  return (
    <>
      <PageHeader title="Our Products" />

      <Section heading="Bulk Ethanol Supply">
        <p className="lead">
          Fortune Tradelinks focuses on the trading and supply of ethanol for eligible B2B and industrial requirements.
        </p>
        <p>Our primary product offering is:</p>

        <div className="products-sheet split">
          <div>
            <h2 className="products-sheet__title">Anhydrous Denatured Ethanol</h2>
            <p className="lead">
              Anhydrous denatured ethanol is supplied in bulk according to applicable product specifications and the
              requirements of the customer.
            </p>

            <div className="products-spec">
              <div className="products-spec__row">
                <h3>Supply Options</h3>
                <div className="products-spec__body">
                  <ul className="list">
                    {supplyOptions.map((option) => (
                      <li key={option}>{option}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="products-spec__row">
                <h3>Product Information</h3>
                <div className="products-spec__body">
                  <p>
                    Product specifications, quality parameters, documentation and applicable commercial terms are
                    confirmed for each transaction according to the agreed supply arrangement.
                  </p>
                  {specificationRows.length > 0 && (
                    <SpecTable
                      rows={specificationRows}
                      caption="Anhydrous Denatured Ethanol specification"
                      className="products-spec__table"
                    />
                  )}
                </div>
              </div>

              <div className="products-spec__row">
                <h3>Transportation</h3>
                <div className="products-spec__body">
                  <p>
                    Bulk transportation can be coordinated through suitable tanker vehicles depending on the route,
                    quantity, product requirements and applicable regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Narrow screens: the photo follows the specification (a placeholder stays hidden there). */}
          <div className="products-sheet__aside">
            <SiteImage
              image={images.products}
              placeholderLabel="Photo: close-up of a clear, colourless liquid sample in a glass laboratory bottle or flask, on a clean light background. No brand labels."
              placeholderDetails="Landscape 4:3 · at least 1200 × 900 px"
            />
          </div>
        </div>
      </Section>

      <Section alt heading="Need a Specific Quantity?" className="products-quantity">
        <p>Tell us:</p>
        <SpecTable rows={quantityRows} />
        <p>Our team can then check availability and provide applicable commercial terms.</p>
        <div className="btn-row">
          <ButtonLink to={pages.quote.path}>Request a Quote</ButtonLink>
        </div>
      </Section>

      <Section heading="Product Availability">
        <div className="products-availability">
          <p>
            Availability, pricing and delivery schedules are subject to source availability, market conditions,
            destination and applicable commercial terms.
          </p>
          <p className="products-availability__contact">
            For current availability:
            <br />
            Contact our Sales Team
            <br />
            <EmailLink email={site.emailSales} />
          </p>
        </div>
      </Section>
    </>
  );
}
