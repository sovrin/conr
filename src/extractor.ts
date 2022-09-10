import type {Callables, Extractor} from './types';

const ARROW_FN = /^\(?(.*?)\)?\s=>/s;
const EXPLICIT_FN = /^function\s.*\((.*)\).*{/m

const factory = (): Extractor => {
    /**
     *
     * @param fn
     */
    const extract = (fn: Callables): any => {
        const signature = stringify(fn);
        const regex = (signature.indexOf('function') === 0)
            ? EXPLICIT_FN
            : ARROW_FN
        ;

        const [, args] = regex.exec(signature);

        return args;
    };

    /**
     *
     * @param fn
     *
     */
    const stringify = (fn: Callables): string => (
        Function.prototype.toString.call(fn)
            .split('\n')
            .shift()
    );

    return {
        extract,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 01.04.2022
 * Time: 10:05
 */
export default factory;
