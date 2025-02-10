export type AnyType<T> = {
    [K in keyof T]: any;
}
