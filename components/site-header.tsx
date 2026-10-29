"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { ButtonLink } from "./button";
import { primaryNav } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on route change
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const button = menuButton.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const items = [button, ...panel.current.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 bg-paper transition-[border-color] duration-300 ${
        scrolled || open ? "border-b border-line" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" aria-label="Vantro home" className="-m-2 rounded-md p-2">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="link-draw py-1 text-[0.9375rem] text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/demo" className="hidden md:inline-flex" aria-current={isActive("/demo") ? "page" : undefined}>
            Book a demo
          </ButtonLink>
          <button
            ref={menuButton}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-paper-2 active:bg-paper-3 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" strokeWidth={1.75} /> : <Menu className="size-6" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* CSS-only motion so the sitewide header doesn't pull in an animation library */}
      {open ? (
          <div
            id="mobile-menu"
            ref={panel}
            className="fixed inset-x-0 top-16 bottom-0 z-40 flex animate-[fade_250ms_var(--ease-out-expo)_both] flex-col bg-paper md:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex flex-1 flex-col pt-6">
              {[...primaryNav, { href: "/demo", label: "Book a demo" }].map((item, i) => (
                <div
                  key={item.href}
                  className="overflow-hidden border-b border-line"
                >
                  <div className="animate-rise" style={{ animationDelay: `${40 * i + 40}ms` }}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex min-h-16 items-center justify-between font-display text-[2.4rem] leading-none tracking-tight aria-[current=page]:text-signal-ink"
                  >
                    {item.label}
                    <span aria-hidden="true" className="font-sans text-sm text-muted tabular">
                      0{i + 1}
                    </span>
                  </Link>
                  </div>
                </div>
              ))}
            </nav>
            <p className="container-x pb-8 text-sm text-muted">Concept project. Vantro is not a real company.</p>
          </div>
      ) : null}
    </header>
  );
}
