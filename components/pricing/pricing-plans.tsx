"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/button";

type Billing = "monthly" | "annual";

const plans = [
  {
    id: "team",
    name: "Team",
    price: { monthly: 59, annual: 49 },
    blurb: "For one sales team getting its forecast out of a spreadsheet.",
    limit: "Up to 25 sellers",
    cta: "Book a demo",
    features: ["Daily deal scoring with reasons", "Forecast with an 80% range", "One CRM connection", "Monday risk digest", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: { monthly: 99, annual: 82 },
    blurb: "For multi-team orgs that run a weekly forecast call.",
    limit: "Unlimited sellers",
    cta: "Book a demo",
    featured: true,
    features: [
      "Everything in Team",
      "Rep, team and company roll-ups",
      "Scenario planner",
      "Manager call vs model view",
      "Forecast accuracy history",
      "Email and calendar signals",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    blurb: "For revenue orgs with several segments, regions or fiscal calendars.",
    limit: "Annual agreement",
    cta: "Talk to us",
    features: ["Everything in Growth", "SSO, SAML and SCIM", "Custom segments and calendars", "Sandbox environment", "Named success manager", "Security review support"],
  },
] as const;

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("annual");
  const reduce = useReducedMotion();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="radiogroup" aria-label="Billing period" className="relative inline-flex w-fit rounded-md border border-line bg-paper-2 p-1">
          {(["monthly", "annual"] as const).map((b) => (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={billing === b}
              onClick={() => setBilling(b)}
              onKeyDown={(e) => {
                if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                  e.preventDefault();
                  const next = b === "monthly" ? "annual" : "monthly";
                  setBilling(next);
                  (e.currentTarget.parentElement?.querySelector(`[data-billing=${next}]`) as HTMLElement | null)?.focus();
                }
              }}
              tabIndex={billing === b ? 0 : -1}
              data-billing={b}
              className="relative min-h-11 rounded-[4px] px-4 text-sm font-medium transition-colors aria-checked:text-paper aria-[checked=false]:text-ink-2 aria-[checked=false]:hover:text-ink"
            >
              {billing === b ? (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-[4px] bg-ink"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                />
              ) : null}
              <span className="relative">{b === "monthly" ? "Monthly" : "Annual"}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-ink-2">
          Annual billing gives you <span className="font-medium text-ink">two months free</span>. Prices in USD per seller.
        </p>
      </div>

      <ul className="mt-10 grid border-t border-ink lg:grid-cols-3">
        {plans.map((plan) => {
          const featured = "featured" in plan && plan.featured;
          return (
            <li
              key={plan.id}
              className={`flex flex-col border-b border-line px-0 py-10 lg:border-b-0 lg:px-8 lg:py-12 ${
                featured ? "on-dark -mx-4 bg-ink px-4 text-paper sm:mx-0 sm:rounded-b-lg sm:px-8 lg:-mt-px" : "lg:border-l lg:border-line lg:first:border-l-0 lg:first:pl-0"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-display-s">{plan.name}</h2>
                {featured ? (
                  <span className="rounded-sm bg-signal px-2 py-1 text-[0.75rem] font-medium text-ink">Most teams start here</span>
                ) : null}
              </div>
              <p className={`mt-3 min-h-[3.3em] ${featured ? "text-paper/80" : "text-ink-2"}`}>{plan.blurb}</p>

              <div className="mt-8 flex h-[4.5rem] items-end gap-2">
                {plan.price ? (
                  <>
                    <span className="relative inline-flex overflow-hidden font-display text-[4.25rem] leading-none tracking-tight">
                      <span className="sr-only">
                        ${plan.price[billing]} per seller per month, billed {billing === "annual" ? "annually" : "monthly"}
                      </span>
                      <span aria-hidden="true">$</span>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={plan.price[billing]}
                          aria-hidden="true"
                          className="tabular inline-block"
                          initial={reduce ? false : { y: "100%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={reduce ? undefined : { y: "-100%", opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {plan.price[billing]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className={`pb-2 text-sm ${featured ? "text-paper/70" : "text-muted"}`}>
                      per seller
                      <br />
                      per month
                    </span>
                  </>
                ) : (
                  <span className="font-display text-[3.25rem] leading-none tracking-tight">Custom</span>
                )}
              </div>
              <p className={`tabular mt-3 text-sm ${featured ? "text-paper/70" : "text-muted"}`}>
                {plan.price
                  ? billing === "annual"
                    ? `Billed yearly · $${plan.price.monthly} if monthly`
                    : `Billed monthly · $${plan.price.annual} on annual`
                  : "Volume pricing for 150+ sellers"}
              </p>

              <ButtonLink href={`/demo?plan=${plan.id}`} variant={featured ? "primary" : "secondary"} className="mt-8 w-full sm:w-fit">
                {plan.cta}
              </ButtonLink>

              <p className={`mt-10 text-sm font-medium ${featured ? "text-paper" : "text-ink"}`}>{plan.limit}</p>
              <ul className="mt-4 space-y-3 text-[0.9375rem]">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className={`mt-1 size-4 shrink-0 ${featured ? "text-signal" : "text-pine"}`} strokeWidth={2.2} aria-hidden="true" />
                    <span className={featured ? "text-paper/85" : "text-ink-2"}>{f}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <SeatCalculator billing={billing} />
    </div>
  );
}

function SeatCalculator({ billing }: { billing: Billing }) {
  const [seats, setSeats] = useState(40);
  const [planId, setPlanId] = useState<"team" | "growth">("growth");
  const sliderId = useId();
  const inputId = useId();
  const errorId = useId();

  const teamTooSmall = planId === "team" && seats > 25;
  const plan = plans.find((p) => p.id === planId)!;
  const perSeat = plan.price ? plan.price[billing] : 0;
  const monthly = perSeat * seats;
  const yearly = monthly * 12;
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <section aria-labelledby="calc-heading" className="mt-20 grid gap-10 rounded-lg border border-line bg-paper-2 p-5 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-12">
      <div className="lg:col-span-5">
        <h2 id="calc-heading" className="font-display text-display-s">
          Estimate your cost
        </h2>
        <p className="mt-3 max-w-sm text-ink-2">
          Count anyone who owns open opportunities. Managers, RevOps and executives get viewer seats at no cost.
        </p>

        <fieldset className="mt-8">
          <legend className="text-sm font-medium">Plan</legend>
          <div className="mt-3 flex gap-2">
            {(["team", "growth"] as const).map((id) => (
              <label
                key={id}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-line bg-paper px-4 text-sm font-medium transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
              >
                <input type="radio" name="calc-plan" value={id} checked={planId === id} onChange={() => setPlanId(id)} className="sr-only" />
                {id === "team" ? "Team" : "Growth"}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="lg:col-span-7">
        <div className="flex items-end justify-between gap-4">
          <label htmlFor={sliderId} className="text-sm font-medium">
            Sellers
          </label>
          <label htmlFor={inputId} className="sr-only">
            Number of sellers
          </label>
          <input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={1}
            max={150}
            value={seats}
            onChange={(e) => setSeats(Math.min(150, Math.max(1, Number(e.target.value) || 1)))}
            aria-describedby={teamTooSmall ? errorId : undefined}
            className="tabular h-11 w-24 rounded-md border border-line bg-paper px-3 text-right text-base font-medium transition-colors hover:border-ink/50 focus:border-ink"
          />
        </div>
        <input
          id={sliderId}
          type="range"
          min={1}
          max={150}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="mt-3 h-11 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-ink [&::-moz-range-track]:h-[3px] [&::-moz-range-track]:bg-line [&::-webkit-slider-runnable-track]:h-[3px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-line [&::-webkit-slider-thumb]:-mt-[8.5px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink"
        />
        <div className="tabular flex justify-between text-[0.75rem] text-muted" aria-hidden="true">
          <span>1</span>
          <span>150</span>
        </div>

        <div className="mt-8 border-t border-line pt-6" aria-live="polite">
          {teamTooSmall ? (
            <p id={errorId} className="rounded-md border border-signal-ink/30 bg-[#f6dfd6] px-4 py-3 text-sm text-ink">
              Team covers up to 25 sellers. For {seats} sellers,{" "}
              <button type="button" onClick={() => setPlanId("growth")} className="font-medium underline underline-offset-4 hover:text-signal-ink">
                switch to Growth
              </button>
              .
            </p>
          ) : (
            <div>
            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-muted">Per month</dt>
                <dd className="tabular mt-1 font-display text-[clamp(2.25rem,1.9rem+1.4vw,3.25rem)] leading-none">{fmt(monthly)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">{billing === "annual" ? "Billed per year" : "Over 12 months"}</dt>
                <dd className="tabular mt-1 font-display text-[clamp(2.25rem,1.9rem+1.4vw,3.25rem)] leading-none">{fmt(yearly)}</dd>
              </div>
            </dl>
              <p className="mt-6 text-sm text-ink-2">
                {seats} sellers × ${perSeat} on {plan.name}, billed {billing === "annual" ? "annually" : "monthly"}.{" "}
                {billing === "monthly" && plan.price ? `Annual billing would save ${fmt((plan.price.monthly - plan.price.annual) * seats * 12)} a year.` : null}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
