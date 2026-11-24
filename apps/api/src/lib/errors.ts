export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const badRequest = (code: string, message: string) => new AppError(400, code, message);
export const unauthorized = () => new AppError(401, "unauthorized", "Authentication required");
export const notFound = (what = "Resource") => new AppError(404, "not-found", `${what} not found`);
export const conflict = (message: string) => new AppError(409, "conflict", message);
export const serverError = (message = "Internal server error") => new AppError(500, "server-error", message);
