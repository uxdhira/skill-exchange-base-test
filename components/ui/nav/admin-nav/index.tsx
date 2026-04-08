import { cn } from "@/lib/utils";
import {
  Briefcase,
  Calendar,
  LayoutDashboard,
  MessageSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "../../sheet";

/**
 * AdminNavBox renders the list of dashboard links.
 * It can work inside the normal sidebar or inside the mobile sheet.
 */
const AdminNavBox = ({ sheetClose = false }: { sheetClose: boolean }) => {
  const pathname = usePathname();

  // These are the main links inside the dashboard area.
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/dashboard/profile", icon: User },
    { name: "My Skills", href: "/dashboard/skills", icon: Briefcase },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { name: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
  ];
  return (
    <nav className="mt-6 space-y-1">
      {sheetClose
        ? navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <SheetClose asChild key={item.name}>
                <Link href={item.href}>
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
              </SheetClose>
            );
          })
        : navItems.map((item) => {
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
  );
};

export default AdminNavBox;
