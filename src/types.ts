export type Switch<T, I, E> = keyof T extends never
    ? E
    : I;
