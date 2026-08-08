import { PersonalBackground } from "@/components/backgrounds/PersonalBackground";

/**
 * Wraps the entire hidden surface (gateway, viewer, auth) in the personal
 * theme and its backdrop. The `.theme-personal` class re-skins every
 * shared component via CSS tokens, so this side feels like a different
 * world without duplicating components.
 */
export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-personal relative min-h-dvh bg-background text-foreground">
      <PersonalBackground />
      <div className="relative z-10 min-h-dvh">{children}</div>
    </div>
  );
}
