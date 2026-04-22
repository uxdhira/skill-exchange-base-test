import Skills from "@/components/blocks/category/explorecategory";
import Features from "@/components/blocks/feature/howwork";
import AgencyHeroSection from "@/components/blocks/hero";
import { fetchCategories } from "@/lib/backend/fetch-categories";
import { fetchSkills } from "@/lib/backend/fetch-skills";

/**
 * This is the public home page.
 * It shows the hero section, how-it-works section, and skill categories.
 */
export default async function Home() {
  const skillsData = await fetchSkills(1, 10);
  const categoriesData = await fetchCategories();

  const categories = categoriesData.data || [];

  return (
    <>
      <AgencyHeroSection /> <Features />
      <Skills skillsData={skillsData.data} categories={categories} />
    </>
  );
}
