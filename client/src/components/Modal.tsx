import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { Button } from "./ui/button";

type Side = "top" | "bottom" | "left" | "right";

type PropsType = {
  children: React.ReactNode;
  side: Side;
};

export default function Modal({ side, children }: PropsType) {
  return (
    <ResponsiveModal>
      <ResponsiveModalTrigger asChild>
        <Button variant={"linkHover2"}>Forgot Password</Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent side={side}>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Enter your email</ResponsiveModalTitle>
          <ResponsiveModalDescription></ResponsiveModalDescription>
        </ResponsiveModalHeader>
        {children}
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
