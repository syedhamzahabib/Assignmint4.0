// qa_smoke/helpers/assert.ts - Tiny assert helpers
export function ok(cond: boolean, msg: string) { 
  if (!cond) throw new Error(msg); 
}

export function eq<T>(a: T, b: T, msg: string) { 
  if (a !== b) throw new Error(`${msg} | got=${a} expected=${b}`); 
}

export function gt(a: number, b: number, msg: string) {
  if (a <= b) throw new Error(`${msg} | got=${a} expected>${b}`);
}

export function gte(a: number, b: number, msg: string) {
  if (a < b) throw new Error(`${msg} | got=${a} expected>=${b}`);
}

export function lt(a: number, b: number, msg: string) {
  if (a >= b) throw new Error(`${msg} | got=${a} expected<${b}`);
}

export function lte(a: number, b: number, msg: string) {
  if (a > b) throw new Error(`${msg} | got=${a} expected<=${b}`);
}
