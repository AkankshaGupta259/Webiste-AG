import Image from "next/image";
import type { Project } from "@/content/types";

/** Derive a short monogram from the project title for the fallback cover. */
function monogram(title: string): string {
  return title
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Project cover image with a tasteful gradient-monogram fallback, so the
 * index and case-study pages look intentional before real cover art is
 * added. Set `project.coverImage` to use a real image.
 */
export function ProjectCover({
  project,
  className = "",
  sizes,
  priority = false,
}: {
  project: Project;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          alt=""
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 768px) 100vw, 700px"}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center"
          style={{
            background:
              "radial-gradient(120% 120% at 25% 15%, var(--aurora-1), transparent 55%), radial-gradient(120% 120% at 85% 90%, var(--aurora-2), transparent 55%), var(--surface)",
          }}
        >
          <span className="font-serif text-5xl text-foreground/70">
            {monogram(project.title)}
          </span>
        </div>
      )}
    </div>
  );
}
