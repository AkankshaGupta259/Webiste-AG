import Image from "next/image";
import { getCertificate, certificateHref } from "@/content/certificates";

/**
 * Embeds a certificate inline at a readable, medium size (PDF in a framed
 * viewer, images fitted), with a link to open the full branded viewer in a
 * new tab. Used on activity detail pages. Renders nothing for an unknown slug.
 */
export function CertificateEmbed({ slug }: { slug: string }) {
  const cert = getCertificate(slug);
  if (!cert) return null;

  const isImage = /\.(png|jpe?g|webp|gif|avif)$/i.test(cert.file);

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
          Certificate
        </h2>
        <a
          href={certificateHref(slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded text-sm text-accent transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Open full
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M7 4H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2M12 3h5v5M17 3l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {isImage ? (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={cert.file}
              alt={cert.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
            />
          </div>
        ) : (
          <iframe
            src={`${cert.file}#toolbar=0&view=FitH`}
            title={cert.title}
            className="h-[540px] w-full border-0"
          />
        )}
      </div>
    </section>
  );
}
