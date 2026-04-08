import SkillDetailsView from "@/components/blocks/skill-details/skill-details-view";
import { mockSkills } from "@/data/mockData";
import { Metadata } from "next";

// The route receives the skill id from the URL.
// `[id]` is a Next.js dynamic route segment.
// We use it so one page can show many different skills based on the URL.
interface PageProps {
  params: {
    id: string;
  };
}

// Build page metadata from the selected skill.
// `generateMetadata` is a Next.js feature for dynamic SEO/page title values.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const skill = mockSkills.find((s) => s.id.toString() === id.toString());

  if (!skill) {
    return {
      title: "Skill Not Found",
      description: "The requested skill does not exist.",
    };
  }

  return {
    title: `${skill.title} - SkillSpill`,
    description: skill.description,
  };
}

// Find the skill by id and render its full details page.
// `params.id` comes from the dynamic route in the URL.
export default async function SkillDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const skill = mockSkills.find((s) => s.id.toString() === id.toString());

  if (!skill) {
    return <p className="p-6">Skill not found</p>;
  }

  return <SkillDetailsView skill={skill} backUrl="/dashboard/browse-skill" />;
}
