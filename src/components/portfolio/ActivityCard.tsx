import Link from "next/link";
import Image from "next/image";
import type { ActivityItem } from "@/content/types";

/**
 * A clickable card for a single activity. Shows the essentials (category,
 * date, title, org/role, short description) and links to the activity's
 * detail page. A cover image renders on top when present; small badges
 * hint when an entry has photos or a certificate to view.
 */
export function ActivityCard({
  activity,
  href,
}: {
  activity: ActivityItem;
  href: string;
}) {
  const hasPhotos = Boolean(activity.gallery && activity.gallery.length);
  const hasCertificate = Boolean(activity.certificate);

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background-elevated/60 transition-colors hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {activity.coverImage ? (
        <div className="relative aspect-video w-full overflow-hidden bg-surface">
          <Image
            src={activity.coverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[0.7rem] uppercase tracking-wide text-foreground-muted">
            {activity.category}
          </span>
          {activity.date ? (
            <span className="font-mono text-xs text-foreground-subtle">
              {activity.date}
            </span>
          ) : null}
        </div>

        <h3 className="font-serif text-xl text-foreground">{activity.title}</h3>

        {activity.org || activity.role ? (
          <p className="text-sm text-accent">
            {[activity.role, activity.org].filter(Boolean).join(" · ")}
          </p>
        ) : null}

        {activity.description ? (
          <p className="text-pretty text-sm leading-relaxed text-foreground-muted">
            {activity.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-foreground-subtle">
          {hasPhotos ? <span>Photos</span> : null}
          {hasCertificate ? <span>Certificate</span> : null}
          <span className="ml-auto inline-flex items-center gap-1 text-accent">
            View
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
