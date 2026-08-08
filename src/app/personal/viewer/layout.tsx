import Link from "next/link";
import { routes } from "@/lib/routes";

/**
 * Viewer chrome — a slim, unobtrusive header so the content and backdrop
 * stay the focus. The wordmark returns to the hub; "Exit" leaves the
 * universe back to the landing page.
 */
export default function ViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-6 py-6 sm:px-8">
      <header className="mb-10 flex items-center justify-between">
        <Link
          href={routes.personalViewer}
          className="font-serif text-lg text-foreground transition-colors hover:text-accent"
        >
          ✦ the universe
        </Link>
        <Link
          href={routes.home}
          className="text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          Exit ↗
        </Link>
      </header>
      <main className="flex-1 pb-16">{children}</main>
    </div>
  );
}
