"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import AuthButtons from "./AuthButtons";

export type NavigationSection = {
  title: string;
  href: string;
};

type HeaderProps = {
  navigationData: NavigationSection[];
  className?: string;
};

export default function Header({ navigationData, className }: HeaderProps) {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const navItems = useMemo(() => {
    return navigationData.map((item) => ({
      ...item,
      isActive: pathname === item.href,
    }));
  }, [navigationData, pathname]);

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={cn(
        "inset-x-0 z-50 px-4 flex items-center justify-center sticky top-0 h-20",
        className,
      )}
    >
      <div
        className={cn(
          "w-full max-w-6xl flex items-center justify-between gap-3.5 lg:gap-6 transition-all duration-500",
          sticky
            ? "p-2.5 bg-background/60 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full"
            : "bg-transparent border-transparent",
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Zap size={38} className="text-purple-700" />
          <span className="text-2xl font-bold text-blue-950">SkillSpill</span>
        </Link>

        {/* DESKTOP NAV */}
        <NavigationMenu className="max-lg:hidden bg-muted p-0.5 rounded-full">
          <NavigationMenuList className="flex gap-0 relative">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.title} className="relative">
                {item.isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative z-10 px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground transition",
                      item.isActive && "text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* RIGHT SIDE */}
        <div className="flex gap-4">
          <div className="hidden lg:block space-x-2">
            <AuthButtons />
          </div>

          {/* MOBILE */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger>
                <span className="rounded-full border border-border p-2 block">
                  <Icon icon="solar:hamburger-menu-linear" width={20} />
                </span>
              </SheetTrigger>

              <SheetContent side="right" className="w-full sm:w-96 p-0">
                <div className="flex items-center justify-between p-6">
                  <Link href="/" className="flex items-center gap-3">
                    <Zap size={38} className="text-purple-700" />
                    <span className="text-2xl font-bold text-blue-950">
                      SkillSpill
                    </span>
                  </Link>

                  {/* <SheetClose>
                    <span className="rounded-full border border-border p-2.5 block">
                      <Icon icon="lucide:x" width={16} />
                    </span>
                  </SheetClose> */}
                </div>

                <div className="flex flex-col gap-8 px-6">
                  <SheetTitle className="sr-only">Menu</SheetTitle>

                  <NavigationMenu orientation="vertical">
                    <NavigationMenuList className="flex flex-col gap-3">
                      {navItems.map((item) => (
                        <NavigationMenuItem
                          key={item.title}
                          className="relative"
                        >
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center text-2xl font-semibold transition-all",
                                item.isActive
                                  ? "text-primary"
                                  : "text-muted-foreground hover:text-foreground hover:translate-x-2",
                              )}
                            >
                              {item.isActive && (
                                <motion.div
                                  layoutId="activeNavPill"
                                  className="h-0.5 w-4 bg-primary mr-2"
                                />
                              )}
                              {item.title}
                            </Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>

                  <AuthButtons />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
