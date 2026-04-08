"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useGlobalState } from "@/hooks/useGlobalState";
import { LogOut, PlusCircle, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../sheet";

import { Icon } from "@iconify/react";
import {
  Briefcase,
  Calendar,
  LayoutDashboard,
  MessageSquare,
  User,
} from "lucide-react";
import { CgClose } from "react-icons/cg";
import AdminNavBox from "./admin-nav";
import UserProfileBox from "./user-profile";

// `use client` is required because this dashboard navbar uses hooks and click events.

/**
 * Navbar is the top bar used inside the dashboard area.
 * It gives quick actions, logout, and a mobile menu.
 */
export default function Navbar() {
  // `useRouter` is used for redirecting after logout.
  const router = useRouter();
  const { logoutUser, user } = useGlobalState();

  // `useState` keeps the mobile menu open/close state.
  const [isOpen, setIsOpen] = useState(false);

  // `usePathname` reads the current URL path.
  // It is useful when the UI needs to know which page is active.
  const pathname = usePathname();

  // Close the mobile menu when the screen gets larger.
  // `useCallback` keeps the function stable when reused.
  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  // Log the user out and send them back to the home page.
  function handleLogout() {
    logoutUser();
    router.push("/");
  }
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/dashboard/profile", icon: User },
    { name: "My Skills", href: "/dashboard/skills", icon: Briefcase },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { name: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-8">
        {/* Left Side: Navigation */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-gray-500 hover:text-black transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dashboard/browse-skill"
            className="text-gray-500 hover:text-black transition-colors"
          >
            Browse
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          <Button asChild variant="default" size="sm" className="flex gap-2">
            <Link href="/dashboard/submit-skill">
              <PlusCircle className="h-4 w-4" />
              Add Skill
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 hidden md:flex"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger id="mobile-menu-trigger">
              <span className="rounded-full border border-border p-2 flex">
                <Icon
                  icon="solar:hamburger-menu-linear"
                  width={20}
                  height={20}
                />
                <span className="sr-only">Menu</span>
              </span>
            </SheetTrigger>

            <SheetContent
              showCloseButton={false}
              side="right"
              className="w-full   p-0 border-l-0"
            >
              <div className="flex items-center justify-between p-8">
                <div>
                  <Link href="/" className="flex items-center gap-3">
                    {/* Purple Icon */}
                    <Zap size={38} className="text-purple-700" />

                    {/* Deep Blue Text */}
                    <span className="text-2xl font-bold text-blue-950">
                      SkillSpill
                    </span>
                  </Link>
                </div>
                <SheetClose id="mobile-menu-close">
                  <span className="rounded-full mr-4 border border-border p-2.5 block">
                    <CgClose width={20} height={20} />
                  </span>
                </SheetClose>
              </div>

              <div className="flex flex-col gap-12 px-6 pb-6 overflow-y-auto">
                <div className="flex flex-col gap-8">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <NavigationMenu
                    orientation="vertical"
                    className="items-start flex-none"
                  >
                    <NavigationMenuList className="flex flex-col items-start gap-3">
                      <UserProfileBox />
                      <AdminNavBox sheetClose={true} />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>

                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex gap-3">
                    {[
                      "lucide:dribbble",
                      "lucide:instagram",
                      "lucide:twitter",
                      "lucide:linkedin",
                    ].map((icon) => (
                      <a
                        key={icon}
                        href="#"
                        className="flex items-center justify-center rounded-full outline outline-border hover:bg-muted transition p-3 shadow-xs"
                      >
                        <Icon icon={icon} width={16} height={16} />
                      </a>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    © 2026 SkillSpill
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
