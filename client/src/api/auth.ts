import { apiClient } from "./apiClient";
import { LoginResponseType } from "@/@types/users";

export async function refreshAccessToken() {
  return (await apiClient.get<LoginResponseType>("/auth/refresh-token")).data;
}

export async function registerUser(
  userName: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  return (
    await apiClient.post("/auth/register", {
      userName,
      email,
      password,
      confirmPassword,
    })
  ).data;
}

export async function verifyAccount(verificationString: string) {
  return (await apiClient.post(`/auth/verify/${verificationString}`)).data;
}

export async function loginUser(email: string, password: string) {
  return (
    await apiClient.post<LoginResponseType>("/auth/login", {
      email,
      password,
    })
  ).data;
}

export async function getUserInfo() {
  return (await apiClient.get("/users/user-info")).data;
}

export async function logOutUser() {
  return (await apiClient.post<{ message: string }>("/auth/logout")).data;
}

export async function forgotPassword(email: string) {
  return (
    await apiClient.post<{ message: string }>("/auth/forgot-password", {
      email,
    })
  ).data;
}

export async function resetPassword(
  resetString: string,
  password: string,
  confirmPassword: string
) {
  return (
    await apiClient.patch(`/auth/reset-password/${resetString}`, {
      password,
      confirmPassword,
    })
  ).data;
}

export async function updatePassword(
  currentPassword: string,
  password: string,
  confirmPassword: string
) {
  return (
    await apiClient.patch("/auth/update-password", {
      currentPassword,
      password,
      confirmPassword,
    })
  ).data;
}
