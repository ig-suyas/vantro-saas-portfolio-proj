"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";

type InViewProps<T extends ElementType> = {
  as?: T;
  reveal: "mask" | "rule";
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** Sets data-inview once the element enters the viewport; CSS in globals.css handles the motion. */
export function InView<T extends ElementType = "div">({ as, reveal, children, className, ...rest }: InViewProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-reveal={reveal} data-inview={seen} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/** Splits a heading into masked lines. Pass lines explicitly so breaks are art-directed. */
export function MaskLines({ lines }: { lines: ReactNode[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="mask-line" style={{ ["--i" as string]: i }}>
          <span>{line}</span>
        </span>
      ))}
    </>
  );
}
