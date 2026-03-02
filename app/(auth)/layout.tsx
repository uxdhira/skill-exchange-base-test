import Footer from "@/components/blocks/footer/footer";
import { MockStateProvider } from "@/hooks/useGlobalState";
import { Zap } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: {
    template: "%s | SkillSpill",
    default: "Authenticate | SkillSpill",
  },
  description:
    "Elevate your career with SkillSpill. Access expert-led video courses and hands-on projects in design, coding, and business. Start sharing your expertise or learn new professional skills today. Join our global community of lifelong learners.",
};
// (landing)/layout.tsx
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex justify-center mb-4 py-4">
        <Link href={"/#"}>
          <div className="flex items-center gap-3 text-blue-950 font-bold text-3xl">
            {/* Purple Icon */}
            <Zap size={40} className="text-purple-700" />

            {/* SkillSpill Text */}
            <span>SkillSpill</span>
          </div>
        </Link>
      </div>
      <MockStateProvider>{children}</MockStateProvider>
      <Footer />
    </>
  );
}
