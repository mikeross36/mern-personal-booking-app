import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "./ui/floating-label-input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotSchema } from "@/utils/schemas/authSchemas";
import { useForgotPassword } from "@/features/auth";
import zod from "zod";

export default function ForgotPassword() {
  const form = useForm<{ email: string }>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });
  const { mutateAsync: forgotPasswordAction } = useForgotPassword();

  function handleFormSubmit(data: zod.infer<typeof forgotSchema>) {
    forgotPasswordAction(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid space-y-8 m-auto pt-4 md:pt-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <FloatingLabelInput
                  type="email"
                  id="email"
                  label="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
