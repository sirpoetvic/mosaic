import type { Logger } from '../types.js';

export function timeLogger(targetConsole: Console = console) {
    const times = new Map<string, number>();
    const logs: string[] = [];

    const push = (msg: string) => { logs.push(msg); };

    const call = (fn?: (...args: any[]) => void, ...args: any[]) => {
        if (typeof fn === 'function') {
            try { fn(...args); } catch { /* ignore */ }
        }
    };

    const setKeyValue = (query?: string) => String(query ?? 'default');

    const logger: Logger = {
        debug: (...args: unknown[]) => { call(targetConsole.debug?.bind(targetConsole), ...args); push(String(args.join(' '))); },
        info: (...args: unknown[]) => { call(targetConsole.info?.bind(targetConsole), ...args); push(String(args.join(' '))); },
        log: (...args: unknown[]) => { call(targetConsole.log?.bind(targetConsole), ...args); push(String(args.join(' '))); },
        warn: (...args: unknown[]) => { call(targetConsole.warn?.bind(targetConsole), ...args); push(String(args.join(' '))); },
        error: (...args: unknown[]) => { call(targetConsole.error?.bind(targetConsole), ...args); push(String(args.join(' '))); },
        group: (label?: string) => { call(targetConsole.group?.bind(targetConsole), label); push(`group: ${label ?? ''}`); },
        groupCollapsed: (label?: string) => { call(targetConsole.groupCollapsed?.bind(targetConsole), label); push(`groupCollapsed: ${label ?? ''}`); },
        groupEnd: () => { call(targetConsole.groupEnd?.bind(targetConsole)); push('groupEnd'); },

        time: (label?: string) => {
            const key = setKeyValue(label);
            // prefer native console.time
            times.set(key, performance.now());
            if (typeof targetConsole.time === 'function') {
                call(targetConsole.time.bind(targetConsole), label);
            } else {
                times.set(key, performance.now());
            }
            push(`time start: ${key}`);
        },

        timeLog: (label?: string) => {
            const key = setKeyValue(label);
            const start = times.get(key);
            if (start != null) {
                const delta = performance.now() - start;
                const msg = `${key}: ${delta.toFixed(1)}ms`;
                call(targetConsole.log.bind(targetConsole), msg);
                push(`timeLog: ${msg}`);
            } else {
                push(`timeLog: no start for ${key}`);
            }
        },

        timeEnd: (label?: string) => {
            const key = setKeyValue(label);
            if (typeof targetConsole.timeEnd === 'function') {
                call(targetConsole.timeEnd.bind(targetConsole), label);
                push(`time end (console): ${key}`);
                return;
            }
            const start = times.get(key);
            if (start != null) {
                const delta = performance.now() - start;
                times.delete(key);
                const msg = `${key}: ${delta.toFixed(1)}ms`;
                call(targetConsole.log.bind(targetConsole), msg);
                push(`timeEnd: ${msg}`);
            } else {
                push(`timeEnd: no start for ${key}`);
            }
        }
    };

    return {
        logger,
        getLogs: () => logs.slice(),
        clearLogs: () => { logs.length = 0; }
    };
}