"use client";

import { Card } from "@/components/ui/card";

import { Separator } from "../separator";
import AdminNavBox from "./admin-nav";
import UserProfileBox from "./user-profile";

/**
 * UserSidebar is the fixed left sidebar shown on dashboard pages on larger screens.
 */
export default function UserSidebar() {
  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 border-r bg-white p-4">
      <Card className="p-4 shadow-sm">
        {/* Profile Section */}
        <UserProfileBox />
        {/* <div className="flex flex-col items-center text-center space-y-2   ">
          <Avatar className="w-22 h-22 ">
            <AvatarImage src="/profile.jpg" className="object-cover" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          {user ? (
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
          ) : (
            <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
          )}
        </div> */}
        <Separator />
        <AdminNavBox sheetClose={false} />
        {/* Navigation */}
      </Card>
    </aside>
  );
}
