/* Generated illustration: a quarter drawn as contour lines. One line,
   the forecast, is picked out in signal orange. Deterministic, no assets. */

const W = 1200;
const H = 420;

function contour(i: number) {
  const base = 70 + i * 21;
  const pts: string[] = [];
  for (let s = 0; s <= 60; s++) {
    const x = (s / 60) * W;
    const t = s / 60;
    const y =
      base +
      Math.sin(t * Math.PI * 2.1 + i * 0.37) * (18 + i * 1.6) +
      Math.sin(t * Math.PI * 5.3 + i * 0.9) * 6 -
      Math.pow(t, 2.1) * (120 - i * 3);
    pts.push(`${s ? "L" : "M"}${x.toFixed(1)} ${(y + 110).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function ContourArt() {
  const lines = Array.from({ length: 15 }, (_, i) => contour(i));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Illustration: thirteen weeks of a quarter drawn as contour lines, with the forecast line highlighted in orange.">
      <rect width={W} height={H} fill="#2e5a4c" />
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#f3f0e8" strokeOpacity={0.12 + (i % 3) * 0.06} strokeWidth="1.2" />
      ))}
      <path d={contour(7)} fill="none" stroke="#e4572e" strokeWidth="3" strokeLinecap="round" />
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1={(i / 13) * W} x2={(i / 13) * W} y1={H - 18} y2={H} stroke="#f3f0e8" strokeOpacity="0.35" />
      ))}
    </svg>
  );
}

/** Abstract portrait tile: initials over a few geometric shapes. */
export function Portrait({ initials, variant }: { initials: string; variant: number }) {
  const bgs = ["#2e5a4c", "#121416", "#e0d9c9", "#1f3f35", "#ebe6da", "#2b2f2d"];
  const bg = bgs[variant % bgs.length];
  const dark = ["#2e5a4c", "#121416", "#1f3f35", "#2b2f2d"].includes(bg);
  const fg = dark ? "#f3f0e8" : "#121416";
  return (
    <svg viewBox="0 0 200 240" className="h-auto w-full" aria-hidden="true">
      <rect width="200" height="240" fill={bg} />
      <circle cx={variant % 2 ? 150 : 50} cy={variant % 3 ? 70 : 170} r={70 + (variant % 3) * 10} fill={fg} fillOpacity="0.07" />
      <path d={`M0 ${200 - variant * 8} C 70 ${180 - variant * 6}, 130 ${120 + variant * 4}, 200 ${60 + variant * 10}`} fill="none" stroke={variant === 2 ? "#b23c17" : "#e4572e"} strokeWidth="2" />
      <text x="18" y="222" fontFamily="var(--font-instrument), serif" fontSize="44" fill={fg}>
        {initials}
      </text>
    </svg>
  );
}
