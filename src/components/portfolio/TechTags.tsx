/** A wrapped row of tech-stack pills, shared by the index and detail views. */
export function TechTags({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-border px-3 py-1 text-xs text-foreground-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
