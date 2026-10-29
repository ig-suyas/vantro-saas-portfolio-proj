"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { WEEKS, TODAY, FINAL, LOW, HIGH, TARGET, forecast, lower, upper, closedAt, money } from "@/lib/forecast";

/* ------------------------------------------------------------------
   Signature moment: scattered deals are read left to right by a scan
   line and settle into a stepped "closed" line, a forecast with its
   80% range, or an at-risk lane. All values are sample data.
   ------------------------------------------------------------------ */

const YMAX = 6.2;
const LANE_V = -1;

const SCAN_START = 1700;
const SCAN_DUR = 2200;
const MOVE_DUR = 760;
const END = SCAN_START + SCAN_DUR + 500;

const INK = "18,20,22";
const PINE = "46,90,76";
const SIGNAL = "228,87,46";
const MUTED = "120,124,120";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const invEaseInOutSine = (e: number) => Math.acos(1 - 2 * clamp01(e)) / Math.PI;


function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COMPANIES = [
  "Northwind Freight", "Halcyon Health", "Kestrel Labs", "Oakmont Supply", "Fenwick Bio", "Larkspur Media",
  "Copperline", "Tidewater Systems", "Mesa Logistics", "Brightwater Bank", "Quarry & Co", "Juniper Retail",
  "Silverpine Energy", "Arden Insurance", "Ridgeway Foods", "Bluefield Parts", "Cobalt Clinics", "Meridian Hotels",
  "Harbor Analytics", "Stonebridge Legal", "Wren Software", "Pioneer Mills", "Alder Education", "Granite Payroll",
];
const KINDS = ["New logo", "Expansion", "Renewal", "Pilot"];

type DealKind = "won" | "open" | "risk";
type Deal = {
  kind: DealKind;
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  value: number;
  prob: number;
  name: string;
  phase: number;
  appear: number;
  moveStart: number;
};

function buildDeals(count: number, replaySeed: number): Deal[] {
  const fixed = mulberry32(7);
  const rand = mulberry32(replaySeed);
  const deals: Deal[] = [];
  for (let i = 0; i < count; i++) {
    const roll = fixed();
    const kind: DealKind = roll < 0.3 ? "won" : roll < 0.85 ? "open" : "risk";
    const value = Math.round(12000 * Math.exp(fixed() * 3) / 1000) * 1000;
    let tx: number;
    let ty: number;
    let prob: number;
    if (kind === "won") {
      tx = 0.25 + fixed() * 5.7;
      ty = closedAt(tx) + (fixed() - 0.5) * 0.08;
      prob = 1;
    } else if (kind === "open") {
      tx = 6.3 + 6.6 * Math.pow(fixed(), 0.7);
      const width = Math.max(0.22, upper(tx) - lower(tx));
      ty = forecast(tx) + (fixed() - 0.5) * width;
      prob = 0.42 + fixed() * 0.53;
    } else {
      tx = 6.4 + fixed() * 6.5;
      ty = LANE_V + (fixed() - 0.5) * 0.22;
      prob = 0.06 + fixed() * 0.2;
    }
    const company = COMPANIES[Math.floor(fixed() * COMPANIES.length)];
    const type = KINDS[Math.floor(fixed() * KINDS.length)];
    deals.push({
      kind,
      tx,
      ty,
      value,
      prob,
      name: `${company} · ${type}`,
      sx: 0.2 + rand() * 12.6,
      sy: 0.35 + rand() * 5.5,
      phase: rand() * Math.PI * 2,
      appear: 80 + rand() * 1100,
      moveStart: SCAN_START + SCAN_DUR * invEaseInOutSine(tx / WEEKS) - 620 + rand() * 140,
    });
  }
  return deals;
}

const drift = (d: Deal, t: number) => ({
  x: d.sx + Math.sin(t * 0.0011 + d.phase) * 0.14,
  y: d.sy + Math.cos(t * 0.0013 + d.phase) * 0.09,
});

function dealPosition(d: Deal, t: number) {
  if (t <= d.moveStart) return drift(d, t);
  const from = drift(d, d.moveStart);
  const e = easeInOutCubic(clamp01((t - d.moveStart) / MOVE_DUR));
  return { x: lerp(from.x, d.tx, e), y: lerp(from.y, d.ty, e) };
}

const usd = (v: number) => `$${Math.round(v / 1000)}K`;

type Layout = {
  w: number;
  h: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  laneY: number;
  scale: number;
  font: string;
  /** Text extents of the overlaid readout, in canvas px; null when it sits above the chart. */
  avoid: { right: number; bottom: number } | null;
};

type Hover = { deal: Deal; x: number; y: number; w: number } | null;

export function ForecastCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Hover>(null);

  const s = useRef({
    elapsed: 0,
    last: 0,
    raf: 0,
    visible: true,
    deals: [] as Deal[],
    seed: 11,
    layout: null as Layout | null,
    pointer: null as { x: number; y: number } | null,
    hoverDeal: null as Deal | null,
    done: false,
  });

  const toPx = useCallback((L: Layout, w: number, v: number) => {
    const x = L.left + (w / WEEKS) * (L.w - L.left - L.right);
    const plotBottom = L.h - L.bottom;
    const y = v >= 0 ? plotBottom - (v / YMAX) * (plotBottom - L.top) : plotBottom + (-v / -LANE_V) * (L.laneY - plotBottom);
    return { x, y };
  }, []);

  const draw = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      const L = s.current.layout;
      if (!canvas || !L) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, L.w, L.h);

      const k = L.scale;
      const plotBottom = L.h - L.bottom;
      const gridA = easeOutCubic(clamp01(t / 600));
      const scanP = clamp01((t - SCAN_START) / SCAN_DUR);
      const scanW = WEEKS * easeInOutSine(scanP);
      const finished = t >= SCAN_START + SCAN_DUR;
      const finalA = easeOutCubic(clamp01((t - SCAN_START - SCAN_DUR) / 500));

      // Grid
      ctx.font = `${11 * k}px ${L.font}`;
      ctx.textBaseline = "middle";
      for (let v = 0; v <= 6; v++) {
        const { y } = toPx(L, 0, v);
        ctx.strokeStyle = `rgba(${INK},${(v === 0 ? 0.22 : 0.07) * gridA})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(L.left, Math.round(y) + 0.5);
        ctx.lineTo(L.w - L.right, Math.round(y) + 0.5);
        ctx.stroke();
        if (v % 2 === 0) {
          ctx.fillStyle = `rgba(${INK},${0.5 * gridA})`;
          ctx.textAlign = "right";
          ctx.fillText(v === 0 ? "$0" : `$${v}M`, L.left - 8 * k, y);
        }
      }
      ctx.textAlign = "center";
      for (const wk of [1, 4, 7, 10, 13]) {
        const { x } = toPx(L, wk - 0.5, 0);
        ctx.fillStyle = `rgba(${INK},${0.5 * gridA})`;
        ctx.fillText(`W${wk}`, x, plotBottom + 14 * k);
      }

      // At-risk lane
      ctx.strokeStyle = `rgba(${INK},${0.12 * gridA})`;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(L.left, L.laneY);
      ctx.lineTo(L.w - L.right, L.laneY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = "left";
      ctx.fillStyle = `rgba(${INK},${0.5 * gridA})`;
      ctx.fillText("At risk, excluded", L.left, L.laneY + 14 * k);

      // Today marker
      // Starts mid-plot so the top-left stays clear for the readout
      const today = toPx(L, TODAY, 0);
      let todayTop = toPx(L, TODAY, 3).y;
      if (L.avoid && L.avoid.right + 24 > today.x && L.avoid.bottom + 24 > todayTop) todayTop = L.avoid.bottom + 24;
      ctx.strokeStyle = `rgba(${INK},${0.25 * gridA})`;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(Math.round(today.x) + 0.5, todayTop);
      ctx.lineTo(Math.round(today.x) + 0.5, plotBottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = `rgba(${INK},${0.6 * gridA})`;
      ctx.textAlign = "center";
      ctx.fillText("Today", today.x, todayTop - 10 * k);

      // Target
      const tgt = toPx(L, 0, TARGET);
      const tgtStart =
        L.avoid && L.avoid.bottom + 8 > tgt.y - 8 ? Math.max(today.x, L.avoid.right + 14) : today.x;
      ctx.strokeStyle = `rgba(${INK},${0.4 * gridA})`;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(tgtStart, Math.round(tgt.y) + 0.5);
      ctx.lineTo(L.w - L.right, Math.round(tgt.y) + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = "right";
      ctx.fillStyle = `rgba(${INK},${0.65 * gridA})`;
      ctx.fillText(`Target ${money(TARGET).replace(".60", ".6")}`, L.w - L.right, tgt.y + 13 * k);

      // 80% range band, revealed up to the scan head
      const bandEnd = Math.max(TODAY, scanW);
      if (bandEnd > TODAY) {
        ctx.beginPath();
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          const w = TODAY + ((bandEnd - TODAY) * i) / steps;
          const p = toPx(L, w, upper(w));
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        for (let i = steps; i >= 0; i--) {
          const w = TODAY + ((bandEnd - TODAY) * i) / steps;
          const p = toPx(L, w, lower(w));
          ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(${PINE},0.14)`;
        ctx.fill();
      }

      // Deals
      for (const d of s.current.deals) {
        const a = easeOutCubic(clamp01((t - d.appear) / 420));
        if (a <= 0) continue;
        const r0 = (1.7 + 4.4 * Math.sqrt(d.value / 241000)) * k;
        const r = r0 * Math.max(0, easeOutBack(clamp01((t - d.appear) / 520)));
        const pos = dealPosition(d, t);
        const p = toPx(L, pos.x, pos.y);
        const settle = clamp01((t - d.moveStart) / MOVE_DUR);
        const [rgb, alpha] =
          d.kind === "won" ? [INK, 0.82] : d.kind === "open" ? [PINE, 0.78] : [MUTED, 0.45];
        const fromAlpha = 0.26;
        ctx.fillStyle = settle > 0 ? `rgba(${rgb},${lerp(fromAlpha, alpha, settle) * a})` : `rgba(${INK},${fromAlpha * a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (s.current.hoverDeal === d) {
          ctx.strokeStyle = `rgba(${INK},0.9)`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Closed revenue, stepped by week
      const closedEnd = Math.min(scanW, TODAY);
      if (closedEnd > 0) {
        ctx.strokeStyle = `rgba(${INK},0.9)`;
        ctx.lineWidth = 2 * k;
        ctx.lineJoin = "round";
        ctx.beginPath();
        let p = toPx(L, 0, 0);
        ctx.moveTo(p.x, p.y);
        for (let wk = 0; wk < Math.ceil(closedEnd); wk++) {
          const segEnd = Math.min(wk + 1, closedEnd);
          p = toPx(L, segEnd, forecast(wk));
          ctx.lineTo(p.x, p.y);
          if (segEnd === wk + 1) {
            p = toPx(L, wk + 1, forecast(wk + 1));
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Forecast line
      if (scanW > TODAY) {
        ctx.strokeStyle = `rgb(${SIGNAL})`;
        ctx.lineWidth = 2.75 * k;
        ctx.lineCap = "round";
        ctx.beginPath();
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
          const w = TODAY + ((scanW - TODAY) * i) / steps;
          const p = toPx(L, w, forecast(w));
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        const head = toPx(L, scanW, forecast(scanW));
        ctx.fillStyle = `rgb(${SIGNAL})`;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 5 * k, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#f8f6f0";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Scan line
      if (scanP > 0 && t < SCAN_START + SCAN_DUR + 350) {
        const fade = finished ? 1 - clamp01((t - SCAN_START - SCAN_DUR) / 350) : 1;
        const sx = toPx(L, scanW, 0).x;
        ctx.strokeStyle = `rgba(${PINE},${0.55 * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.round(sx) + 0.5, L.top);
        ctx.lineTo(Math.round(sx) + 0.5, L.laneY);
        ctx.stroke();
      }

      // End-of-quarter range bracket
      if (finalA > 0) {
        const hi = toPx(L, WEEKS, HIGH);
        const lo = toPx(L, WEEKS, LOW);
        const x = hi.x + 7 * k;
        ctx.strokeStyle = `rgba(${PINE},${0.9 * finalA})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 3 * k, hi.y);
        ctx.lineTo(x, hi.y);
        ctx.lineTo(x, lo.y);
        ctx.lineTo(x - 3 * k, lo.y);
        ctx.stroke();
      }

      // Crosshair on hover (idle only)
      const ptr = s.current.pointer;
      if (s.current.done && ptr && ptr.x >= L.left && ptr.x <= L.w - L.right && ptr.y <= plotBottom) {
        const w = clamp01((ptr.x - L.left) / (L.w - L.left - L.right)) * WEEKS;
        ctx.strokeStyle = `rgba(${INK},0.35)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.round(ptr.x) + 0.5, L.top);
        ctx.lineTo(Math.round(ptr.x) + 0.5, plotBottom);
        ctx.stroke();
        const v = w <= TODAY ? closedAt(w) : forecast(w);
        const p = toPx(L, w, v);
        ctx.fillStyle = w <= TODAY ? `rgb(${INK})` : `rgb(${SIGNAL})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * k, 0, Math.PI * 2);
        ctx.fill();
        const text =
          w <= TODAY
            ? `Week ${Math.max(1, Math.ceil(w))} · closed ${money(v)}`
            : `Week ${Math.ceil(w)} · ${money(v)} (${money(lower(w))}–${money(upper(w))})`;
        ctx.font = `500 ${11.5 * k}px ${L.font}`;
        const tw = ctx.measureText(text).width + 14 * k;
        const bx = Math.min(Math.max(p.x - tw / 2, L.left), L.w - L.right - tw);
        const by = Math.min(p.y + 14 * k, plotBottom - 26 * k);
        ctx.fillStyle = "rgba(18,20,22,0.92)";
        ctx.beginPath();
        ctx.roundRect(bx, by, tw, 22 * k, 4);
        ctx.fill();
        ctx.fillStyle = "#f3f0e8";
        ctx.textAlign = "left";
        ctx.fillText(text, bx + 7 * k, by + 11 * k);
      }

      // Readout (DOM, updated without React renders)
      const label = labelRef.current;
      const value = valueRef.current;
      const readout = readoutRef.current;
      if (label && value && readout) {
        const openCount = s.current.deals.filter((d) => d.kind !== "won").length;
        if (t < SCAN_START) {
          label.textContent = `Reading ${openCount} open deals`;
          value.textContent = "$0.00M";
        } else if (!finished) {
          label.textContent = `Scoring deals · week ${Math.max(1, Math.ceil(scanW))} of 13`;
          value.textContent = money(scanW <= TODAY ? closedAt(scanW) : forecast(scanW));
        } else {
          label.textContent = "Projected Q4 revenue";
          value.textContent = money(FINAL);
        }
        readout.dataset.done = finished ? "true" : "false";
      }
    },
    [toPx],
  );

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const scale = Math.min(1.12, Math.max(0.82, w / 680));

    // Measure the readout's actual text (not its block boxes) so lines can route around it
    let avoid: Layout["avoid"] = null;
    const ro = readoutRef.current;
    if (ro && getComputedStyle(ro).position === "absolute") {
      const origin = wrap.getBoundingClientRect();
      let right = 0;
      let bottom = 0;
      const add = (r: DOMRect) => {
        if (!r.width) return;
        right = Math.max(right, r.right - origin.left);
        bottom = Math.max(bottom, r.bottom - origin.top);
      };
      const walker = document.createTreeWalker(ro, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        range.selectNodeContents(n);
        for (const r of range.getClientRects()) add(r);
      }
      ro.querySelectorAll("span").forEach((el) => add(el.getBoundingClientRect()));
      avoid = { right, bottom };
    }

    s.current.layout = {
      avoid,
      w,
      h,
      left: 44 * scale,
      right: 26 * scale,
      top: 30 * scale,
      bottom: 64 * scale,
      laneY: h - 30 * scale,
      scale,
      font: getComputedStyle(wrap).fontFamily,
    };
    const count = w < 520 ? 96 : 150;
    if (s.current.deals.length !== count) s.current.deals = buildDeals(count, s.current.seed);
  }, []);

  const play = useCallback(() => {
    const st = s.current;
    cancelAnimationFrame(st.raf);
    st.elapsed = 0;
    st.last = 0;
    st.done = false;
    st.hoverDeal = null;
    st.seed = (st.seed * 9301 + 49297) % 233280;
    st.deals = [];
    measure();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      st.elapsed = END + 1;
      st.done = true;
      draw(st.elapsed);
      return;
    }
    function tick(now: number) {
      const dt = st.last ? Math.min(now - st.last, 50) : 16;
      st.last = now;
      if (st.visible) st.elapsed += dt;
      draw(st.elapsed);
      if (st.elapsed > END) {
        st.done = true;
        st.raf = 0;
        st.last = 0;
        return;
      }
      st.raf = requestAnimationFrame(tick);
    }
    st.raf = requestAnimationFrame(tick);
  }, [draw, measure]);

  const replay = () => {
    setHover(null);
    play();
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const st = s.current;
    play();
    const ro = new ResizeObserver(() => {
      measure();
      if (st.done) draw(st.elapsed);
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      st.visible = entry.isIntersecting;
    });
    io.observe(wrap);
    // Web fonts change the readout's width after first measure
    document.fonts?.ready.then(() => {
      measure();
      if (st.done) draw(st.elapsed);
    });
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(st.raf);
    };
  }, [draw, measure, play]);

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const st = s.current;
    const L = st.layout;
    if (!st.done || !L) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    st.pointer = { x, y };
    let best: Deal | null = null;
    let bestD = 14 * L.scale;
    for (const d of st.deals) {
      const p = toPx(L, d.tx, d.ty);
      const dist = Math.hypot(p.x - x, p.y - y);
      if (dist < bestD) {
        bestD = dist;
        best = d;
      }
    }
    if (best !== st.hoverDeal) {
      st.hoverDeal = best;
      if (best) {
        const p = toPx(L, best.tx, best.ty);
        setHover({ deal: best, x: p.x, y: p.y, w: L.w });
      } else setHover(null);
    }
    if (best) st.pointer = null;
    draw(st.elapsed);
  };

  const onPointerLeave = () => {
    const st = s.current;
    st.pointer = null;
    st.hoverDeal = null;
    setHover(null);
    if (st.done) draw(st.elapsed);
  };

  return (
    <figure className="relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-frame">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 sm:px-5">
        <span className="flex items-center gap-2.5 text-sm">
          <span className="font-medium">Q4 forecast</span>
          <span className="rounded-sm bg-paper-2 px-1.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.06em] text-muted uppercase">
            Sample data
          </span>
        </span>
        <button
          type="button"
          onClick={replay}
          className="-mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink active:bg-paper-3"
        >
          <RotateCcw className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Replay
        </button>
      </figcaption>

      {/* Readout sits above the chart on phones, overlaid on the empty top-left of the plot from sm up */}
      <div
        ref={readoutRef}
        data-done="false"
        className="group pointer-events-none relative z-[1] px-4 pt-4 sm:absolute sm:top-[calc(46px+7%)] sm:left-[12%] sm:max-w-[70%] sm:p-0"
        aria-hidden="true"
      >
        <p ref={labelRef} className="text-[0.8125rem] text-muted">
          Reading open deals
        </p>
        <p ref={valueRef} className="tabular mt-1 font-display text-[clamp(2.6rem,1.8rem+3.4vw,4.6rem)] leading-[0.9] tracking-tight">
          $0.00M
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.8125rem] opacity-0 transition-opacity duration-500 group-data-[done=true]:opacity-100">
          <span className="tabular text-ink-2">80% range {money(LOW)} to {money(HIGH)}</span>
          <span className="tabular rounded-sm bg-pine px-1.5 py-0.5 font-medium text-paper">+{usd((FINAL - TARGET) * 1e6)} vs target</span>
        </div>
      </div>

      <div ref={wrapRef} className="relative min-h-[300px] flex-1 font-sans">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full touch-pan-y"
          role="img"
          aria-label="Animated chart, sample data. Scattered open deals are scored and settle into a Q4 revenue forecast of $4.82M with an 80% range of $4.51M to $5.08M, above a $4.6M target. Low-probability deals drop into an at-risk lane."
          onPointerMove={onPointerMove}
          onPointerDown={onPointerMove}
          onPointerLeave={onPointerLeave}
        />

        {hover ? (
          <div
            className="pointer-events-none absolute z-10 w-max max-w-[220px] -translate-x-1/2 rounded-md bg-ink px-3 py-2 text-[0.8125rem] leading-snug text-paper shadow-pop"
            style={{ left: Math.min(Math.max(hover.x, 110), hover.w - 110), top: hover.y - 74 }}
            role="status"
          >
            <span className="block font-medium">{hover.deal.name}</span>
            <span className="tabular block text-paper/75">
              {usd(hover.deal.value)} ·{" "}
              {hover.deal.kind === "won" ? "Closed won" : `${Math.round(hover.deal.prob * 100)}% likely${hover.deal.kind === "risk" ? ", at risk" : ""}`}
            </span>
          </div>
        ) : null}
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-4 py-3 text-[0.8125rem] text-ink-2 sm:px-5" aria-label="Legend">
        <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-ink" aria-hidden="true" />Closed won</li>
        <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-pine" aria-hidden="true" />Open deal</li>
        <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#787c78]/60" aria-hidden="true" />At risk</li>
        <li className="flex items-center gap-2"><span className="h-[3px] w-4 rounded-full bg-signal" aria-hidden="true" />Forecast</li>
        <li className="flex items-center gap-2"><span className="h-3 w-4 rounded-[2px] bg-pine/20" aria-hidden="true" />80% range</li>
      </ul>
    </figure>
  );
}
