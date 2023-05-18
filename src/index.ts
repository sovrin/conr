import parser, {Type} from './parser';
import extractor from './extractor';
import type {Callables, Conr, Result} from './types';

/**
 *
 */
const factory = (): Conr => {
    const dependencies = new Map();
    const {extract} = extractor();
    const {parse} = parser();

    /**
     *
     * @param callables
     * @param args
     */
    const resolve = <T>(callables: Callables, args: unknown): T => {
        const match = extract(callables);
        if (match === '' || !match) {
            return callables.apply(null);
        }

        /**
         *
         * @param acc
         * @param result
         * @param type
         */
        const reduce = (acc, {result, type}) => {
            const value = (type === Type.VARIABLE)
                ? get(result)
                : (result as Result[]).reduce(reduce, {})
            ;

            if (Array.isArray(acc)) {
                acc.push(value);
            } else {
                acc[result] = value;
            }

            return acc;
        };

        const deps = parse(match)
            .reduce(reduce, [])
        ;

        return callables.apply(args, deps);
    };

    /**
     *
     */
    const reset = (): Conr => {
        dependencies.clear();

        return context();
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
    const set = (name: string | number, value: unknown): Conr => {
        dependencies.set(name, value);

        return context();
    };

    /**
     *
     */
    const context = (): Conr => ({
        resolve,
        reset,
        get,
        set,
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
