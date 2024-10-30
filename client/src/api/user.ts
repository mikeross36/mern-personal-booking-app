import { apiClient } from "./apiClient";

export async function updateUserAccount(userName: string, email: string) {
  return (
    await apiClient.patch<{ message: string }>("/users/update-user-account", {
      userName,
      email,
    })
  ).data;
}
