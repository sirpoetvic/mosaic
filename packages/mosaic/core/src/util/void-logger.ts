import type { Logger } from '../types.js';

export function voidLogger(): Logger {
  return {
    debug(): void {},
    info(): void {},
    log(): void {},
    warn(): void {},
    error(): void {},
    group(): void {},
    groupCollapsed(): void {},
    groupEnd(): void {},
    time(): void {},
    timeLog(): void {},
    timeEnd(): void {}
  };
}