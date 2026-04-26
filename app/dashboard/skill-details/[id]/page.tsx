import SkillDetailsView from "@/components/blocks/skill-details/skill-details-view";
import { fetchFromStrapi, StrapiResponse } from "@/lib/backend/strapi";
import { Skill } from "@/types";
import { Metadata } from "next";

// The route receives the skill id from the URL.
// `[id]` is a Next.js dynamic route segment.
// We use it so one page can show many different skills based on the URL.
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getSkillByDocumentId(id: string) {
  try {
    const response = await fetchFromStrapi<
      StrapiResponse<Skill & Record<string, unknown>>
    >(
      `/api/skills/${id}?populate[image]=*&populate[owner]=*&populate[category]=*`,
    );

    return response.data;
  } catch {
    return null;
  }
}

// Build page metadata from the selected skill.
// `generateMetadata` is a Next.js feature for dynamic SEO/page title values.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const skill = await getSkillByDocumentId(id);

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
  const skill = await getSkillByDocumentId(id);

  if (!skill) {
    return <p className="p-6">Skill not found</p>;
  }

  return (
    <SkillDetailsView
      skill={skill}
      backUrl="/dashboard/myskills"
      isOwner={false}
    />
  );
}
