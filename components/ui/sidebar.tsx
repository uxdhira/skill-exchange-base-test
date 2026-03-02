"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Star,
  MapPin,
  LayoutDashboard,
  User,
  Briefcase,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGlobalState } from "@/hooks/useGlobalState";

export default function UserSidebar() {
  const pathname = usePathname();
  const { user } = useGlobalState();
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/dashboard/profile", icon: User },
    { name: "My Skills", href: "/dashboard/skills", icon: Briefcase },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { name: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white p-4">
      <Card className="p-4 shadow-sm">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center space-y-2 bg-blue-100 ">
          <Avatar className="w-16 h-16 ">
            <AvatarImage src="/profile.jpg" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>

          {user && (
            <>
              <div>
                <h2 className="font-semibold text-base">{user?.name}</h2>
                <div className="flex items-center justify-center text-sm text-muted-foreground gap-1">
                  <MapPin className="w-3 h-3" />
                  {user?.location}
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{user?.rating}</span>
                <span className="text-muted-foreground">
                  / {user?.reviewCount}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-muted font-medium"
                      : "hover:bg-muted/50 text-muted-foreground",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </Card>
    </aside>
  );
}
