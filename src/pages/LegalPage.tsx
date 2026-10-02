import type { ReactNode } from 'react';
import { EmailLink, PlaceholderText } from '../components/ContactValues';
import { PageHeader, Section } from '../components/Section';
import { site } from '../config/site';
import './Legal.css';

interface LegalPageProps {
  /** The page's single H1. */
  title: string;
  /** Document body: intro paragraphs, then H2 sections. */
  children: ReactNode;
}

/**
 * Shared shell for the Privacy Policy and Terms & Conditions: the H1 band
 * with the "Last Updated" line (site.legalLastUpdated), then one white
 * section holding a single readable column.
 */
export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="legal">
      <PageHeader title={title}>
        <p className="legal__updated">
          Last Updated: <PlaceholderText value={site.legalLastUpdated} />
        </p>
      </PageHeader>

      <Section>
        <div className="legal__body">{children}</div>
      </Section>
    </div>
  );
}

/** Bulleted list inside a legal document. */
export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Closing "Contact" section: the page's own intro line, then info@ and the
 * business name with site.address (visible placeholder until it is real).
 */
export function LegalContact({ intro }: { intro: string }) {
  return (
    <>
      <h2>Contact</h2>
      <p>{intro}</p>
      <address className="legal__contact">
        <p>
          <EmailLink email={site.emailInfo} />
        </p>
        <p>
          {site.name}
          <br />
          <PlaceholderText value={site.address} />
        </p>
      </address>
    </>
  );
}
