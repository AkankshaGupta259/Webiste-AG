import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { certificates, getCertificate } from "@/content/certificates";

/**
 * Branded certificate viewer. Opened in a new tab from any "View Certificate"
 * link, it shows the certificate full-bleed with a slim header carrying the
 * title and a Download button on the top-right. PDFs render in an embedded
 * viewer; image certificates are shown fitted. Kept outside the /portfolio
 * layout so there's no nav/forest chrome — just the document.
 */
export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return certificates.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cert = getCertificate(slug);
  return {
    title: cert ? `${cert.title} — Certificate` : "Certificate",
    // Certificates are reachable by link but kept out of search results.
    robots: { index: false, follow: false },
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const cert = getCertificate(slug);
  if (!cert) notFound();

  const isImage = /\.(png|jpe?g|webp|gif|avif)$/i.test(cert.file);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate font-serif text-base text-foreground sm:text-lg">
            {cert.title}
          </h1>
          {cert.issuer ? (
            <p className="truncate text-xs text-foreground-muted">{cert.issuer}</p>
          ) : null}
        </div>

        <a
          href={cert.file}
          download
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-strong active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M10 3v10m0 0 4-4m-4 4-4-4M4 16h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download
        </a>
      </header>

      <div className="relative min-h-0 flex-1 bg-[#0a0a0f]">
        {isImage ? (
          <Image
            src={cert.file}
            alt={cert.title}
            fill
            sizes="100vw"
            className="object-contain p-4"
            priority
          />
        ) : (
          <iframe
            src={cert.file}
            title={cert.title}
            className="h-full w-full border-0"
          />
        )}
      </div>
    </div>
  );
}
