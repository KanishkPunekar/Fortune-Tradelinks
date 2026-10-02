import { cx } from '../lib/cx';

interface InlineListProps {
  items: string[];
  /** Visual separator between items; hidden from screen readers. Default "|". */
  separator?: string;
  className?: string;
}

/** A short run of terms, e.g. "Product | Quantity | Delivery Location". */
export function InlineList({ items, separator = '|', className }: InlineListProps) {
  return (
    <ul className={cx('inline-list', className)} role="list">
      {items.map((item, i) => (
        <li key={item}>
          {i > 0 && (
            <span className="inline-list__sep" aria-hidden="true">
              {separator}
            </span>
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}
