import { LegalContact, LegalPage } from './LegalPage';

/* Copy: PROJECT_BRIEF.md, Section 9.12 (template text, verbatim). */

/** Terms & Conditions — /terms. */
export default function Terms() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>By accessing and using this website, you agree to the following general terms.</p>

      <h2>Website Information</h2>
      <p>The information provided on this website is intended for general business and informational purposes.</p>
      <p>
        Product availability, specifications, prices, freight, taxes and delivery schedules may change and are
        subject to confirmation.
      </p>

      <h2>Quotations</h2>
      <p>
        Any quotation or commercial information provided by Fortune Tradelinks is subject to the specific terms
        mentioned in the applicable quotation or commercial document.
      </p>
      <p>A website enquiry does not constitute a confirmed order.</p>

      <h2>Product Availability</h2>
      <p>
        Product availability depends on source availability, quantity, destination, specifications and other
        commercial factors.
      </p>

      <h2>Pricing</h2>
      <p>Prices may vary according to market conditions, source, quantity, freight, taxes and delivery location.</p>
      <p>Final commercial terms will be communicated separately.</p>

      <h2>Delivery</h2>
      <p>
        Delivery schedules are subject to product availability, transportation arrangements, route conditions and
        other factors affecting the shipment.
      </p>

      <h2>Customer Information</h2>
      <p>
        Customers are responsible for providing accurate information regarding their company, product requirements,
        quantity, destination and applicable documentation requirements.
      </p>

      <h2>Regulatory Requirements</h2>
      <p>
        Each party is responsible for complying with the laws, regulations and requirements applicable to its role in
        a transaction.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        The content, branding, graphics, text and other materials on this website are the property of Fortune
        Tradelinks or are used with appropriate permission, unless otherwise stated.
      </p>

      <h2>Changes</h2>
      <p>Fortune Tradelinks may update website content and these terms from time to time.</p>

      <LegalContact intro="For questions regarding these Terms & Conditions:" />
    </LegalPage>
  );
}
