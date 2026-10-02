import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface ProcessStep {
  title: string;
  text: ReactNode;
}

interface ProcessStepsProps {
  steps: ProcessStep[];
  /** grid = columns (fixed count via `columns`, else auto-fit); stack = one per row. */
  layout?: 'grid' | 'stack';
  columns?: 2 | 3 | 4;
  headingLevel?: 3 | 4;
  className?: string;
}

/** A real sequence, numbered 01, 02, 03 ... Each step: title + one line of text. */
export function ProcessSteps({ steps, layout = 'grid', columns, headingLevel = 3, className }: ProcessStepsProps) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3';
  return (
    <ol
      className={cx(
        'process-steps',
        layout === 'stack' ? 'process-steps--stack' : columns && `process-steps--cols-${columns}`,
        className,
      )}
      role="list"
    >
      {steps.map((step, i) => (
        <li key={step.title} className="process-steps__item">
          <span className="process-steps__num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <Heading>{step.title}</Heading>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
