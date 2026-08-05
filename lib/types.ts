export interface ServerResponse<T = any> {
    status: "failed" | "success",
    code: number,
    message: string,
    results?: number,
    data?: T,
    errorDetails?: object;
}