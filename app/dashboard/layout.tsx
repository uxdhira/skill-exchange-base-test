import type { Metadata } from "next";
import UserSidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar-dash"; // The component we built

export const metadata: Metadata = {
  title: "Dashboard | SkillFlow",
  description: "Manage your skills",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <UserSidebar />

      {/* Content Area */}
      <main className="ml-64 flex-1 bg-gray-50 min-h-screen flex flex-col">
        {/* Sticky Navbar inside the content area */}
        <Navbar />
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}