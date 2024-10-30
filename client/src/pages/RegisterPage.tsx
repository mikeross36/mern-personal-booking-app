import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";
import { registerSchema } from "@/utils/schemas/authSchemas";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ERoutes } from "@/@types/links";
import { useRegisterUser } from "@/features/auth";
import Loader from "@/components/Loader";

type RegisterDataType = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const form = useForm<RegisterDataType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { mutateAsync: registerUserAction, isPending } = useRegisterUser();

  function handleFormSubmit(data: zod.infer<typeof registerSchema>) {
    registerUserAction(data);
  }

  if (isPending) {
    return <Loader />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid space-y-8 max-w-[22rem] m-auto text-zinc-600"
      >
        <h2 className="text-2xl text-center font-bold">Register</h2>
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  type="text"
                  id="userName"
                  label="user name..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  type="password"
                  id="confirmPassword"
                  label="confirm password..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <>
                <div className="flex flex-col items-center text-sm text-zinc-700 pt-5">
                  <span className="text-sm text-zinc-700 pt-4">
                    Already have an account?
                    <Link to={ERoutes.login}>
                      <Button variant={"linkHover2"}>Login</Button>
                    </Link>
                  </span>
                </div>
              </>
            </FormItem>
          )}
        />
        <Button variant={"ringHover"}>Submit</Button>
      </form>
    </Form>
  );
}
