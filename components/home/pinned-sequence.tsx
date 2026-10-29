"use client";

import { useEffect, useRef, useState } from "react";
import { ConnectVisual, ScoreVisual, RollupVisual, ActVisual } from "./step-visuals";

const steps = [
  {
    title: "Connect",
    body: "Vantro reads opportunities from your CRM, plus the meetings, email threads and call notes around each deal. Read-only access, no rep data entry.",
    Visual: ConnectVisual,
  },
  {
    title: "Score",
    body: "Every open deal gets a close probability for this quarter, refreshed each morning. Each score lists the signals that moved it, so a manager can check the reasoning.",
    Visual: ScoreVisual,
  },
  {
    title: "Roll up",
    body: "Scores roll up from rep to team to company with a range at every level. You see where the model and your managers disagree before the forecast call.",
    Visual: RollupVisual,
  },
  {
    title: "Act",
    body: "Each Monday, managers get the deals that slipped into risk, why they slipped, and a concrete next step. The forecast turns into a to-do list.",
    Visual: ActVisual,
  },
];

export function PinnedSequence() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    let started = false;

    // GSAP only loads where the pinned layout is shown (lg and up)
    const mq = window.matchMedia("(min-width: 1024px)");
    const start = async () => {
      if (started || !mq.matches) return;
      started = true;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          rail.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top+=72", end: "bottom bottom", scrub: 0.4 },
          },
        );
        ScrollTrigger.create({
          trigger: el,
          start: "top top+=72",
          end: "bottom bottom",
          onUpdate: (self) => setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))),
        });
      }, el);
    };
    start();
    mq.addEventListener("change", start);

    return () => {
      cancelled = true;
      mq.removeEventListener("change", start);
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="how-heading" className="relative hidden lg:block" style={{ height: `calc(100vh + ${(steps.length - 1) * 75}vh)` }}>
      <div className="sticky top-[72px] flex h-[calc(100vh-72px)] items-center">
        <div className="container-x grid grid-cols-12 items-center gap-12">
          <div className="col-span-5">
            <p className="eyebrow text-muted">How it works</p>
            <h2 id="how-heading" className="mt-4 font-display text-display-m">
              From a pipeline of guesses to a number you can defend.
            </h2>

            <div className="mt-10">
              <ol className="flex gap-6">
                {steps.map((step, i) => (
                  <li key={step.title} aria-current={i === active ? "step" : undefined}>
                    <h3
                      className={`flex items-baseline gap-2 text-[1.0625rem] font-medium transition-colors duration-300 ${
                        i === active ? "text-ink" : "text-muted"
                      }`}
                    >
                      <span className="tabular text-sm">0{i + 1}</span>
                      {step.title}
                    </h3>
                  </li>
                ))}
              </ol>
              <div className="relative mt-4 h-px bg-line" aria-hidden="true">
                <span ref={rail} className="absolute inset-0 origin-left scale-x-0 bg-ink" />
              </div>
              {/* Bodies share one grid cell so the frame never changes height */}
              <div className="mt-8 grid">
                {steps.map((step, i) => (
                  <div
                    key={step.title}
                    aria-hidden={i !== active}
                    className={`col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] ${
                      i === active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    }`}
                  >
                    <p className="font-display text-display-s">{step.title}</p>
                    <p className="mt-3 max-w-md text-lead text-ink-2">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative col-span-7 h-[min(560px,calc(100vh-200px))]">
            {steps.map(({ title, Visual }, i) => (
              <div
                key={title}
                aria-hidden={i !== active}
                className={`absolute inset-0 transition-[opacity,transform] duration-[600ms] ease-[var(--ease-out-expo)] ${
                  i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"
                }`}
              >
                <Visual active={i === active} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Mobile and tablet: the same story as a stacked list, no pinning. */
export function StackedSequence() {
  return (
    <section aria-labelledby="how-heading-m" className="py-20 md:py-28 lg:hidden">
      <div className="container-x">
        <p className="eyebrow text-muted">How it works</p>
        <h2 id="how-heading-m" className="mt-4 max-w-xl font-display text-display-m">
          From a pipeline of guesses to a number you can defend.
        </h2>
        <ol className="mt-12 space-y-16">
          {steps.map(({ title, body, Visual }, i) => (
            <li key={title} className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start md:gap-10">
              <div>
                <h3 className="flex items-baseline gap-3 text-[1.1875rem] font-medium">
                  <span className="tabular text-sm text-muted">0{i + 1}</span>
                  {title}
                </h3>
                <p className="mt-2 text-ink-2">{body}</p>
              </div>
              <div className="h-auto">
                <Visual active />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
