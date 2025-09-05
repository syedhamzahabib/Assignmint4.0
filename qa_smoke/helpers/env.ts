// qa_smoke/helpers/env.ts - Ensure test-friendly timers
export const USE_MOCK = process.env.USE_MOCK === "true";
export const RESERVE_WINDOW_SEC = Number(process.env.RESERVE_WINDOW_SEC ?? 5);
export const MATCH_WAVE_MINUTES = Number(process.env.MATCH_WAVE_MINUTES ?? 0.1);

// Convert to milliseconds for easier use
export const RESERVE_WINDOW_MS = RESERVE_WINDOW_SEC * 1000;
export const MATCH_WAVE_MS = MATCH_WAVE_MINUTES * 60 * 1000;

console.log(`🔧 QA Environment: USE_MOCK=${USE_MOCK}, RESERVE_WINDOW=${RESERVE_WINDOW_SEC}s, MATCH_WAVE=${MATCH_WAVE_MINUTES}m`);
