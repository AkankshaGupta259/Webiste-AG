import type { Metadata } from "next";
import { PasswordForm } from "@/components/personal/PasswordForm";

export const metadata: Metadata = {
  title: "Locked",
  robots: { index: false, follow: false },
};

/**
 * Password page — reached via a five-click on the profile photo. The form
 * (client) posts to /api/personal/login, which sets an httpOnly JWT
 * cookie and routes into the editor.
 */
export default function PersonalAuthPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
        Restricted
      </p>
      <h1 className="font-serif text-4xl text-foreground sm:text-5xl">
        Only the keeper passes.
      </h1>
      <p className="max-w-md text-foreground-muted">
        Enter the password to reach the editor.
      </p>
      <PasswordForm />
    </main>
  );
}
