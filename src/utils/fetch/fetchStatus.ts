// fetchStatus.ts
type Listener = (isFetching: boolean) => void;

let isFetching = false;
const listeners = new Set<Listener>();

export const fetchStatus = {
    get: () => isFetching,
    set: (value: boolean) => {
        isFetching = value;
        listeners.forEach((fn) => fn(isFetching));
    },
    subscribe: (fn: Listener) => {
    listeners.add(fn);
    return () => {
        listeners.delete(fn);
    };
    },
};
