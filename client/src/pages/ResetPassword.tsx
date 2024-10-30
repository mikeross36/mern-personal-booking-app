import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetSchema } from "@/utils/schemas/authSchemas";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/features/auth";
import zod from "zod";
import Loader from "@/components/Loader";

type ResetPasswordType = {
  resetString: string;
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const { resetString } = useParams();
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      resetString: resetString,
      password: "",
      confirmPassword: "",
    },
  });
  const { mutateAsync: resetPasswordAction, isPending } = useResetPassword();

  function handleFormSubmit(data: zod.infer<typeof resetSchema>) {
    resetPasswordAction(data);
  }

  if (isPending) {
    return <Loader />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 max-w-[22rem] m-auto"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <FloatingLabelInput
                  type="password"
                  id="confirmPassword"
                  label="confirm password..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"ringHover"}>
          Reset
        </Button>
      </form>
    </Form>
  );
}
