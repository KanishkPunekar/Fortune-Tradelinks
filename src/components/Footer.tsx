import { useId } from 'react';
import { NavLink } from 'react-router';
import { footerLegalLinks, footerMoreLinks, footerQuickLinks, pages, type NavItem } from '../config/pages';
import { hasGstin, logo, site } from '../config/site';
import { EmailLink, PhoneValue } from './ContactValues';
import { InlineList } from './InlineList';
import './Footer.css';

/** Footer links; NavLink marks the current page with aria-current="page". */
function FooterLink({ item }: { item: NavItem }) {
  return (
    <NavLink to={item.to} end={item.to === pages.home.path} className="site-footer__link">
      {item.label}
    </NavLink>
  );
}

/** Site footer, the same on every page (Section 8). */
export function Footer() {
  const quickId = useId();
  const moreId = useId();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <img
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt={site.name}
              className="site-footer__logo logo-variant--light"
              loading="lazy"
              decoding="async"
            />
            <img
              src={logo.srcDark}
              width={logo.width}
              height={logo.height}
              alt={site.name}
              className="site-footer__logo logo-variant--dark"
              loading="lazy"
              decoding="async"
            />
            <p className="site-footer__tagline">{site.tagline}</p>
            <div className="site-footer__services">
              <InlineList items={['Bulk Ethanol', 'B2B Supply', 'Logistics Coordination']} />
            </div>
          </div>

          <div>
            <h2 id={quickId} className="site-footer__heading">
              Quick Links
            </h2>
            <nav aria-labelledby={quickId}>
              <ul className="site-footer__links" role="list">
                {footerQuickLinks.map((item) => (
                  <li key={item.to}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 id={moreId} className="site-footer__heading">
              More
            </h2>
            <nav aria-labelledby={moreId}>
              <ul className="site-footer__links" role="list">
                {footerMoreLinks.map((item) => (
                  <li key={item.to}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="site-footer__heading">Contact</h2>
            <address className="site-footer__contact">
              <ul className="site-footer__links" role="list">
                <li>
                  <EmailLink email={site.emailSales} className="site-footer__link" />
                </li>
                <li>
                  <EmailLink email={site.emailInfo} className="site-footer__link" />
                </li>
                <li>
                  <PhoneValue className="site-footer__link" />
                </li>
                {hasGstin && <li>GSTIN: {site.gstin}</li>}
              </ul>
            </address>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            © {__BUILD_YEAR__} {site.name}. All Rights Reserved.
          </p>
          <ul className="site-footer__legal" role="list">
            {footerLegalLinks.map((item, i) => (
              <li key={item.to}>
                {i > 0 && (
                  <span className="site-footer__sep" aria-hidden="true">
                    ·
                  </span>
                )}
                <FooterLink item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
