import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../components/ButtonLink';
import { EmailLink, PhoneValue, PlaceholderText } from '../components/ContactValues';
import { PageHeader, Section } from '../components/Section';
import { SpecTable, type SpecRow } from '../components/SpecTable';
import { pages } from '../config/pages';
import { hasAddress, hasPhone, site, telHref } from '../config/site';
import './Contact.css';

/* Copy: PROJECT_BRIEF.md, Section 9.10 (verbatim). */

const contactRows: SpecRow[] = [
  {
    label: 'Sales Enquiries',
    value: (
      <>
        Email: <EmailLink email={site.emailSales} />
      </>
    ),
  },
  {
    label: 'General Enquiries',
    value: (
      <>
        Email: <EmailLink email={site.emailInfo} />
      </>
    ),
  },
  { label: 'Phone', value: <PhoneValue /> },
  {
    label: 'Office',
    value: (
      <>
        {site.name}, <PlaceholderText value={site.address} />
      </>
    ),
  },
];

const includeItems = [
  'Product',
  'Quantity',
  'Delivery location',
  'Required delivery date',
  'Product specification',
  'Transportation requirement',
];

/** The office map is shown only for a physical office with a real address (9.10 dev note). */
const showOfficeMap = site.showMap && hasAddress;

/**
 * Click-to-load Google Maps embed. Nothing is fetched from Google until the
 * visitor asks for the map. The button stays disabled until the page has
 * hydrated, so it never looks usable without JavaScript.
 */
function OfficeMap() {
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  // The button disappears on click; move focus to the map that replaces it.
  useEffect(() => {
    if (loaded) frameRef.current?.focus();
  }, [loaded]);

  return (
    <div className="contact-map">
      {loaded ? (
        <iframe
          ref={frameRef}
          className="contact-map__frame"
          title="Map showing the Fortune Tradelinks office"
          src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="contact-map__placeholder">
          <button type="button" className="btn btn--outline" disabled={!ready} onClick={() => setLoaded(true)}>
            Show map
          </button>
        </div>
      )}
    </div>
  );
}

/** Contact Us — /contact (Brief 9.10). */
export default function Contact() {
  return (
    <>
      <PageHeader title="Contact Fortune Tradelinks" />

      <Section>
        <div className="split split--even contact-intro">
          <div>
            <h2>Let's Discuss Your Requirement</h2>
            <p className="lead">
              Whether you are looking for a single bulk tanker load or a recurring ethanol supply arrangement, our team
              is available to discuss your requirement.
            </p>
            {/* Request a Quote is the filled green pill; Call Us and Email Us are green-outlined pills.
                Call Us is hidden while site.phone is still a placeholder. */}
            <div className="btn-row">
              {hasPhone && (
                <ButtonLink to={telHref(site.phone)} variant="secondary">
                  Call Us
                </ButtonLink>
              )}
              <ButtonLink to={`mailto:${site.emailSales}`} variant="secondary">
                Email Us
              </ButtonLink>
              <ButtonLink to={pages.quote.path}>Request a Quote</ButtonLink>
            </div>
          </div>

          <div className="contact-details">
            <SpecTable rows={contactRows} caption="Contact details" captionHidden />
            {showOfficeMap && <OfficeMap />}
          </div>
        </div>
      </Section>

      <Section heading="Send Us Your Requirement">
        <p>For faster assistance, please include:</p>
        <ul className="list list--columns contact-include">
          {includeItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>Our team will review your requirement and respond with the relevant commercial information.</p>

        <div className="closing contact-closing">
          <p className="contact-closing__name">{site.name}</p>
          <p className="contact-closing__tagline">{site.tagline}</p>
          <p>Reliable Supply. Professional Coordination.</p>
        </div>
      </Section>
    </>
  );
}
