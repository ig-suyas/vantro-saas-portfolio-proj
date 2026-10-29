import { ButtonLink } from "./button";
import { InView, MaskLines } from "./in-view";

type CtaBandProps = {
  title?: [string, string];
  body?: string;
};

export function CtaBand({
  title = ["See your own pipeline", "as a forecast."],
  body = "A 30-minute walkthrough built around how your CRM is set up. No slide deck.",
}: CtaBandProps) {
  return (
    <section aria-labelledby="cta-heading" className="on-dark relative overflow-hidden bg-pine text-paper">
      <svg
        className="pointer-events-none absolute right-0 bottom-0 h-full w-[70%] min-w-[420px] text-paper/10"
        viewBox="0 0 700 400"
        preserveAspectRatio="xMaxYMax slice"
        aria-hidden="true"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={i}
            d={`M0 ${380 - i * 6} C 220 ${370 - i * 14}, 420 ${300 - i * 26}, 700 ${130 - i * 14}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
        <path d="M0 380 C 220 370, 420 300, 700 130" fill="none" stroke="#e4572e" strokeWidth="2.5" />
      </svg>
      <div className="container-x relative py-24 md:py-36">
        <InView as="h2" reveal="mask" id="cta-heading" className="max-w-4xl font-display text-display-l">
          <MaskLines lines={title} />
        </InView>
        <p className="mt-6 max-w-lg text-lead text-paper/80">{body}</p>
        <div className="mt-10">
          <ButtonLink href="/demo" variant="inverse">
            Book a demo
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
