import { ArrowDownRight, ArrowUpRight, CalendarDays, Mail, Phone, Database, AlertTriangle } from "lucide-react";

/* Mock product UI for the four "how it works" steps. Sample data only.
   `active` re-triggers the internal transitions each time a step shows. */

type VisualProps = { active: boolean };

const ease = "ease-[var(--ease-out-expo)]";

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-frame">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-sm sm:px-5">
        <span className="font-medium">{title}</span>
        <span className="rounded-sm bg-paper-2 px-1.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.06em] text-muted uppercase">Sample data</span>
      </div>
      <div className="flex-1 p-4 sm:p-6">{children}</div>
    </div>
  );
}

const sources = [
  { icon: Database, label: "CRM opportunities", count: "412" },
  { icon: CalendarDays, label: "Calendar meetings", count: "1,380" },
  { icon: Mail, label: "Email threads", count: "9,214" },
  { icon: Phone, label: "Call transcripts", count: "655" },
];

export function ConnectVisual({ active }: VisualProps) {
  return (
    <Frame title="Connected sources · last 90 days">
      <div className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:gap-8">
        <ul className="space-y-3">
          {sources.map((s, i) => (
            <li key={s.label} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-line bg-paper">
                <s.icon className="size-[18px] text-ink-2" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{s.label}</span>
                <span className="relative mt-1.5 block h-[3px] overflow-hidden rounded-full bg-paper-3">
                  <span
                    className={`absolute inset-0 origin-left rounded-full bg-pine transition-transform duration-[900ms] ${ease} ${active ? "scale-x-100" : "scale-x-0"}`}
                    style={{ transitionDelay: active ? `${150 + i * 110}ms` : "0ms" }}
                  />
                </span>
              </span>
              <span className="tabular w-14 text-right text-sm text-ink-2">{s.count}</span>
            </li>
          ))}
        </ul>
        <div
          className={`flex size-20 flex-col items-center justify-center rounded-full border border-ink bg-ink text-paper transition-[transform,opacity] duration-700 sm:size-28 xl:size-32 ${ease} ${active ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
          style={{ transitionDelay: active ? "500ms" : "0ms" }}
        >
          <span className="font-display text-2xl leading-none sm:text-3xl">412</span>
          <span className="mt-1 text-[0.6875rem] tracking-[0.06em] text-paper/70 uppercase">deals read</span>
        </div>
      </div>
    </Frame>
  );
}

const scored = [
  { name: "Tidewater Systems", type: "Expansion", amount: "$186K", prob: 0.81, delta: +6 },
  { name: "Halcyon Health", type: "New logo", amount: "$142K", prob: 0.64, delta: -9 },
  { name: "Copperline", type: "Renewal", amount: "$98K", prob: 0.92, delta: +2 },
  { name: "Arden Insurance", type: "New logo", amount: "$77K", prob: 0.38, delta: -14 },
];

export function ScoreVisual({ active }: VisualProps) {
  return (
    <Frame title="Deal scores · updated 6:00 AM">
      <ul className="divide-y divide-line">
        {scored.map((d, i) => (
          <li key={d.name} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-3 first:pt-0 sm:grid-cols-[1.3fr_1fr_auto]">
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{d.name}</span>
              <span className="tabular block text-[0.8125rem] text-muted">
                {d.type} · {d.amount}
              </span>
            </span>
            <span className="relative order-last col-span-2 h-1.5 overflow-hidden rounded-full bg-paper-3 sm:order-none sm:col-span-1">
              <span
                className={`absolute inset-0 origin-left rounded-full bg-pine transition-transform duration-[900ms] ${ease}`}
                style={{ transform: `scaleX(${active ? d.prob : 0})`, transitionDelay: active ? `${120 + i * 90}ms` : "0ms" }}
              />
            </span>
            <span className="tabular flex items-center justify-end gap-2 text-sm">
              <span className="font-medium">{Math.round(d.prob * 100)}%</span>
              <span className={`inline-flex items-center text-[0.8125rem] ${d.delta > 0 ? "text-pine" : "text-signal-ink"}`}>
                {d.delta > 0 ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : <ArrowDownRight className="size-3.5" aria-hidden="true" />}
                <span className="sr-only">{d.delta > 0 ? "up" : "down"}</span>
                {Math.abs(d.delta)}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div
        className={`mt-4 rounded-md border border-line bg-paper p-3.5 text-[0.8125rem] transition-[transform,opacity] duration-500 ${ease} ${active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
        style={{ transitionDelay: active ? "600ms" : "0ms" }}
      >
        <p className="font-medium">Why Halcyon Health dropped 9 points</p>
        <ul className="mt-2 space-y-1 text-ink-2">
          <li><span className="tabular mr-2 text-signal-ink">−6</span>No reply from the economic buyer in 16 days</li>
          <li><span className="tabular mr-2 text-signal-ink">−5</span>Close date pushed twice this quarter</li>
          <li><span className="tabular mr-2 text-pine">+2</span>Security review completed</li>
        </ul>
      </div>
    </Frame>
  );
}

const teams = [
  { name: "Enterprise East", value: 2.31, range: "2.17–2.44", call: 2.6 },
  { name: "Enterprise West", value: 1.74, range: "1.62–1.85", call: 1.7 },
  { name: "Mid-market", value: 0.77, range: "0.72–0.82", call: 0.9 },
];

export function RollupVisual({ active }: VisualProps) {
  return (
    <Frame title="Roll-up · Q4 · company">
      <div className={`transition-[transform,opacity] duration-500 ${ease} ${active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
        <p className="text-[0.8125rem] text-muted">Company forecast</p>
        <p className="tabular font-display text-5xl leading-none tracking-tight">$4.82M</p>
        <p className="tabular mt-1 text-[0.8125rem] text-ink-2">80% range $4.51M to $5.08M</p>
      </div>
      <div className="mt-5 border-l border-ink/20 pl-4 sm:pl-6">
        <div className="tabular grid grid-cols-[1fr_auto_auto] gap-x-4 pb-2 text-[0.75rem] tracking-[0.04em] text-muted uppercase sm:gap-x-8">
          <span>Team</span>
          <span className="text-right">Vantro</span>
          <span className="text-right">Manager call</span>
        </div>
        <ul className="divide-y divide-line border-t border-line">
          {teams.map((t, i) => {
            const gap = t.call - t.value;
            return (
              <li
                key={t.name}
                className={`tabular grid grid-cols-[1fr_auto_auto] items-baseline gap-x-4 py-3 text-sm transition-[transform,opacity] duration-500 sm:gap-x-8 ${ease} ${active ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`}
                style={{ transitionDelay: active ? `${200 + i * 110}ms` : "0ms" }}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{t.name}</span>
                  <span className="block text-[0.8125rem] text-muted">${t.range}M</span>
                </span>
                <span className="text-right font-medium">${t.value.toFixed(2)}M</span>
                <span className="text-right">
                  ${t.call.toFixed(2)}M
                  <span className={`block text-[0.75rem] ${Math.abs(gap) > 0.1 ? "text-signal-ink" : "text-muted"}`}>
                    {gap > 0 ? "+" : "−"}${Math.abs(gap * 1000).toFixed(0)}K gap
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Frame>
  );
}

const risks = [
  { name: "Arden Insurance · New logo", amount: "$77K", reason: "Champion changed roles. No new contact added.", action: "Map a new champion before the 14th." },
  { name: "Ridgeway Foods · Renewal", amount: "$54K", reason: "Usage down 31% over 60 days.", action: "Book a usage review with their ops lead." },
  { name: "Meridian Hotels · Expansion", amount: "$120K", reason: "Procurement step not in the mutual plan.", action: "Confirm procurement timeline this week." },
];

export function ActVisual({ active }: VisualProps) {
  return (
    <Frame title="Monday digest · Enterprise East">
      <p className="text-sm">
        <span className="font-medium">3 deals moved to at risk</span>
        <span className="text-muted"> since last Monday, worth $251K.</span>
      </p>
      <ol className="mt-4 space-y-3">
        {risks.map((r, i) => (
          <li
            key={r.name}
            className={`rounded-md border border-line bg-paper p-3.5 transition-[transform,opacity] duration-500 ${ease} ${active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
            style={{ transitionDelay: active ? `${120 + i * 120}ms` : "0ms" }}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                <AlertTriangle className="size-4 shrink-0 text-signal-ink" strokeWidth={1.8} aria-hidden="true" />
                <span className="truncate">{r.name}</span>
              </span>
              <span className="tabular text-sm text-ink-2">{r.amount}</span>
            </div>
            <p className="mt-1.5 text-[0.8125rem] text-ink-2">{r.reason}</p>
            <p className="mt-1 text-[0.8125rem] text-pine">
              <span className="font-medium">Next step:</span> {r.action}
            </p>
          </li>
        ))}
      </ol>
    </Frame>
  );
}
