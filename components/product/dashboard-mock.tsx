import { BarChart3, Gauge, LayoutGrid, ListChecks, Settings, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { WEEKS, TODAY, TARGET, FINAL, LOW, HIGH, forecast, lower, upper, closedAt } from "@/lib/forecast";

/* Static product shot rendered as HTML + SVG so it stays sharp at any size. Sample data. */

const W = 640;
const H = 230;
const PAD = { l: 8, r: 8, t: 16, b: 22 };
const YMAX = 5.6;
const x = (w: number) => PAD.l + (w / WEEKS) * (W - PAD.l - PAD.r);
const y = (v: number) => H - PAD.b - (v / YMAX) * (H - PAD.t - PAD.b);

function chartPaths() {
  const pts = (fn: (w: number) => number, from: number, to: number, n = 40) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const w = from + ((to - from) * i) / n;
      return [x(w), y(fn(w))] as const;
    });
  const line = (p: readonly (readonly [number, number])[]) => p.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
  const up = pts(upper, TODAY, WEEKS);
  const lo = pts(lower, TODAY, WEEKS).reverse();
  const band = `${line(up)} ${lo.map(([px, py]) => `L${px.toFixed(1)} ${py.toFixed(1)}`).join(" ")} Z`;
  let closed = `M${x(0)} ${y(0)}`;
  for (let wk = 0; wk < TODAY; wk++) closed += ` L${x(wk + 1).toFixed(1)} ${y(closedAt(wk)).toFixed(1)} L${x(wk + 1).toFixed(1)} ${y(forecast(wk + 1)).toFixed(1)}`;
  return { band, fc: line(pts(forecast, TODAY, WEEKS)), closed };
}

const nav = [
  { icon: Gauge, label: "Forecast", active: true },
  { icon: ListChecks, label: "Deals" },
  { icon: Users, label: "Teams" },
  { icon: BarChart3, label: "Scenarios" },
  { icon: LayoutGrid, label: "History" },
];

const kpis = [
  { label: "Forecast", value: `$${FINAL.toFixed(2)}M`, note: `${`$${LOW}M`} to $${HIGH}M`, accent: true },
  { label: "Closed won", value: "$1.48M", note: "31% of forecast" },
  { label: "Target", value: `$${TARGET.toFixed(2)}M`, note: "+$220K projected" },
  { label: "Pipeline coverage", value: "2.9×", note: "Open vs remaining" },
];

const deals = [
  { name: "Tidewater Systems", owner: "J. Alvarez", amount: "$186K", stage: "Negotiation", prob: 81, delta: 6 },
  { name: "Brightwater Bank", owner: "P. Nair", amount: "$210K", stage: "Proposal", prob: 55, delta: -4 },
  { name: "Halcyon Health", owner: "D. Brooks", amount: "$142K", stage: "Proposal", prob: 64, delta: -9 },
  { name: "Meridian Hotels", owner: "S. Chen", amount: "$120K", stage: "Negotiation", prob: 72, delta: 3 },
];

export function DashboardMock() {
  const { band, fc, closed } = chartPaths();
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-frame" role="img" aria-label="Vantro forecast dashboard with sample data: Q4 forecast $4.82M, range $4.51M to $5.08M, target $4.6M, and a list of the largest open deals with their scores.">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-paper-3" />
        <span className="size-2.5 rounded-full bg-paper-3" />
        <span className="size-2.5 rounded-full bg-paper-3" />
        <span className="ml-3 truncate text-[0.75rem] text-muted">app.vantro.example / forecast / q4</span>
      </div>
      <div className="grid md:grid-cols-[176px_1fr]" aria-hidden="true">
        <aside className="hidden border-r border-line p-3 md:block">
          <ul className="space-y-0.5 text-[0.8125rem]">
            {nav.map((n) => (
              <li key={n.label} className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 ${n.active ? "bg-paper-2 font-medium text-ink" : "text-ink-2"}`}>
                <n.icon className="size-4" strokeWidth={1.7} />
                {n.label}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[0.8125rem] text-ink-2">
            <Settings className="size-4" strokeWidth={1.7} />
            Settings
          </div>
        </aside>

        <div className="min-w-0 p-4 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-2xl">Q4 forecast · Company</p>
            <p className="tabular text-[0.8125rem] text-muted">Week 6 of 13 · refreshed 6:00 AM</p>
          </div>

          <dl className="mt-5 grid grid-cols-2 border-y border-line lg:grid-cols-4">
            {kpis.map((k, i) => (
              <div key={k.label} className={`py-4 pr-4 ${i % 2 ? "pl-4" : ""} ${i > 0 ? "lg:border-l lg:border-line lg:pl-4" : ""} ${i % 2 ? "border-l border-line lg:border-l" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""}`}>
                <dt className="text-[0.75rem] text-muted">{k.label}</dt>
                <dd className={`tabular mt-1 font-display text-3xl leading-none ${k.accent ? "text-signal-ink" : ""}`}>{k.value}</dd>
                <dd className="tabular mt-1.5 text-[0.75rem] text-ink-2">{k.note}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
              {[0, 1, 2, 3, 4, 5].map((v) => (
                <line key={v} x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="#121416" strokeOpacity={v === 0 ? 0.2 : 0.07} />
              ))}
              <line x1={x(TODAY)} x2={x(TODAY)} y1={y(3)} y2={y(0)} stroke="#121416" strokeOpacity="0.25" strokeDasharray="3 4" />
              <text x={x(TODAY)} y={y(3) - 6} textAnchor="middle" fontSize="10" fill="#565b57">Today</text>
              <line x1={x(TODAY)} x2={W - PAD.r} y1={y(TARGET)} y2={y(TARGET)} stroke="#121416" strokeOpacity="0.4" strokeDasharray="6 5" />
              <text x={W - PAD.r} y={y(TARGET) + 13} textAnchor="end" fontSize="10" fill="#565b57">Target $4.6M</text>
              <path d={band} fill="#2e5a4c" fillOpacity="0.14" />
              <path d={closed} fill="none" stroke="#121416" strokeWidth="2" strokeLinejoin="round" />
              <path d={fc} fill="none" stroke="#e4572e" strokeWidth="2.75" strokeLinecap="round" />
              <circle cx={x(WEEKS)} cy={y(FINAL)} r="4.5" fill="#e4572e" stroke="#f8f6f0" strokeWidth="2" />
              {[1, 4, 7, 10, 13].map((wk) => (
                <text key={wk} x={x(wk - 0.5)} y={H - 6} textAnchor="middle" fontSize="10" fill="#565b57">
                  W{wk}
                </text>
              ))}
            </svg>
          </div>

          <table className="mt-4 w-full text-left text-[0.8125rem]">
            <thead className="text-[0.75rem] text-muted">
              <tr className="border-b border-line">
                <th className="py-2 font-normal">Largest open deals</th>
                <th className="hidden py-2 font-normal sm:table-cell">Owner</th>
                <th className="hidden py-2 font-normal md:table-cell">Stage</th>
                <th className="py-2 text-right font-normal">Amount</th>
                <th className="py-2 text-right font-normal">Score</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {deals.map((d) => (
                <tr key={d.name} className="border-b border-line last:border-0">
                  <td className="py-2.5 pr-2 font-medium">{d.name}</td>
                  <td className="hidden py-2.5 text-ink-2 sm:table-cell">{d.owner}</td>
                  <td className="hidden py-2.5 text-ink-2 md:table-cell">{d.stage}</td>
                  <td className="py-2.5 text-right">{d.amount}</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-1.5">
                      {d.prob}%
                      <span className={`inline-flex items-center ${d.delta > 0 ? "text-pine" : "text-signal-ink"}`}>
                        {d.delta > 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                        {Math.abs(d.delta)}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
