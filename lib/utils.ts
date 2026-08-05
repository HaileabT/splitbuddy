import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ServerResponse } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatErrorRespnse(code: number, message: string, details?: object) {
  const res: ServerResponse<undefined> = {
    status: "failed",
    code,
    message,
    errorDetails: details
  }

  return res
}

export function formatSuccessRespnse<T = any>(code: number, message: string, results?: number, data?: T) {
  const res: ServerResponse<T> = {
    status: "success",
    code,
    message,
    results,
    data
  }

  return res;
}