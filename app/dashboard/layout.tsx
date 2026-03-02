import type { Metadata } from "next";
import UserSidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar-dash"; // The component we built
import { MockStateProvider } from "@/hooks/useGlobalState";

export const metadata: Metadata = {
  title: {
    template: "%s | SkillSpill",
    default: "Dashboard | SkillSpill",
  },
  description:
    "Elevate your career with SkillSpill. Access expert-led video courses and hands-on projects in design, coding, and business. Start sharing your expertise or learn new professional skills today. Join our global community of lifelong learners.",
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <MockStateProvider>
        <UserSidebar />

        {/* Content Area */}
        <main className="ml-64 flex-1 bg-gray-50 min-h-screen flex flex-col">
          {/* Sticky Navbar inside the content area */}
          <Navbar />

          {/* Page Content */}
          <div className="p-6">{children}</div>
        </main>
      </MockStateProvider>
    </div>
  );
}
