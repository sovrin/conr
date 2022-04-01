import parser, {Type} from './parser';
import type {Callables, Conr, Result} from './types';

const FN_ARGUMENTS = /^(?:function\s+(?:.*?\()?)?\(?(.*?)\)?(?:\s+=>)?\s+{$.*/gm;

/**
 *
 */
const factory = (): Conr => {
    const dependencies = new Map();
    const {parse} = parser();

    /**
     *
     * @param callables
     */
    const resolve = (callables: Callables): unknown => {
        const match = extract(callables);
        if (match === '' || !match) {
            return callables.apply(null);
        }

        const deps = parse(match)
            .reduce((acc, {result, type}) => {
                if (type === Type.VARIABLE) {
                    acc.push(
                        get(result as string),
                    );
                } else {
                    acc.push(
                        (result as Result[]).reduce((acc, {result}) => (
                            acc[result as string] = get(result as string), acc
                        ), {}),
                    );

                    return acc;
                }

                return acc;
            }, [])
        ;

        return callables.apply(null, deps);
    };

    /**
     *
     */
    const reset = (): void => {
        dependencies.clear();
    };

    /**
     *
     * @param name
     */
    const get = <T>(name: string): T => (
        dependencies.get(name)
    );

    /**
     *
     * @param name
     * @param value
     */
    const set = (name: string | number, value: unknown): void => {
        dependencies.set(name, value);
    };

    /**
     *
     * @param fn
     */
    const extract = (fn: Callables): string => {
        let string = stringify(fn);
        [, string] = (new RegExp(FN_ARGUMENTS))
            .exec(string)
        ;

        return string;
    };

    /**
     *
     * @param fn
     */
    const stringify = (fn: Callables): string => (
        Function.prototype.toString.call(fn)
    );

    return {
        resolve,
        reset,
        get,
        set,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 13.08.2020
 * Time: 17:58
 */
export default factory;
export type {Callables, Result, Conr};
