/* Shared sample forecast for a 13-week quarter, in $M. Fictional data. */

export const WEEKS = 13;
export const TODAY = 6;
export const FINAL = 4.82;
export const LOW = 4.51;
export const HIGH = 5.08;
export const TARGET = 4.6;
export const CLOSED = 1.48;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const forecast = (w: number) => {
  const t = clamp01(w / WEEKS);
  return FINAL * (0.42 * t + 0.58 * Math.pow(t, 2.1));
};
export const spread = (w: number) => Math.pow(Math.max(0, (w - TODAY) / (WEEKS - TODAY)), 1.3);
export const lower = (w: number) => forecast(w) - (FINAL - LOW) * spread(w);
export const upper = (w: number) => forecast(w) + (HIGH - FINAL) * spread(w);
/** Closed revenue is booked weekly, so it steps. */
export const closedAt = (w: number) => forecast(Math.floor(Math.min(w, TODAY)));

export const money = (m: number) => `$${m.toFixed(2)}M`;
