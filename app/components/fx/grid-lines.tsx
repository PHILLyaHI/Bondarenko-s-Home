interface GridLinesProps {
  variant?: "soft" | "dashed";
  className?: string;
}

export default function GridLines({
  variant = "soft",
  className = "",
}: GridLinesProps) {
  const cls =
    variant === "dashed"
      ? "grid-pattern-fine"
      : "grid-pattern";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${cls} ${className}`}
    />
  );
}
