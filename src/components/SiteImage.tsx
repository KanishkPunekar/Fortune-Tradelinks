import type { SiteImageSource } from '../config/site';
import { cx } from '../lib/cx';
import { ImagePlaceholder } from './ImagePlaceholder';

interface SiteImageProps {
  /** An entry from `images` in src/config/site.ts. */
  image: SiteImageSource;
  /** Shown on the placeholder while no photo is set: what the photo should show. */
  placeholderLabel: string;
  /** Second placeholder line: shape and minimum size. */
  placeholderDetails?: string;
  /** CSS aspect-ratio, e.g. "4 / 3"; "none" leaves sizing to the stylesheet. */
  ratio?: string;
  /** Above the fold: load immediately instead of lazily. */
  eager?: boolean;
  className?: string;
}

/** A configured photo, or a clearly marked placeholder until the owner supplies one. */
export function SiteImage({
  image,
  placeholderLabel,
  placeholderDetails,
  ratio = '4 / 3',
  eager = false,
  className,
}: SiteImageProps) {
  if (!image.src) {
    return <ImagePlaceholder label={placeholderLabel} details={placeholderDetails} ratio={ratio} className={className} />;
  }
  return (
    <img
      className={cx('site-image', className)}
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.sizes}
      alt={image.alt}
      style={ratio === 'none' ? undefined : { aspectRatio: ratio }}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
    />
  );
}
