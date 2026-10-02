import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface Feature {
  title: string;
  text: ReactNode;
}

interface FeatureGridProps {
  items: Feature[];
  /** Fixed column count on wide screens; omit for auto-fit. */
  columns?: 2 | 3;
  headingLevel?: 3 | 4;
  className?: string;
}

/** "**Title** — sentence" items as a plain text grid: heading + one line, no cards or icons. */
export function FeatureGrid({ items, columns, headingLevel = 3, className }: FeatureGridProps) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3';
  return (
    <ul className={cx('feature-grid', columns && `feature-grid--${columns}`, className)} role="list">
      {items.map((item) => (
        <li key={item.title} className="feature-grid__item">
          <Heading>{item.title}</Heading>
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
