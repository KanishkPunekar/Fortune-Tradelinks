import type { CSSProperties } from 'react';
import { cx } from '../lib/cx';
import './FlowDiagram.css';

export interface FlowDiagramProps {
  /** Ordered step labels, e.g. ['Supplier', 'Loading Point', 'Tanker Transportation', 'Customer Location']. */
  steps: string[];
  /** Accessible name when no visible heading labels the diagram. */
  label?: string;
  /** id of a visible heading that labels the diagram (preferred over `label`). */
  labelledBy?: string;
  /** compact = smaller summary version (About intro, above How It Works). */
  size?: 'default' | 'compact';
  className?: string;
}

/**
 * The signature step-flow visual (Brief Section 5): green nodes on a navy track
 * with an arrowhead into each next step. Screen readers get a plain ordered list
 * of the labels; the track, nodes and arrowheads are decorative.
 *
 * Pure CSS layout, no measuring: horizontal when the diagram's own width gives
 * every step enough room for its label, vertical (track down the left) otherwise.
 */
export function FlowDiagram({ steps, label, labelledBy, size = 'default', className }: FlowDiagramProps) {
  const style = { '--flow-steps': String(Math.max(steps.length, 1)) } as CSSProperties;
  return (
    <div className={cx('flow-diagram', size === 'compact' && 'flow-diagram--compact', className)} style={style}>
      <div className="flow-diagram__frame">
        <ol
          className="flow-diagram__list"
          role="list"
          aria-label={labelledBy ? undefined : label}
          aria-labelledby={labelledBy}
        >
          {steps.map((step, i) => (
            <li key={`${i}-${step}`} className="flow-diagram__step">
              <span className="flow-diagram__node" aria-hidden="true" />
              <span className="flow-diagram__label">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
