import RenderSkills from "@/components/blocks/RenderSkills";

export default async function BrowseSkills() {
  // const skillsData = await fetchSkills(1, 10);
  // const categoriesData = await fetchCategories();

  // const categories = categoriesData.data || [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <RenderSkills />
    </div>
  );
}
