import Link from "next/link";
import Image from "next/image";
import type { ActivityItem } from "@/content/types";
import { CertificateEmbed } from "./CertificateEmbed";
import { PhotoGallery } from "./PhotoGallery";

/**
 * Full detail view for a single activity, shared by College and School.
 * Renders whatever is present — cover, prose, a photo gallery, and a
 * certificate link — so sparse entries and rich ones both look right.
 */
export function ActivityDetail({
  activity,
  backHref,
  backLabel,
}: {
  activity: ActivityItem;
  backHref: string;
  backLabel: string;
}) {
  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={backHref}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span> {backLabel}
      </Link>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {activity.category}
          </span>
          {activity.date ? (
            <span className="font-mono text-xs text-foreground-subtle">
              {activity.date}
            </span>
          ) : null}
        </div>

        <h1 className="text-balance font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          {activity.title}
        </h1>

        {activity.org || activity.role ? (
          <p className="mt-3 text-accent">
            {[activity.role, activity.org].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </header>

      {activity.coverImage ? (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface">
          <Image
            src={activity.coverImage}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      ) : null}

      {activity.body || activity.description ? (
        <p className="text-pretty text-lg leading-relaxed text-foreground-muted">
          {activity.body ?? activity.description}
        </p>
      ) : null}

      {/* Certificate — embedded right below the description. */}
      {activity.certificate ? (
        <CertificateEmbed slug={activity.certificate} />
      ) : null}

      {activity.gallery && activity.gallery.length ? (
        <section className="mt-10">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
            Photos
          </h2>
          <PhotoGallery photos={activity.gallery} />
        </section>
      ) : null}

    </article>
  );
}
