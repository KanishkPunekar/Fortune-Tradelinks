import type { ReactNode } from 'react';
import { ButtonLink } from './ButtonLink';
import { InlineList } from './InlineList';

interface CtaBandProps {
  /** H2 text. */
  heading: string;
  /** Body copy: usually one paragraph. */
  children?: ReactNode;
  /** Optional "what to include" terms, shown as an inline list. */
  include?: string[];
  /** Primary button (a white pill on the navy panel). */
  button?: { label: string; to: string };
  id?: string;
}

/** End-of-page call to action: a navy panel with the primary button. */
export function CtaBand({ heading, children, include, button, id }: CtaBandProps) {
  return (
    <section id={id} className="cta-band">
      <div className="container">
        <div className="cta-band__panel on-dark">
          <div className="cta-band__body">
            <h2>{heading}</h2>
            {children}
            {include && <InlineList items={include} />}
          </div>
          {button && (
            <div className="cta-band__action">
              <ButtonLink to={button.to} variant="primary">
                {button.label}
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
