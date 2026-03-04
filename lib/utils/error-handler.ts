import { toast } from "sonner";

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export class ErrorHandler {
  static handle(error: unknown, context?: string): void {
    console.error(`Error in ${context || "unknown context"}:`, error);
    const { message } = this.extractErrorInfo(error);
    toast.error(message);
  }

  private static extractErrorInfo(error: unknown): AppError {
    const e = error as { message?: string; status?: number; code?: string };
    if (e?.message) {
      return { message: e.message, code: e.code, status: e.status };
    }
    return { message: "Something went wrong. Please try again.", code: "UNKNOWN_ERROR", status: 500 };
  }
}
