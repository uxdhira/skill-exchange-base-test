import Features from "@/components/blocks/feature/howwork";
import AgencyHeroSection from "@/components/blocks/hero";
import Skills from "@/components/blocks/category/explorecategory";

/**
 * This is the public home page.
 * It shows the hero section, how-it-works section, and skill categories.
 */
export default function Home() {
  return (
    <>
      <AgencyHeroSection /> <Features />
      <Skills />
    </>
  );
}
