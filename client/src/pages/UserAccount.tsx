import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAccountSchema } from "@/utils/schemas/userSchemas";
import { updatePasswordSchema } from "@/utils/schemas/authSchemas";
import { useAppContext } from "@/hooks";
import { Button } from "@/components/ui/button";
import { useUpdateUserAccount } from "@/features/user";
import { useUpdatePassword, useLogoutUser } from "@/features/auth";
import zod from "zod";
import Loader from "@/components/Loader";

type UpdateAccountType = {
  userName: string;
  email: string;
};

type UpdatePasswordType = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export default function UserAccount() {
  const appContext = useAppContext();
  const userInfo = appContext?.state.authUser;

  const {
    mutateAsync: updateAccountAction,
    isPending: isUpdateAccountPending,
  } = useUpdateUserAccount();
  const {
    mutateAsync: updatePasswordAction,
    isPending: isUpdatePasswordPending,
  } = useUpdatePassword();
  const { mutateAsync: logoutUserAction } = useLogoutUser();

  const formAcc = useForm<UpdateAccountType>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      userName: userInfo ? userInfo.userName : "",
      email: userInfo ? userInfo.email : "",
    },
  });

  const formPass = useForm<UpdatePasswordType>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  function accHandleFormSubmit(data: zod.infer<typeof updateAccountSchema>) {
    updateAccountAction(data);
  }

  function passHandleFormSubmit(data: zod.infer<typeof updatePasswordSchema>) {
    updatePasswordAction(data);
    const timer = setTimeout(() => {
      logoutUserAction();
      localStorage.clear();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }

  const isPending = isUpdateAccountPending || isUpdatePasswordPending;

  if (isPending) {
    return <Loader />;
  }

  return (
    <Tabs defaultValue="account" className="w-[330px] md:w-[400px] mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...formAcc}>
              <form
                onSubmit={formAcc.handleSubmit(accHandleFormSubmit)}
                className="grid space-y-6 max-w-[22rem] m-auto"
              >
                <FormField
                  control={formAcc.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="userName">User Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="userName"
                          placeholder="user name..."
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAcc.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email..."
                          id="email"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant={"ringHover"}>
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...formPass}>
              <form
                onClick={formPass.handleSubmit(passHandleFormSubmit)}
                className="grid space-y-8 max-w-[22rem] m-auto"
              >
                <FormField
                  control={formPass.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          type="password"
                          id="currentPassword"
                          label="current password..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={formPass.control}
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={formPass.control}
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
                    </FormItem>
                  )}
                />
                <Button type="submit" variant={"ringHover"}>
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
