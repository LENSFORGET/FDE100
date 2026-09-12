import { useState } from "react";
export type ReadingState = {
  saved: number[];
  read: number[];
  notes: Record<string, string>;
  last: number | null;
};
const blank: ReadingState = { saved: [], read: [], notes: {}, last: null };
function load(): ReadingState {
  try {
    const data = JSON.parse(
      localStorage.getItem("fde100-reading-v1") || "null",
    );
    if (!data) return blank;
    return {
      saved: Array.isArray(data.saved)
        ? data.saved.filter(
            (n: unknown) =>
              Number.isInteger(n) && Number(n) >= 1 && Number(n) <= 24,
          )
        : [],
      read: Array.isArray(data.read)
        ? data.read.filter(
            (n: unknown) =>
              Number.isInteger(n) && Number(n) >= 1 && Number(n) <= 24,
          )
        : [],
      notes:
        data.notes && typeof data.notes === "object"
          ? Object.fromEntries(
              Object.entries(data.notes).filter(
                (entry): entry is [string, string] =>
                  typeof entry[1] === "string",
              ),
            )
          : {},
      last:
        Number.isInteger(data.last) && data.last >= 1 && data.last <= 24
          ? data.last
          : null,
    };
  } catch {
    return blank;
  }
}
export function useReading() {
  const [state, setState] = useState<ReadingState>(load);
  const [storageError, setStorageError] = useState(false);
  function update(fn: (s: ReadingState) => ReadingState) {
    setState((prev) => {
      const next = fn(prev);
      try {
        localStorage.setItem("fde100-reading-v1", JSON.stringify(next));
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
      return next;
    });
  }
  return {
    state,
    storageError,
    toggle: (key: "saved" | "read", id: number) =>
      update((s) => ({
        ...s,
        [key]: s[key].includes(id)
          ? s[key].filter((x) => x !== id)
          : [...s[key], id],
      })),
    note: (id: number, text: string) =>
      update((s) => ({ ...s, notes: { ...s.notes, [id]: text } })),
    visit: (id: number) => update((s) => ({ ...s, last: id })),
  };
}
export type Reading = ReturnType<typeof useReading>;
