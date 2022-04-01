/**
 *
 */
export const flatten = () => (haystack: string[]) => haystack.flat(1);

/**
 *
 */
export const pop = () => (haystack: string[]) => haystack.pop();

/**
 *
 */
export const join = () => (haystack: any[]) => haystack.join('');

/**
 *
 */
export const int = () => (number: string) => ~~number;

/**
 *
 * @param values
 */
export const filter = (values: string[]) => (haystack: string[]) => (
    haystack.filter(Boolean)
        .filter(element => !values.includes(element))
);

/**
 *
 * @param fns
 */
export const pipe = (...fns) => (x) => fns.reduce((y, f) => f(y), x);
