import { Fragment } from "react";

/** Emphasizes curated phrases without rewriting or injecting source HTML. */
export function Emphasis({
  text,
  terms = [],
}: {
  text: string;
  terms?: readonly string[];
}) {
  const matches = terms
    .filter((term) => term && text.includes(term))
    .sort((a, b) => b.length - a.length);
  if (!matches.length) return <>{text}</>;
  const escaped = matches.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "g");
  return (
    <>
      {text
        .split(pattern)
        .map((part, i) =>
          matches.includes(part) ? (
            <strong key={i}>{part}</strong>
          ) : (
            <Fragment key={i}>{part}</Fragment>
          ),
        )}
    </>
  );
}
