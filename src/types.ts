import {Type} from './parser';

export type Conr = {
    resolve<T>(callables: Callables): T,
    get<T>(name: string | number): T,
    set(name: string | number, value: unknown): void,
    reset(): void,
}

export type Callables = (...deps) => unknown;

export type Result = {
    type: Type,
    result: string | Result[],
}

export type Parser = {
    parse: (string: string) => Result[]
}

export type Extractor = {
    extract: (fn: Callables) => string;
}
