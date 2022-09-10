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
     */
    const resolve = <T>(callables: Callables): T => {
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
            let val;

            if (type === Type.VARIABLE) {
                val = get(result);
            } else {
                val = (result as Result[]).reduce(reduce, {});
            }

            if (Array.isArray(acc)) {
                acc.push(val);
            } else {
                acc[result] = val;
            }

            return acc;
        };

        const deps = parse(match)
            .reduce(reduce, [])
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
