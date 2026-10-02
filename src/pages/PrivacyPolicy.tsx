import { LegalContact, LegalList, LegalPage } from './LegalPage';

/* Copy: PROJECT_BRIEF.md, Section 9.11 (template text, verbatim). */

const informationCollected = [
  'Name',
  'Company name',
  'Email address',
  'Phone number',
  'Product requirements',
  'Quantity requirements',
  'Delivery location',
  'Other information voluntarily provided by you',
];

const informationUses = [
  'Respond to enquiries',
  'Prepare quotations',
  'Understand customer requirements',
  'Communicate regarding products and services',
  'Coordinate business transactions',
  'Improve our website and customer service',
];

/** Privacy Policy — /privacy-policy. */
export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Fortune Tradelinks respects the privacy of visitors to its website.</p>
      <p>This Privacy Policy explains how information submitted through our website may be collected and used.</p>

      <h2>Information We May Collect</h2>
      <p>When you contact us or submit a quotation request, we may collect information such as:</p>
      <LegalList items={informationCollected} />

      <h2>How We Use Information</h2>
      <p>Information submitted through the website may be used to:</p>
      <LegalList items={informationUses} />

      <h2>Information Security</h2>
      <p>
        We take reasonable measures to protect information submitted through our website. However, no internet
        transmission can be guaranteed to be completely secure.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        Our website may use third-party services such as hosting, analytics, email or contact-form services. Such
        services may process information according to their own privacy policies.
      </p>

      <LegalContact intro="For questions regarding this Privacy Policy, contact:" />
    </LegalPage>
  );
}
