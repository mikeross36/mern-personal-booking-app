import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAccount } from "@/api/user";
import { toast } from "react-toastify";

export function useUpdateUserAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userName, email }: { userName: string; email: string }) =>
      updateUserAccount(userName, email),
    onSuccess: (message) => {
      toast.success(message.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
