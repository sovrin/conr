import type {Callables, Extractor} from './types';

const FN_SIGNATURE = /^(?:function\s+(?:.*?\()?)?\(?(.*?)\)?(?:\s+=>)?\s+{$.*/gm;

const factory = (): Extractor => {
    /**
     *
     * @param fn
     */
    const extract = (fn: Callables): string => {
        const signature = stringify(fn);
        const [, args] = (new RegExp(FN_SIGNATURE))
            .exec(signature)
        ;

        return args;
    };

    /**
     *
     * @param fn
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
