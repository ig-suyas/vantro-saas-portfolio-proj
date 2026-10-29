"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { CLOSED, FINAL, HIGH, LOW, TARGET } from "@/lib/forecast";

/* Front-end only what-if model on sample data. Expected value of open
   pipeline = FINAL - CLOSED; slipping a deal removes value * probability. */

const OPEN_EV = FINAL - CLOSED;
const NEW_LOGO_SHARE = 0.4;

const bigDeals = [
  { id: "brightwater", name: "Brightwater Bank", type: "New logo", value: 0.21, prob: 0.55 },
  { id: "tidewater", name: "Tidewater Systems", type: "Expansion", value: 0.186, prob: 0.81 },
  { id: "halcyon", name: "Halcyon Health", type: "New logo", value: 0.142, prob: 0.64 },
  { id: "meridian", name: "Meridian Hotels", type: "Expansion", value: 0.12, prob: 0.72 },
];

const fmt = (m: number) => `$${m.toFixed(2)}M`;

function AnimatedMoney({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = fmt(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);
  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}

export function ScenarioPlanner() {
  const [slipped, setSlipped] = useState<Record<string, boolean>>({});
  const [winRate, setWinRate] = useState(0);
  const sliderId = useId();

  const result = useMemo(() => {
    const lost = bigDeals.reduce((sum, d) => sum + (slipped[d.id] ? d.value * d.prob : 0), 0);
    const openEv = Math.max(0, OPEN_EV - lost + OPEN_EV * NEW_LOGO_SHARE * (winRate / 100));
    const value = CLOSED + openEv;
    const scale = Math.sqrt(openEv / OPEN_EV);
    return {
      value,
      low: value - (FINAL - LOW) * scale,
      high: value + (HIGH - FINAL) * scale,
      gap: value - TARGET,
    };
  }, [slipped, winRate]);

  const changed = winRate !== 0 || Object.values(slipped).some(Boolean);

  // Range bar maps $4.0M to $5.6M
  const pos = (v: number) => `${Math.min(100, Math.max(0, ((v - 4) / 1.6) * 100))}%`;

  return (
    <div className="overflow-hidden rounded-lg border border-paper/15 bg-[#1b1e20]">
      <div className="flex items-center justify-between border-b border-paper/15 px-4 py-2.5 text-sm sm:px-5">
        <span className="font-medium">Scenario planner</span>
        <button
          type="button"
          onClick={() => {
            setSlipped({});
            setWinRate(0);
          }}
          disabled={!changed}
          className="-mr-2 inline-flex min-h-11 items-center rounded-md px-3 text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper active:bg-paper/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-8 p-4 sm:p-6 md:grid-cols-2">
        <div>
          <fieldset>
            <legend className="text-[0.8125rem] text-paper/70">Slip to next quarter</legend>
            <ul className="mt-3 space-y-2">
              {bigDeals.map((d) => {
                const on = !!slipped[d.id];
                return (
                  <li key={d.id}>
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-paper/15 px-3 py-2 transition-colors hover:border-paper/40 has-[:checked]:border-signal has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-paper">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={on}
                        onChange={(e) => setSlipped((s) => ({ ...s, [d.id]: e.target.checked }))}
                      />
                      <span
                        className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-paper/40 transition-colors peer-checked:border-signal peer-checked:bg-signal"
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 12 12" className={`size-3 text-ink transition-opacity ${on ? "opacity-100" : "opacity-0"}`}>
                          <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{d.name}</span>
                        <span className="tabular block text-[0.75rem] text-paper/65">
                          {d.type} · ${Math.round(d.value * 1000)}K · {Math.round(d.prob * 100)}%
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <label htmlFor={sliderId} className="text-[0.8125rem] text-paper/70">
                New-logo win rate
              </label>
              <span className="tabular text-sm font-medium">
                {winRate > 0 ? "+" : ""}
                {winRate} pts
              </span>
            </div>
            <input
              id={sliderId}
              type="range"
              min={-10}
              max={10}
              step={1}
              value={winRate}
              onChange={(e) => setWinRate(Number(e.target.value))}
              aria-valuetext={`${winRate > 0 ? "plus " : winRate < 0 ? "minus " : ""}${Math.abs(winRate)} points`}
              className="mt-3 h-11 w-full cursor-pointer appearance-none bg-transparent accent-signal [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-signal [&::-moz-range-track]:h-[3px] [&::-moz-range-track]:bg-paper/25 [&::-webkit-slider-runnable-track]:h-[3px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-paper/25 [&::-webkit-slider-thumb]:-mt-[8.5px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-signal"
            />
            <div className="tabular flex justify-between text-[0.75rem] text-paper/55" aria-hidden="true">
              <span>−10</span>
              <span>0</span>
              <span>+10</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:border-l md:border-paper/15 md:pl-8" aria-live="polite">
          <p className="text-[0.8125rem] text-paper/70">Projected Q4 revenue</p>
          <AnimatedMoney value={result.value} className="tabular mt-1 font-display text-[clamp(3rem,2.4rem+2.4vw,4.5rem)] leading-none tracking-tight" />
          <p className="tabular mt-2 text-sm text-paper/80">
            80% range {fmt(result.low)} to {fmt(result.high)}
          </p>
          <p
            className={`tabular mt-4 inline-flex w-fit rounded-sm px-2 py-1 text-[0.8125rem] font-medium ${
              result.gap >= 0 ? "bg-paper text-ink" : "bg-signal text-ink"
            }`}
          >
            ${Math.round(Math.abs(result.gap) * 1000)}K {result.gap >= 0 ? "above" : "below"} target
          </p>

          <div className="mt-auto pt-10" aria-hidden="true">
            <div className="relative h-10">
              <div className="absolute inset-x-0 top-1/2 h-px bg-paper/20" />
              {/* Transform-only motion: full-width layers translated and scaled */}
              <div
                className="absolute inset-x-0 top-1/2 h-3 origin-left -translate-y-1/2 rounded-sm bg-paper/25 transition-transform duration-500 ease-[var(--ease-out-expo)]"
                style={{ transform: `translate(${pos(result.low)}, -50%) scaleX(${(parseFloat(pos(result.high)) - parseFloat(pos(result.low))) / 100})` }}
              />
              <div
                className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 transition-transform duration-500 ease-[var(--ease-out-expo)]"
                style={{ transform: `translate(${pos(result.value)}, -50%)` }}
              >
                <span className="absolute top-0 left-0 size-3 -translate-x-1/2 rounded-full bg-signal" />
              </div>
              <div className="absolute top-0 bottom-0 w-px bg-paper" style={{ left: pos(TARGET) }} />
            </div>
            <div className="tabular relative mt-1 h-4 text-[0.75rem] text-paper/60">
              <span className="absolute left-0">$4.0M</span>
              <span className="absolute -translate-x-1/2 text-paper" style={{ left: pos(TARGET) }}>
                Target
              </span>
              <span className="absolute right-0">$5.6M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
