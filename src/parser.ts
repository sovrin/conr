import onia, {
    regex,
    alpha,
    map,
    any,
    many,
    sequence,
    optional,
    pop,
    flatten,
    join,
    int,
    filter,
    pipe,
} from 'onia';
import {Parser, Result} from './types';

export enum Type {
    OBJECT = 'object',
    VARIABLE = 'variable',
}

const Char = {
    BRACE_OPEN: '{',
    BRACE_CLOSE: '}',
    DELIMITER: ',',
};

/**
 *
 */
const factory = (): Parser => {
    /**
     *
     * @param type
     */
    const pack = (type: Type) => (result) => ({
        type,
        result,
    });

    const letter = regex(/[a-z]/ig, 'letter');
    const digit = map(
        regex(/\d/g, 'digit'),
        int(),
    );
    const character = any([
        letter,
        digit,
    ]);
    const property = map(
        sequence([
            letter,
            map(
                many(
                    any([
                        letter,
                        character,
                    ]),
                ),
                join(),
            )],
        ),
        pipe(
            join(),
            pack(Type.VARIABLE),
        ),
    );
    const properties = map(
        sequence([
            property,
            optional(
                many(
                    map(
                        sequence([
                            alpha(Char.DELIMITER),
                            property,
                        ]),
                        pipe(
                            filter([Char.DELIMITER]),
                            pop(),
                        ),
                    ),
                ),
            ),
        ]),
        pipe(
            flatten(),
            pack(Type.OBJECT),
        ),
    );
    const object = map(
        sequence([
            alpha(Char.BRACE_OPEN),
            properties,
            alpha(Char.BRACE_CLOSE),
        ]),
        pipe(
            filter([
                Char.BRACE_OPEN,
                Char.DELIMITER,
                Char.BRACE_CLOSE,
            ]),
            pop(),
        ),
    );
    const dependency = any([
        property,
        object,
    ]);
    const expression = map(
        sequence([
            dependency,
            many(
                map(
                    sequence([
                        alpha(Char.DELIMITER),
                        dependency,
                    ]),
                    pipe(
                        filter([
                            Char.DELIMITER,
                        ]),
                        pop(),
                    ),
                ),
            )],
        ),
        flatten(),
    );

    /**
     *
     * @param string
     */
    const parse = (string: string): Result[] => {
        const converted = string.replace(/\s+/g, '');

        return onia(converted, expression);
    };

    return {
        parse,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 30.03.2022
 * Time: 16:27
 */
export default factory;
