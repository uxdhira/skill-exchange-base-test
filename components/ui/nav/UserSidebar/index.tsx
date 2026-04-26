"use client";

import { Card } from "@/components/ui/card";

import { Separator } from "../../separator";
import AdminNavBox from "./AdminNav";
import UserProfileBox from "./UserProfileBox";

/**
 * UserSidebar is the fixed left sidebar shown on dashboard pages on larger screens.
 */
export default function UserSidebar() {
  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 border-r bg-white p-4">
      <Card className="p-4 shadow-sm">
        <UserProfileBox />

        <Separator />
        <AdminNavBox sheetClose={false} />
      </Card>
    </aside>
  );
}
