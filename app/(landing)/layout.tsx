import Footer from "@/components/blocks/footer/footer";
import Header, { NavigationSection } from "@/components/ui/nav/header";
import { MockStateProvider } from "@/hooks/useGlobalState";

// This typed array is an example of props-ready data passed into a component.
// These links are shown in the public landing page header.
const navigationData: NavigationSection[] = [
  {
    title: "Home",
    href: "/",
    isActive: true,
  },
  {
    title: "Browse Skills",
    href: "/browse",
  },
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "FAQ",
    href: "/faq",
  },
  {
    title: "Policies",
    href: "/policies",
  },
];

/**
 * This layout wraps the public landing pages.
 * It adds shared state, the public header, and the footer.
 * This is a Next.js nested layout, which is useful when multiple pages
 * should share the same UI without repeating code.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MockStateProvider>
        <Header navigationData={navigationData} />
        {children}
      </MockStateProvider>
      <Footer />
    </>
  );
}
