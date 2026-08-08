import Link from "next/link";
import Image from "next/image";
import type { ActivityItem } from "@/content/types";

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

      {activity.gallery && activity.gallery.length ? (
        <section className="mt-10">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
            Photos
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {activity.gallery.map((src) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 240px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activity.certificate ? (
        <div className="mt-10">
          <a
            href={activity.certificate.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-border-strong px-5 py-2 text-sm text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {activity.certificate.label}
          </a>
        </div>
      ) : null}
    </article>
  );
}
