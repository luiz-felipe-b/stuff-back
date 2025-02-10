type ResultType<T, E> = { success: true; data: T } | { success: false; error: E };


export class Result<T, E = string> {
    private constructor(private readonly value: ResultType<T, E>) {}

    static success<T>(data: T): Result<T> {
        return new Result({ success: true, data });
    }

    static failure<E>(error: E): Result<never, E> {
        return new Result({ success: false, error });
    }

    isSuccess(): boolean {
        return this.value.success;
    }

    isFailure(): boolean {
        return !this.value.success;
    }

    getData(): T | null {
        return this.value.success ? this.value.data : null;
    }

    getError(): E | null {
        return this.value.success ? null : this.value.error;
    }
}
