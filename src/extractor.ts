import type {Callables, Extractor} from './types';

const ARROW_FN = /^(?:\w+\s)?\(?(.*?)\)?\s=>/;
const EXPLICIT_FN = /^.*\((.*)\).*{/;
const FN_TEST = /^(async\s)?function\s/;

/**
 *
 */
const factory = (): Extractor => {
    /**
     *
     * @param fn
     */
    const extract = (fn: Callables): string => {
        const signature = stringify(fn);
        const regex = (FN_TEST.test(signature))
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
