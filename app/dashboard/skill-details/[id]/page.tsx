
import SkillDetailsView from "@/components/skill-details-view";
import { mockSkills } from "@/data/mockData";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function SkillDetailsPage({ params }: PageProps) {
 const {id} = await params;  
const skill = mockSkills.find((s) => s.id.toString() === id.toString());
  console.log("found skill:", skill);

  if (!skill) {
    return <p className="p-6">Skill not found</p>;
  }

  return (
    <SkillDetailsView
      skill={skill}
      backUrl="/dashboard/browse-skill"
    />
  );
}