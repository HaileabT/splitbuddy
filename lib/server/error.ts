export class ApiError extends Error {
    constructor(public message: string, public code: number = 500, public details?: object) {
        super(message)
        if (process.env.NODE_ENV === "development") {
            Error.captureStackTrace(this)
            console.error("ERROR_CREATED", this.code, this.cause, this.message, "\n", this.details, "\n", this.stack)
        }
    }
}