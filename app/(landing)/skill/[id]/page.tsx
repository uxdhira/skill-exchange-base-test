import SkillDetailsView from "@/components/blocks/skill-details/skill-details-view";
import { mockSkills } from "@/data/mockData";
import { Metadata } from "next";

interface PageProps {
  params: {
    id: string;
  };
}
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
export default async function SkillDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const skill = mockSkills.find((s) => s.id.toString() === id.toString());

  if (!skill) {
    return <p className="p-6">Skill not found</p>;
  }

  return <SkillDetailsView skill={skill} backUrl="/dashboard/browse-skill" />;
}
