import { certificateHref, getCertificate } from "@/content/certificates";

/**
 * "View Certificate" link used across experience, leadership, certifications,
 * and activities. Opens the branded viewer (`/certificate/<slug>`) in a new
 * tab. Renders nothing if the slug is unknown, so items without a certificate
 * (or ones whose proof isn't in yet) simply omit the link.
 */
export function ViewCertificateLink({
  slug,
  label = "View certificate",
  className = "",
}: {
  slug?: string;
  label?: string;
  className?: string;
}) {
  if (!slug || !getCertificate(slug)) return null;

  return (
    <a
      href={certificateHref(slug)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded ${className}`}
    >
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M7 4H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2M12 3h5v5M17 3l-8 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </a>
  );
}
