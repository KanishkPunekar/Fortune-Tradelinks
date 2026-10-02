import { hasPhone, isPlaceholder, site, telHref } from '../config/site';

/** A config value; shown highlighted as plain text while it is still a [PLACEHOLDER]. */
export function PlaceholderText({ value }: { value: string }) {
  if (isPlaceholder(value)) return <span className="is-placeholder">{value}</span>;
  return <>{value}</>;
}

/** `mailto:` link showing the address itself. */
export function EmailLink({ email, className }: { email: string; className?: string }) {
  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}

/** site.phone as a `tel:` link once it's real; plain placeholder text until then. */
export function PhoneValue({ className }: { className?: string }) {
  if (!hasPhone) return <PlaceholderText value={site.phone} />;
  return (
    <a href={telHref(site.phone)} className={className}>
      {site.phone}
    </a>
  );
}
