import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVerifyAccount } from "@/features/auth";

export default function VerifyAccount() {
  const { verificationString } = useParams();
  const { mutateAsync: verifyAccountAction } = useVerifyAccount();

  useEffect(() => {
    if (verificationString) {
      verifyAccountAction({ verificationString });
    }
  }, [verificationString, verifyAccountAction]);

  return (
    <div className="flex flex-wrap items-center justify-center px-4 text-center leading-b mt-10">
      <h1 className="text-3xl text-zinc-700">
        Account Successfully Verified. Please Log In 😊
      </h1>
    </div>
  );
}
