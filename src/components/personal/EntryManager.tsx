"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { ApiEntry } from "@/lib/personal";

interface GroupOption {
  id: string;
  label: string;
}

interface FormState {
  id?: string;
  title: string;
  year: string;
  note: string;
  status: string;
  rating: string;
  group_id: string;
  region: string;
  map_x: string;
  map_y: string;
  image_url: string;
}

const empty: FormState = {
  title: "",
  year: "",
  note: "",
  status: "",
  rating: "",
  group_id: "",
  region: "",
  map_x: "",
  map_y: "",
  image_url: "",
};

function toForm(e: ApiEntry): FormState {
  return {
    id: e.id,
    title: e.title,
    year: e.year?.toString() ?? "",
    note: e.note ?? "",
    status: e.status ?? "",
    rating: e.rating?.toString() ?? "",
    group_id: e.group_id ?? "",
    region: e.region ?? "",
    map_x: e.map_x?.toString() ?? "",
    map_y: e.map_y?.toString() ?? "",
    image_url: e.image_url ?? "",
  };
}

export function EntryManager({
  categoryId,
  groups,
  initialEntries,
  special,
}: {
  categoryId: string;
  groups: GroupOption[];
  initialEntries: ApiEntry[];
  special?: "travel" | "watch" | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTravel = special === "travel";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? initialEntries.filter((e) => e.title.toLowerCase().includes(q))
      : initialEntries;
  }, [initialEntries, query]);

  const groupLabel = (id: string | null) =>
    id ? (groups.find((g) => g.id === id)?.label ?? "—") : "—";

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setError(null);

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      year: form.year ? Number(form.year) : null,
      note: form.note.trim() || null,
      status: isTravel ? null : form.status.trim() || null,
      rating: isTravel || form.rating === "" ? null : Number(form.rating),
      group_id: form.group_id || null,
      region: isTravel ? form.region.trim() || null : null,
      map_x: isTravel && form.map_x !== "" ? Number(form.map_x) : null,
      map_y: isTravel && form.map_y !== "" ? Number(form.map_y) : null,
      image_url: form.image_url || null,
    };

    const editing = Boolean(form.id);
    const url = editing
      ? `/api/personal/entries/${form.id}`
      : "/api/personal/entries";
    if (!editing) payload.category_id = categoryId;

    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setBusy(false);
    if (res.ok) {
      setForm(null);
      router.refresh();
    } else if (res.status === 401) {
      setError("Session expired. Please log in again.");
    } else {
      setError("Could not save. Check the fields and try again.");
    }
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    const res = await fetch(`/api/personal/entries/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Could not delete.");
  }

  async function uploadImage(file: File) {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/personal/upload", { method: "POST", body: fd });
    setBusy(false);
    if (res.ok) {
      const { url } = await res.json();
      setForm((f) => (f ? { ...f, image_url: url } : f));
    } else {
      setError("Image upload failed.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button
          type="button"
          onClick={() => {
            setForm({ ...empty });
            setError(null);
          }}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-strong"
        >
          + Add entry
        </button>
      </div>

      {/* Form */}
      {form ? (
        <form
          onSubmit={save}
          className="flex flex-col gap-4 rounded-2xl border border-border-strong bg-background-elevated/60 p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Year">
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className={inputCls}
              />
            </Field>

            {groups.length ? (
              <Field label="Group">
                <select
                  value={form.group_id}
                  onChange={(e) => setForm({ ...form, group_id: e.target.value })}
                  className={inputCls}
                >
                  <option value="">— none —</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </Field>
            ) : null}

            {isTravel ? (
              <>
                <Field label="Region">
                  <input
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Map X (%)">
                  <input
                    type="number"
                    value={form.map_x}
                    onChange={(e) => setForm({ ...form, map_x: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Map Y (%)">
                  <input
                    type="number"
                    value={form.map_y}
                    onChange={(e) => setForm({ ...form, map_y: e.target.value })}
                    className={inputCls}
                  />
                </Field>
              </>
            ) : (
              <>
                <Field label="Status">
                  <input
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    placeholder="e.g. Watching, Completed"
                    className={inputCls}
                  />
                </Field>
                <Field label="Rating (0–5)">
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className={inputCls}
                  />
                </Field>
              </>
            )}
          </div>

          <Field label="Note">
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={2}
              className={inputCls}
            />
          </Field>

          {/* Image */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
              {form.image_url ? (
                <Image src={form.image_url} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs text-foreground-subtle">
                  no img
                </span>
              )}
            </div>
            <label className="cursor-pointer rounded-full border border-border-strong px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface">
              Upload image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                }}
              />
            </label>
          </div>

          {error ? <p className="text-sm text-accent">{error}</p> : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy || !form.title.trim()}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-strong disabled:opacity-50"
            >
              {busy ? "Saving…" : form.id ? "Save changes" : "Add entry"}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-full border border-border-strong px-5 py-2 text-sm text-foreground transition-colors hover:bg-surface"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {/* List */}
      {filtered.length ? (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {filtered.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-4 bg-background-elevated/40 p-4"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-surface">
                {e.image_url ? (
                  <Image src={e.image_url} alt="" fill sizes="48px" className="object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{e.title}</p>
                <p className="truncate text-xs text-foreground-subtle">
                  {[e.year, e.status, e.group_id ? groupLabel(e.group_id) : null]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm(toForm(e));
                  setError(null);
                }}
                className="text-sm text-accent transition-opacity hover:opacity-80"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(e.id, e.title)}
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border-strong bg-background-elevated/40 p-8 text-sm text-foreground-muted">
          {query ? "No matches." : "No entries yet — add your first one."}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-foreground-muted">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
