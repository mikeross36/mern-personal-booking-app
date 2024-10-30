import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/utils/schemas/authSchemas";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Link } from "react-router-dom";
import { ERoutes } from "@/@types/links";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/api/auth";
import { UserResponseType } from "@/@types/users";
import { useCallback, useEffect } from "react";
import { useLoginUser } from "@/features/auth";
import { useAppContext } from "@/hooks";
import { SET_USER } from "@/contexts/AppContextProvider";
import Modal from "@/components/Modal";
import ForgotPassword from "@/components/ForgotPassword";
import zod from "zod";
import Loader from "@/components/Loader";

type LoginDataType = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const form = useForm<LoginDataType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { mutateAsync: loginUserAction, isPending } = useLoginUser();
  const appContext = useAppContext();
  const dispatch = appContext?.dispatch;

  const memoizedSelect = useCallback(
    (data: UserResponseType) => data.data.user,
    []
  );
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: () => getUserInfo(),
    enabled: false,
    select: memoizedSelect,
    retry: 1,
  });

  useEffect(() => {
    if (query.isSuccess && dispatch && query.data) {
      dispatch({ type: SET_USER, payload: query.data });
    }
  }, [dispatch, query.data, query.isSuccess]);

  function handleFormSubmit(data: zod.infer<typeof loginSchema>) {
    loginUserAction(data, {
      onSuccess: async () => await query.refetch(),
    });
  }

  if (isPending) {
    return <Loader />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid space-y-8 max-w-[22rem] m-auto pt-4 md:pt-8 text-zinc-600"
      >
        <h2 className="text-2xl text-center font-bold">Login</h2>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  type="email"
                  id="email"
                  label="email..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  type="password"
                  id="password"
                  label="password..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <main className="flex flex-col items-center text-sm text-zinc-700 pt-4">
                <div className="text-sm text-zinc-700 pt-4">
                  <Modal side="top">
                    <ForgotPassword />
                  </Modal>
                </div>
                <span>
                  Don't have an account?
                  <Link to={ERoutes.register}>
                    <Button variant={"linkHover2"}>Register</Button>
                  </Link>
                </span>
              </main>
            </FormItem>
          )}
        />
        <Button type="submit" variant={"ringHover"} className="m-0">
          Submit
        </Button>
      </form>
    </Form>
  );
}
