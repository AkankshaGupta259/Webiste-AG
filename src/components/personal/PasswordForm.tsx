"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

/**
 * Admin login. Posts the password to the Next route handler, which
 * exchanges it for a JWT and stores it in an httpOnly cookie, then routes
 * into the editor. The password is only ever sent over this one request.
 */
export function PasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/personal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(routes.personalEditor);
        router.refresh();
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Something went wrong. Is the content service running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <label htmlFor="pw" className="sr-only">
        Password
      </label>
      <input
        id="pw"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
        className="w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-foreground placeholder:text-foreground-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
      <button
        type="submit"
        disabled={loading || !password}
        className="mt-4 w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-strong disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {loading ? "Unlocking…" : "Enter"}
      </button>
    </form>
  );
}
