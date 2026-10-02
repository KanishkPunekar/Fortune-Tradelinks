import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface SpecRow {
  label: ReactNode;
  value: ReactNode;
}

interface SpecTableProps {
  rows: SpecRow[];
  caption?: string;
  /** Keep the caption for screen readers only. */
  captionHidden?: boolean;
  className?: string;
}

/** Two-column specification table: row header + value. Scrolls horizontally if needed. */
export function SpecTable({ rows, caption, captionHidden = false, className }: SpecTableProps) {
  if (rows.length === 0) return null;
  return (
    <div className="table-wrap">
      <table className={cx('spec-table', className)}>
        {caption && <caption className={captionHidden ? 'visually-hidden' : undefined}>{caption}</caption>}
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
