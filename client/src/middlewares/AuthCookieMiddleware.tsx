import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserResponseType } from "@/@types/users";
import { getUserInfo } from "@/api/auth";
import { useCookies } from "react-cookie";
import { useAppContext } from "@/hooks";
import { SET_USER } from "@/contexts/AppContextProvider";
import Loader from "@/components/Loader";

export default function AuthCookieMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookies] = useCookies(["loginCookie"]);
  const appContext = useAppContext();
  const dispatch = appContext?.dispatch;

  const memoizedSelect = useCallback(
    (data: UserResponseType) => data.data.user,
    []
  );
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: () => getUserInfo(),
    enabled: !!cookies.loginCookie,
    select: memoizedSelect,
  });

  useEffect(() => {
    if (query.isSuccess && dispatch && query.data) {
      dispatch({ type: SET_USER, payload: query.data });
    }
  }, [query.data, query.isSuccess, dispatch]);

  if (query.isLoading) {
    return <Loader />;
  }
  return children;
}
