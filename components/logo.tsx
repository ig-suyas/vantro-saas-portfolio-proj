type LogoProps = {
  className?: string;
  tone?: "ink" | "paper";
};

/** Vantro mark: a "V" whose right arm continues as a rising forecast line. */
export function LogoMark({ className, tone = "ink" }: LogoProps) {
  const fg = tone === "ink" ? "#121416" : "#f3f0e8";
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path d="M5 9.5 L13.2 24 L18.6 14.4" fill="none" stroke={fg} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.6 14.4 L22 8.4 L27 6" fill="none" stroke="#e4572e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, tone = "ink" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="size-7" tone={tone} />
      <span className="font-display text-[1.7rem] leading-none tracking-tight">Vantro</span>
    </span>
  );
}
