import { ButtonLink } from '../components/ButtonLink';
import { EmailLink } from '../components/ContactValues';
import { ClientLogos } from '../components/ClientLogos';
import { CtaBand } from '../components/CtaBand';
import { FeatureGrid, type Feature } from '../components/FeatureGrid';
import { FlowDiagram } from '../components/FlowDiagram';
import { InlineList } from '../components/InlineList';
import { ProcessSteps, type ProcessStep } from '../components/ProcessSteps';
import { Section } from '../components/Section';
import { SiteImage } from '../components/SiteImage';
import { pages } from '../config/pages';
import { clientsSection, images, site } from '../config/site';
import { cx } from '../lib/cx';
import './Home.css';

/** Copy: PROJECT_BRIEF.md Section 9.1, verbatim. */

const heroTerms = ['Anhydrous Denatured Ethanol', 'Bulk Supply', 'Logistics Coordination'];

const approachSteps = [
  'Requirement',
  'Sourcing',
  'Commercial Coordination',
  'Loading',
  'Transportation',
  'Delivery',
];

const productTerms = ['Bulk quantities', 'Tanker transportation', 'Commercial supply'];

const whyUs: Feature[] = [
  {
    title: 'Reliable Sourcing',
    text: 'We coordinate with supply sources to identify suitable availability for customer requirements.',
  },
  {
    title: 'Bulk Supply',
    text: 'We handle bulk quantity requirements and coordinate the associated loading and transportation process.',
  },
  {
    title: 'Logistics Coordination',
    text: 'We coordinate tanker transportation and delivery schedules according to the agreed commercial arrangement.',
  },
  {
    title: 'Professional Documentation',
    text: 'We coordinate transaction and delivery documentation applicable to the supply arrangement.',
  },
  {
    title: 'Transparent Commercial Communication',
    text: 'Our quotations clearly communicate product, quantity, delivery location, freight and applicable taxes as relevant to the transaction.',
  },
];

const supplyProcess: ProcessStep[] = [
  {
    title: 'Share Your Requirement',
    text: 'Tell us your product, quantity, specification and delivery location.',
  },
  {
    title: 'Availability & Commercial Offer',
    text: 'We check availability and provide applicable commercial terms.',
  },
  {
    title: 'Vehicle & Loading Coordination',
    text: 'Transportation and loading arrangements are coordinated according to the agreed terms.',
  },
  {
    title: 'Delivery',
    text: 'The material is transported to the designated customer location.',
  },
];

const ctaTerms = ['Product', 'Quantity', 'Delivery Location', 'Required Date'];

/** Home: understand the business → see it handles bulk ethanol → submit an enquiry. */
export default function Home() {
  return (
    <>
      {/* Green brand panel with the message and enquiry buttons, beside a photo of the same height. */}
      <section className="home-hero">
        <div className="container home-hero__inner">
          <div className="home-hero__panel on-dark">
            {/* One sentence per line on wide screens; the text itself is unchanged. */}
            <h1 className="home-hero__title">
              <span>Reliable Ethanol Supply.</span> <span>Professional Trading.</span>{' '}
              <span>Efficient Delivery.</span>
            </h1>
            <p className="home-hero__intro">
              Fortune Tradelinks is a B2B trading and supply company focused on bulk ethanol requirements. We
              coordinate sourcing, commercial transactions and transportation to help industrial and commercial
              customers meet their bulk supply requirements efficiently.
            </p>
            <InlineList items={heroTerms} className="home-hero__terms" />
            <div className="btn-row home-hero__actions">
              <ButtonLink to={pages.quote.path} variant="primary">
                Request a Quote
              </ButtonLink>
              <ButtonLink to={pages.contact.path} variant="secondary">
                Contact Us
              </ButtonLink>
            </div>
          </div>
          <SiteImage
            image={images.homeHero}
            className={cx('home-hero__media', !images.homeHero.src && 'home-hero__media--placeholder')}
            ratio="none"
            eager
            placeholderLabel="Photo: a row of large white or steel storage tanks at a bulk liquid / fuel terminal, in daylight. No company names, logos or signs on the tanks."
            placeholderDetails="Square (or 4:5 upright) · at least 1400 × 1400 px · keep the tanks in the centre: the edges get cropped"
          />
        </div>
      </section>

      <Section heading="Your Requirement. Our Supply Network." className="home-network">
        <p>
          Fortune Tradelinks works with suppliers, manufacturers, transporters and customers to coordinate bulk
          ethanol transactions based on product specifications, quantity, destination and delivery requirements.
        </p>
        <p id="home-approach" className="home-network__label">
          Our approach is simple:
        </p>
        <FlowDiagram steps={approachSteps} labelledBy="home-approach" />
      </Section>

      <Section heading="Our Product" alt className="home-product">
        <div className="home-product__sheet">
          <div className="home-product__main">
            <h3 className="home-product__name">Anhydrous Denatured Ethanol</h3>
            <p>
              We facilitate bulk supply of anhydrous denatured ethanol according to applicable product specifications
              and customer requirements.
            </p>
            <InlineList items={productTerms} className="home-product__terms home-terms" />
          </div>
          <div className="home-product__enquire">
            <p>For current availability, pricing and delivery options, contact our sales team.</p>
            <ButtonLink to={pages.quote.path} variant="primary">
              Enquire Now
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section heading="Why Work With Fortune Tradelinks?">
        <FeatureGrid items={whyUs} columns={3} />
      </Section>

      {/* [PROPOSED COPY] heading and intro: not in the brief; added at the owner's request. */}
      {clientsSection.enabled && (
        <Section heading="Our Clients" alt className="home-clients">
          <p>We supply ethanol to, and provide logistics services for, these companies.</p>
          <ClientLogos clients={clientsSection.clients} />
        </Section>
      )}

      <Section heading="Our Supply Process">
        <ProcessSteps steps={supplyProcess} columns={4} />
      </Section>

      <CtaBand
        heading="Looking for Bulk Ethanol?"
        include={ctaTerms}
        button={{ label: 'Request a Quote', to: pages.quote.path }}
      >
        <p>
          Whether you require a single tanker load or a recurring bulk supply arrangement, share your requirement
          with our team.
        </p>
      </CtaBand>

      <div className="home-contact">
        <div className="container home-contact__inner">
          <div className="home-contact__brand">
            <p className="home-contact__name">{site.name}</p>
            <p className="home-contact__tagline">{site.tagline}</p>
          </div>
          <div className="home-contact__emails">
            <p>
              <span className="home-contact__label">Email:</span> <EmailLink email={site.emailInfo} />
            </p>
            <p>
              <span className="home-contact__label">Sales:</span> <EmailLink email={site.emailSales} />
            </p>
          </div>
          <div className="home-contact__action">
            <ButtonLink to={pages.contact.path} variant="secondary">
              Contact Us
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
