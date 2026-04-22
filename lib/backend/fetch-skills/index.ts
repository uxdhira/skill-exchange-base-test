import { fetchFromStrapi } from "@/lib/backend/strapi";
import type { Skill, SkillsResponse } from "../../../app/api/skills/route";

export async function fetchSkills(
  page = 1,
  pageSize = 10,
): Promise<SkillsResponse> {
  try {
    const response = await fetchFromStrapi<SkillsResponse>(
      `/api/skills?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

export async function fetchSkillById(id: number): Promise<Skill> {
  const response = await fetchFromStrapi<{ data: Skill }>(
    `/api/skills/${id}?populate=*`,
  );
  return response.data;
}
