import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  forgotPassword,
  logOutUser,
  verifyAccount,
  resetPassword,
  updatePassword,
} from "@/api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "@/@types/links";
import { useAppContext } from "@/hooks";
import { SET_USER } from "@/contexts/AppContextProvider";

export function useRegisterUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userName,
      email,
      password,
      confirmPassword,
    }: {
      userName: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => registerUser(userName, email, password, confirmPassword),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useVerifyAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ verificationString }: { verificationString: string }) =>
      verifyAccount(verificationString),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useLoginUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate(ERoutes.home);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useLogoutUser() {
  const appContext = useAppContext();
  const dispatch = appContext?.dispatch;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => logOutUser(),
    onSuccess: (data) => {
      toast.success(data.message);
      dispatch?.({ type: SET_USER, payload: null });
      queryClient.setQueryData(["authUser"], null);
      navigate(ERoutes.login);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => forgotPassword(email),
    onSuccess: (data) => {
      toast.success(data.message);
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({
      resetString,
      password,
      confirmPassword,
    }: {
      resetString: string;
      password: string;
      confirmPassword: string;
    }) => resetPassword(resetString, password, confirmPassword),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate(ERoutes.login);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useUpdatePassword() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({
      currentPassword,
      password,
      confirmPassword,
    }: {
      currentPassword: string;
      password: string;
      confirmPassword: string;
    }) => updatePassword(currentPassword, password, confirmPassword),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate(ERoutes.login);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
