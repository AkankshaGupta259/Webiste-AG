/**
 * A wrapped row of tech-stack pills, shared by the index and detail views.
 * `strong` gives higher-contrast pills (used for the Skills section, which
 * otherwise read too muted).
 */
export function TechTags({
  items,
  className = "",
  strong = false,
}: {
  items: string[];
  className?: string;
  strong?: boolean;
}) {
  const pill = strong
    ? "rounded-full border border-border-strong bg-surface/50 px-3 py-1 text-xs text-foreground"
    : "rounded-full border border-border px-3 py-1 text-xs text-foreground-muted";
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item} className={pill}>
          {item}
        </li>
      ))}
    </ul>
  );
}
