import extractor, {Result, Type} from './extractor';
import type {Switch} from './types';

type Callables<T, R> = (args: ({ [K in keyof T]?: T[K] })) => R;
type Resolvable<T, R = unknown> = Callables<T, R>;
type Key<T> = Switch<T, keyof T, string | number>
type Value<T, K extends Key<T>> = K extends keyof T ? T[K] : any;

type Conr<T extends {} = {}> = {
    resolve: <R>(resolvable: Switch<T, Resolvable<T, R>, any>, args?: unknown) => R,
    get: <K extends Key<T>>(key: K) => Value<T, K>,
    set: <K extends Key<T>>(key: K | string, value: Value<T, K>) => Conr<T>,
    reset: () => Conr<T>,
    init: (input: Partial<T>) => Conr<T>,
}

const factory = <T>(): Conr<T> => {
    const dependencies = new Map();
    const {extract} = extractor();

    const reduce = (acc: Array<unknown> | object, result: Result) => {
        let key: string | number;
        let value: unknown;

        if (result.type === Type.VARIABLE) {
            key = result.result;
            value = dependencies.get(key);
        } else if (result.type === Type.OBJECT) {
            value = result.result.reduce(reduce, {});
        }

        if (Array.isArray(acc)) {
            acc.push(value);
        } else {
            acc[key] = value;
        }

        return acc;
    };

    const resolve = <R>(resolvable: Switch<T, Resolvable<T, R>, any>, args?: unknown): R => {
        const extracted = extract<Callables<T, R>>(resolvable);
        const resolved = extracted.reduce(reduce, []) as Array<Record<string, unknown>>;

        return resolvable.apply(args, resolved);
    };

    const reset = (): Conr<T> => {
        dependencies.clear();

        return context();
    };

    const get = <K extends Key<T>>(name: K): Value<T, K> => (
        dependencies.get(name)
    );

    const set = <K extends Key<T>>(name: K | string, value: Value<T, K>): Conr<T> => {
        dependencies.set(name, value);

        return context();
    };

    const init = (input: Partial<T>): Conr<T> => {
        for (const [key, value] of Object.entries(input)) {
            set(key, value as never);
        }

        return context();
    }

    const context = (): Conr<T> => ({
        resolve,
        reset,
        get,
        set,
        init,
    })

    return context();
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 13.08.2020
 * Time: 17:58
 */
export default factory;
export type {Callables, Result, Conr};
