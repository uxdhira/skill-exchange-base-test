// app/dashboard/myskills/[id]/page.tsx
import { notFound } from "next/navigation"; // for 404 handling
import SkillDetailsView from "@/components/skill-details-view";
import { mockSkills } from "@/data/mockData";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function SkillDetailsPage({ params }: PageProps) {
  // Find skill by id
const { id } = await params;


  
  const skill = mockSkills.find((s) => s.id.toString() === id);
  //  // If skill not found, show 404 page
  if (!skill) {
    notFound(); // triggers Next.js 404 page
  }

  return (   

     <SkillDetailsView
      skill={skill}
      backUrl="/dashboard/myskills" // back button URL
    />
  );
}