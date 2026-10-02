import { ButtonLink } from '../components/ButtonLink';
import { PageHeader, Section } from '../components/Section';
import { pages } from '../config/pages';

/* Copy: PROJECT_BRIEF.md, Section 9.13 ([PROPOSED COPY] in the brief). */

/** 404 — any unknown path. Kept short: what happened, and the two ways on. */
export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" />

      <Section>
        <p className="lead">The page you're looking for doesn't exist or has moved.</p>
        <div className="btn-row">
          <ButtonLink to={pages.home.path} variant="secondary">
            Go to Home
          </ButtonLink>
          <ButtonLink to={pages.quote.path}>Request a Quote</ButtonLink>
        </div>
      </Section>
    </>
  );
}
