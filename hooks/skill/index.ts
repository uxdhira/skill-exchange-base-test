"use client";

import type { Skill } from "@/types";
import { useQuery } from "@tanstack/react-query";

const OWNER_SKILLS_KEY = (ownerId: string) => ["owner-skills", ownerId];

export async function fetchOwnerSkills(ownerId: string) {
  const response = await fetch(`/api/skills/owner/${ownerId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch owner skills");
  }

  const result = await response.json();

  return { data: result.data, meta: result.meta };
}

export function useOwnerSkills(ownerId: string) {
  return useQuery<{ data: Skill[]; meta: any }, Error>({
    queryKey: OWNER_SKILLS_KEY(ownerId),
    queryFn: () => fetchOwnerSkills(ownerId),
    enabled: !!ownerId,
    staleTime: 1000 * 60 * 5,
  });
}

export async function fetchSkillById(id: string) {
  const response = await fetch(`/api/skills/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch skill");
  }

  const result = await response.json();

  if (result.data) {
    const skill = result.data;
    console.log("Fetched skill:", skill);
    return {
      id: skill.id,
      title: skill.title,
      description: skill.description,
      category: skill.category || "",

      skillLevel: skill.skillLevel,
      location: skill.location,
      mode: skill.mode,
      currentStatus: skill.currentStatus,
      createdAt: skill.createdAt,
    };
  }

  return null;
}

export function useSkill(id: string) {
  return useQuery({
    queryKey: ["skill", id],
    queryFn: () => fetchSkillById(id),
    enabled: !!id,
  });
}
