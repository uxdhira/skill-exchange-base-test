import type { Metadata } from "next";

import Navbar from "@/components/ui/nav/navbar-dash";
import UserSidebar from "@/components/ui/nav/sidebar";
import { MockStateProvider } from "@/hooks/useGlobalState";

// `Metadata` is a Next.js type.
// We use it here to define the default title and description for the dashboard area.
// Metadata for all dashboard pages.
export const metadata: Metadata = {
  title: {
    template: "%s | SkillSpill",
    default: "Dashboard | SkillSpill",
  },
  description:
    "Elevate your career with SkillSpill. Access expert-led video courses and hands-on projects in design, coding, and business. Start sharing your expertise or learn new professional skills today. Join our global community of lifelong learners.",
};

/**
 * DashboardLayout wraps every dashboard page.
 * It gives users a sidebar, top navbar, shared state, and page spacing.
 * In Next.js App Router, a layout lets many pages share the same structure.
 *
 * `children` is the actual dashboard page that gets rendered inside this shared wrapper.
 */
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
        <main className="ml-0 md:ml-64 w-full flex-1 bg-gray-50 min-h-screen flex flex-col">
          {/* Sticky Navbar inside the content area */}
          <Navbar />

          {/* Page Content */}
          <div className="p-6">{children}</div>
        </main>
      </MockStateProvider>
    </div>
  );
}
