"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertCircle, CalendarPlus, Check, Loader2, WifiOff } from "lucide-react";
import { buttonClasses } from "@/components/button";

/* Front-end only. Nothing is sent anywhere: submit simulates a request,
   then shows a confirmation and offers a client-generated .ics file. */

type Fields = {
  name: string;
  email: string;
  company: string;
  role: string;
  sellers: string;
  crm: string;
  day: string;
  time: string;
  notes: string;
};
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const empty: Fields = { name: "", email: "", company: "", role: "", sellers: "", crm: "", day: "", time: "", notes: "" };
const roles = ["CRO or VP of Sales", "Sales manager", "Revenue operations", "Finance", "Other"];
const sellerBands = ["1 to 10", "11 to 25", "26 to 100", "101 to 250", "More than 250"];
const crms = ["Salesforce", "HubSpot", "Dynamics 365", "Other"];
const times = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];
const freeDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "proton.me", "protonmail.com"];
const NOTES_MAX = 500;
const planNames: Record<string, string> = { team: "Team", growth: "Growth", enterprise: "Enterprise" };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  const email = f.email.trim().toLowerCase();
  if (!email) e.email = "Enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "Enter an email like name@company.com.";
  else if (freeDomains.includes(email.split("@")[1])) e.email = "Use your work email so we can prepare a demo for your team.";
  if (!f.company.trim()) e.company = "Enter your company name.";
  if (!f.role) e.role = "Choose your role.";
  if (!f.sellers) e.sellers = "Choose your team size.";
  if (!f.crm) e.crm = "Choose your CRM.";
  if (!f.day || !f.time) e.day = "Pick a day and a time.";
  if (f.notes.length > NOTES_MAX) e.notes = `Keep notes under ${NOTES_MAX} characters.`;
  return e;
}

function nextBusinessDays(n: number) {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (days.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
  }
  return days;
}

const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function nyOffsetMinutes(ts: number) {
  const part = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", timeZoneName: "shortOffset" })
    .formatToParts(ts)
    .find((p) => p.type === "timeZoneName")?.value;
  const m = part?.match(/GMT([+-]\d+)(?::(\d+))?/);
  if (!m) return -300;
  const h = parseInt(m[1], 10);
  return h * 60 + (m[2] ? Math.sign(h) * parseInt(m[2], 10) : 0);
}

function slotToUtc(day: string, time: string) {
  const [y, mo, d] = day.split("-").map(Number);
  const [, hh, mm, ap] = time.match(/(\d+):(\d+) (AM|PM)/)!;
  let h = parseInt(hh, 10) % 12;
  if (ap === "PM") h += 12;
  const guess = Date.UTC(y, mo - 1, d, h, parseInt(mm, 10));
  return new Date(guess - nyOffsetMinutes(guess) * 60000);
}

function downloadIcs(f: Fields) {
  const start = slotToUtc(f.day, f.time);
  const end = new Date(start.getTime() + 30 * 60000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vantro concept//Demo//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@vantro.example`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    "SUMMARY:Vantro demo (concept)",
    `DESCRIPTION:30-minute Vantro walkthrough for ${f.company.replace(/[,;\\]/g, " ")}. Concept project: this meeting is not real.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "vantro-demo.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const inputBase =
  "mt-2 block min-h-12 w-full rounded-md border bg-surface px-3.5 text-base text-ink transition-colors placeholder:text-muted/80 hover:border-ink/50 focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 aria-[invalid=true]:border-signal-ink";

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-signal-ink">
      <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
      {msg}
    </p>
  ) : null;
}

export function DemoForm() {
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [days, setDays] = useState<Date[] | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const reduce = useReducedMotion();
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  // Client-only: available days depend on the visitor's date
  useEffect(() => {
    const t = setTimeout(() => {
      setDays(nextBusinessDays(5));
      const p = new URLSearchParams(window.location.search).get("plan");
      if (p && planNames[p]) setPlan(p);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    const next = { ...f, [k]: v };
    setF(next);
    if (touched[k] || errors[k]) setErrors((e) => ({ ...e, [k]: validate(next)[k] }));
    if ((k === "day" || k === "time") && errors.day) setErrors((e) => ({ ...e, day: validate(next).day }));
  };
  const blur = (k: keyof Fields) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((e) => ({ ...e, [k]: validate(f)[k] }));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate(f);
    setErrors(e);
    const firstKey = (Object.keys(empty) as (keyof Fields)[]).find((k) => e[k]);
    if (firstKey) {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
      el?.focus();
      return;
    }
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 1300));
    if (!navigator.onLine) {
      setStatus("error");
      return;
    }
    setStatus("success");
  };

  const reset = () => {
    setF(empty);
    setErrors({});
    setTouched({});
    setStatus("idle");
  };

  const busy = status === "submitting";
  const dayLabel = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const chosenDay = days?.find((d) => isoDay(d) === f.day);

  const describe = (k: keyof Fields, hint?: string) => [hint, errors[k] ? id(`${k}-err`) : null].filter(Boolean).join(" ") || undefined;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.div
          key="success"
          ref={(el) => el?.focus()}
          tabIndex={-1}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-lg border border-line bg-surface p-6 shadow-frame outline-none sm:p-10"
          role="status"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-pine text-paper">
            <Check className="size-6" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-display text-display-m">You&apos;re booked, {f.name.trim().split(" ")[0]}.</h2>
          <p className="mt-3 max-w-md text-ink-2">
            {chosenDay ? dayLabel(chosenDay) : f.day} at {f.time} ET, 30 minutes. A confirmation would go to{" "}
            <span className="font-medium text-ink">{f.email.trim()}</span>.
          </p>
          <dl className="mt-8 grid gap-4 border-y border-line py-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted">Company</dt>
              <dd className="mt-1 font-medium">{f.company.trim()}</dd>
            </div>
            <div>
              <dt className="text-muted">Team size</dt>
              <dd className="mt-1 font-medium">{f.sellers} sellers</dd>
            </div>
            <div>
              <dt className="text-muted">CRM</dt>
              <dd className="mt-1 font-medium">{f.crm}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => downloadIcs(f)} className={buttonClasses("primary")}>
              <CalendarPlus className="size-4" aria-hidden="true" />
              Add to calendar
            </button>
            <button type="button" onClick={reset} className={buttonClasses("secondary")}>
              Book another time
            </button>
          </div>
          <p className="mt-6 text-sm text-muted">Concept site: no meeting was created and nothing was sent.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          ref={formRef}
          noValidate
          onSubmit={onSubmit}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          aria-describedby={plan ? id("plan") : undefined}
          className="rounded-lg border border-line bg-paper-2 p-5 sm:p-8"
        >
          {plan ? (
            <p id={id("plan")} className="mb-6 inline-flex rounded-sm bg-ink px-2 py-1 text-[0.8125rem] font-medium text-paper">
              Interested in the {planNames[plan]} plan
            </p>
          ) : null}

          {status === "error" ? (
            <div role="alert" className="mb-6 flex gap-3 rounded-md border border-signal-ink/30 bg-[#f6dfd6] p-4 text-sm">
              <WifiOff className="mt-0.5 size-4 shrink-0 text-signal-ink" aria-hidden="true" />
              <p>
                <span className="font-medium">You seem to be offline.</span> Your booking wasn&apos;t saved. Check your
                connection and submit again. Your answers are still here.
              </p>
            </div>
          ) : null}

          <fieldset disabled={busy} className="grid gap-6 sm:grid-cols-2">
            <legend className="sr-only">Your details</legend>
            <div className="sm:col-span-2">
              <label htmlFor={id("name")} className="text-sm font-medium">Full name</label>
              <input id={id("name")} data-field="name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} aria-invalid={!!errors.name} aria-describedby={describe("name")} className={`${inputBase} ${errors.name ? "" : "border-line"}`} />
              <FieldError id={id("name-err")} msg={errors.name} />
            </div>
            <div>
              <label htmlFor={id("email")} className="text-sm font-medium">Work email</label>
              <input id={id("email")} data-field="email" type="email" autoComplete="email" inputMode="email" placeholder="name@company.com" value={f.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} aria-invalid={!!errors.email} aria-describedby={describe("email")} className={`${inputBase} ${errors.email ? "" : "border-line"}`} />
              <FieldError id={id("email-err")} msg={errors.email} />
            </div>
            <div>
              <label htmlFor={id("company")} className="text-sm font-medium">Company</label>
              <input id={id("company")} data-field="company" autoComplete="organization" value={f.company} onChange={(e) => set("company", e.target.value)} onBlur={() => blur("company")} aria-invalid={!!errors.company} aria-describedby={describe("company")} className={`${inputBase} ${errors.company ? "" : "border-line"}`} />
              <FieldError id={id("company-err")} msg={errors.company} />
            </div>
            <div>
              <label htmlFor={id("role")} className="text-sm font-medium">Your role</label>
              <select id={id("role")} data-field="role" value={f.role} onChange={(e) => set("role", e.target.value)} onBlur={() => blur("role")} aria-invalid={!!errors.role} aria-describedby={describe("role")} className={`${inputBase} ${errors.role ? "" : "border-line"} ${f.role ? "" : "text-muted"}`}>
                <option value="">Select a role</option>
                {roles.map((r) => <option key={r}>{r}</option>)}
              </select>
              <FieldError id={id("role-err")} msg={errors.role} />
            </div>
            <div>
              <label htmlFor={id("sellers")} className="text-sm font-medium">Sellers carrying a quota</label>
              <select id={id("sellers")} data-field="sellers" value={f.sellers} onChange={(e) => set("sellers", e.target.value)} onBlur={() => blur("sellers")} aria-invalid={!!errors.sellers} aria-describedby={describe("sellers")} className={`${inputBase} ${errors.sellers ? "" : "border-line"} ${f.sellers ? "" : "text-muted"}`}>
                <option value="">Select a range</option>
                {sellerBands.map((r) => <option key={r}>{r}</option>)}
              </select>
              <FieldError id={id("sellers-err")} msg={errors.sellers} />
            </div>
          </fieldset>

          <fieldset disabled={busy} className="mt-8" aria-describedby={describe("crm")}>
            <legend className="text-sm font-medium">CRM</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {crms.map((c, i) => (
                <label key={c} className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-line bg-surface px-4 text-sm transition-colors hover:border-ink/60 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
                  <input type="radio" name="crm" value={c} data-field={i === 0 ? "crm" : undefined} checked={f.crm === c} onChange={() => set("crm", c)} className="sr-only" />
                  {c}
                </label>
              ))}
            </div>
            <FieldError id={id("crm-err")} msg={errors.crm} />
          </fieldset>

          <fieldset disabled={busy} className="mt-8" aria-describedby={[id("tz"), errors.day ? id("day-err") : ""].join(" ").trim()}>
            <legend className="text-sm font-medium">Pick a time</legend>
            <p id={id("tz")} className="mt-1 text-sm text-muted">30 minutes. Times in Eastern Time (ET).</p>
            {days ? (
              <>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Day">
                  {days.map((d, i) => {
                    const v = isoDay(d);
                    return (
                      <label key={v} className="flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-md border border-line bg-surface px-2 text-center text-sm transition-colors hover:border-ink/60 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
                        <input type="radio" name="day" value={v} data-field={i === 0 ? "day" : undefined} checked={f.day === v} onChange={() => set("day", v)} className="sr-only" />
                        <span className="font-medium">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                        <span className="tabular text-[0.8125rem] opacity-75">{d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Time">
                  {times.map((t) => (
                    <label key={t} className={`flex min-h-11 items-center justify-center rounded-md border border-line bg-surface text-sm transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${f.day ? "cursor-pointer hover:border-ink/60" : "cursor-not-allowed opacity-45"}`}>
                      <input type="radio" name="time" value={t} disabled={!f.day} checked={f.time === t} onChange={() => set("time", t)} className="sr-only" />
                      <span className="tabular">{t}</span>
                    </label>
                  ))}
                </div>
                {!f.day ? <p className="mt-2 text-sm text-muted">Choose a day to see times.</p> : null}
              </>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5" aria-busy="true" aria-label="Loading available times">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="block min-h-14 animate-pulse rounded-md bg-paper-3" />
                ))}
              </div>
            )}
            <FieldError id={id("day-err")} msg={errors.day} />
          </fieldset>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label htmlFor={id("notes")} className="text-sm font-medium">
                How do you forecast today? <span className="font-normal text-muted">(optional)</span>
              </label>
              <span className={`tabular text-[0.8125rem] ${f.notes.length > NOTES_MAX ? "text-signal-ink" : "text-muted"}`} aria-live="polite">
                {f.notes.length}/{NOTES_MAX}
              </span>
            </div>
            <textarea id={id("notes")} data-field="notes" rows={4} disabled={busy} value={f.notes} onChange={(e) => set("notes", e.target.value)} onBlur={() => blur("notes")} aria-invalid={!!errors.notes} aria-describedby={describe("notes")} placeholder="Spreadsheet roll-up on Thursdays, a forecast call on Fridays..." className={`${inputBase} py-3 ${errors.notes ? "" : "border-line"}`} />
            <FieldError id={id("notes-err")} msg={errors.notes} />
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">Concept site. Nothing you enter leaves your browser.</p>
            <button type="submit" disabled={busy} aria-disabled={busy} className={buttonClasses("primary", "min-w-44")}>
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Booking
                </>
              ) : (
                "Book my demo"
              )}
            </button>
          </div>
          <p className="sr-only" aria-live="assertive">
            {busy ? "Booking your demo" : Object.values(errors).some(Boolean) ? "Some fields need attention." : ""}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
