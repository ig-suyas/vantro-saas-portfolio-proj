import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "primary" | "secondary" | "inverse" | "ghost";

const base =
  "group relative inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-[0.9375rem] font-medium tracking-[-0.005em] transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-out-expo)] active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const variants: Record<Variant, string> = {
  // Signal orange with ink text: 5.4:1
  primary: "bg-signal text-ink hover:bg-ink hover:text-paper",
  secondary: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  inverse: "bg-paper text-ink hover:bg-signal",
  ghost: "px-0 text-ink",
};

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

function Arrow() {
  return (
    <span aria-hidden="true" className="relative inline-flex size-4 overflow-hidden">
      <ArrowUpRight className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-4 group-hover:-translate-y-4" strokeWidth={2} />
      <ArrowUpRight className="absolute size-4 -translate-x-4 translate-y-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:translate-y-0" strokeWidth={2} />
    </span>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  arrow?: boolean;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", arrow = true, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, className)} {...props}>
      <span className={variant === "ghost" ? "link-draw group-hover:bg-[length:100%_1px]" : undefined}>{children}</span>
      {arrow ? <Arrow /> : null}
    </Link>
  );
}
