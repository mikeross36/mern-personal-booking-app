import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { ERoutes } from "@/@types/links";
import { Button } from "./ui/button";
import { SquareMenu } from "lucide-react";
import { useAppContext } from "@/hooks";
import { useLogoutUser } from "@/features/auth";

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const appContext = useAppContext();
  const userInfo = appContext?.state.authUser;
  const { mutateAsync: logoutUserAction } = useLogoutUser();

  function handleLogoutUser() {
    logoutUserAction();
  }

  return (
    <header className="bg-slate-400">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="flex justify-between items-center container h-36 pb-8 px-4 w-screen">
          <NavigationMenuItem>
            <span className="text-xl md:text-2xl text-white font-bold tracking-tight">
              <Link
                to={ERoutes.home}
                className="flex items-center gap-2 text-xl lg:text-2xl"
              >
                <Sun
                  color="#ffffff"
                  strokeWidth={5}
                  absoluteStrokeWidth
                  size={54}
                />
                BookingHoliday
              </Link>
            </span>
          </NavigationMenuItem>
          {/* desktop menu */}
          <NavigationMenuItem className="w-full hidden md:flex justify-end">
            <ul className="md:flex gap-2">
              {userInfo ? (
                <>
                  <li className="flex items-center text-base lg:text-xl text-white px-3 font-bold hover:text-zinc-300 active:text-zinc-300 capitalize">
                    <NavigationMenuLink asChild>
                      <Link to={ERoutes.mybookings}>my bookings</Link>
                    </NavigationMenuLink>
                  </li>
                  <li className="flex items-center text-base lg:text-xl text-white px-3 font-bold hover:text-zinc-300 active:text-zinc-300 capitalize">
                    <NavigationMenuLink asChild>
                      <Link to={ERoutes.myhotels}>my hotels</Link>
                    </NavigationMenuLink>
                  </li>
                  <li className="flex items-center text-base lg:text-xl text-white px-3 font-bold hover:text-zinc-300 active:text-zinc-300 capitalize">
                    <NavigationMenuLink asChild>
                      <Link to={ERoutes.useraccount}>my account</Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <Button
                      onClick={handleLogoutUser}
                      variant={"secondary"}
                      className="capitalize"
                    >
                      Logout
                    </Button>
                  </li>
                </>
              ) : (
                <li className="flex items-center text-base lg:text-xl text-white px-3 font-bold hover:text-zinc-300 active:text-zinc-300 capitalize">
                  <NavigationMenuLink asChild>
                    <Link to={ERoutes.login}>login</Link>
                  </NavigationMenuLink>
                </li>
              )}
            </ul>
          </NavigationMenuItem>
          {/* mobile menu */}
          <div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <SquareMenu
                  size={48}
                  color="#ffffff"
                  strokeWidth={2}
                  className="flex md:hidden cursor-pointer"
                />
              </SheetTrigger>
              <SheetContent
                onClick={() => setIsOpen(false)}
                side={"left"}
                className="bg-slate-400 md:hidden"
              >
                <SheetHeader className="mt-8">
                  <SheetTitle className="text-white text-2xl text-left">
                    <Link
                      to={ERoutes.home}
                      className="flex items-center gap-2 text-2xl"
                    >
                      BookingHoliday.com
                    </Link>
                  </SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <ul className="grid gap-8 py-4 mt-4">
                  {userInfo ? (
                    <>
                      <li className="flex items-center text-base lg:text-xl text-white px-3 font-bold hover:text-zinc-300 active:text-zinc-300 capitalize">
                        <NavigationMenuLink asChild>
                          <Link to={ERoutes.mybookings}>my bookings</Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="flex items-center text-base lg:text-xl text-white px-3 font-bold hover:text-zinc-300 active:text-zinc-300 capitalize">
                        <NavigationMenuLink asChild>
                          <Link to={ERoutes.myhotels}>my hotels</Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="flex items-center text-base lg:text-xl text-white px-3 font-bold hover:text-zinc-300 active:text-zinc-300 capitalize">
                        <NavigationMenuLink asChild>
                          <Link to={ERoutes.useraccount}>my account</Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <Button
                          onClick={handleLogoutUser}
                          variant={"secondary"}
                          className="capitalize"
                        >
                          Logout
                        </Button>
                      </li>
                    </>
                  ) : (
                    <li className="flex items-center text-base lg:text-xl text-white px-3 font-bold hover:text-zinc-300 active:text-zinc-300 capitalize">
                      <NavigationMenuLink asChild>
                        <Link to={ERoutes.login}>login</Link>
                      </NavigationMenuLink>
                    </li>
                  )}
                </ul>
              </SheetContent>
            </Sheet>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
