import Link from "next/link";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";
import { routes } from "@/lib/routes";
import { LogoutButton } from "@/components/personal/LogoutButton";

/**
 * Editor gate + chrome. Redirects to the password page if there's no
 * token cookie. (Actual authorization is enforced by the backend on every
 * write — this gate just keeps the UI out of unauthenticated hands.)
 */
export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  if (!token) redirect(routes.personalAuth);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-6 sm:px-8">
      <header className="mb-10 flex items-center justify-between">
        <Link
          href={routes.personalEditor}
          className="font-serif text-lg text-foreground transition-colors hover:text-accent"
        >
          ✦ editor
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href={routes.personalViewer}
            className="text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            View site ↗
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="pb-16">{children}</main>
    </div>
  );
}
