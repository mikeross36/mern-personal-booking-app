export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function controllerAbort() {
  const controller = new AbortController();
  const abortTimeOut = setTimeout(() => controller.abort(), 5000);
  return { controller, abortTimeOut };
}
