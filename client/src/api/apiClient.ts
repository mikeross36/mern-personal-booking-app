import axios from "axios";
import { ERoutes } from "@/@types/links";
import { refreshAccessToken } from "./auth";

const apiUrl = import.meta.env.VITE_API_URL as string;

export const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

apiClient.defaults.headers.common["Content-Type"] = "application/json";

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response.data.message as string;
    if (
      errMessage.includes("You are not logged in!") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      await refreshAccessToken();
      return apiClient(originalRequest);
    }
    if (error.response.data.message.includes("Failed to refresh token")) {
      document.location.href = ERoutes.login;
    }
    return Promise.reject(error);
  }
);

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
