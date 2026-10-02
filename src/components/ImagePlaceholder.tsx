import { cx } from '../lib/cx';

interface ImagePlaceholderProps {
  /** What the real photo should show. */
  label: string;
  /** Optional second line: shape and minimum size, e.g. "Square · at least 1400 × 1400 px". */
  details?: string;
  /** CSS aspect-ratio, default "4 / 3"; "none" leaves sizing to the stylesheet. */
  ratio?: string;
  className?: string;
}

/**
 * A clearly marked stand-in for a photo the owner hasn't supplied yet.
 * Set the photo in `images` (src/config/site.ts) to replace it.
 */
export function ImagePlaceholder({ label, details, ratio = '4 / 3', className }: ImagePlaceholderProps) {
  return (
    <div
      className={cx('image-placeholder', className)}
      style={ratio === 'none' ? undefined : { aspectRatio: ratio }}
      role="img"
      aria-label={`Image placeholder: ${label}`}
    >
      <span className="image-placeholder__tag">Image placeholder</span>
      <span>{label}</span>
      {details && <span className="image-placeholder__details">{details}</span>}
    </div>
  );
}
