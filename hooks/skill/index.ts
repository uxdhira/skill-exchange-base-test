"use client";

import type { Skill } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const OWNER_SKILLS_KEY = (ownerId: string) => ["owner-skills", ownerId];
const SKILLS_KEY = (page: number, pageSize: number) => ["skills", page, pageSize];

export async function fetchSkills(page = 1, pageSize = 100) {
  const response = await fetch(`/api/skills?page=${page}&pageSize=${pageSize}`);

  if (!response.ok) {
    throw new Error("Failed to fetch skills");
  }

  const result = await response.json();

  return { data: result.data, meta: result.meta };
}

export function useSkills(page = 1, pageSize = 100) {
  return useQuery<{ data: Skill[]; meta: unknown }, Error>({
    queryKey: SKILLS_KEY(page, pageSize),
    queryFn: () => fetchSkills(page, pageSize),
    staleTime: 1000 * 60 * 5,
  });
}

export async function fetchOwnerSkills(ownerId: string) {
  const response = await fetch(`/api/skills/owner/${ownerId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch owner skills");
  }

  const result = await response.json();

  return { data: result.data, meta: result.meta };
}

export function useOwnerSkills(ownerId: string) {
  return useQuery<{ data: Skill[]; meta: unknown }, Error>({
    queryKey: OWNER_SKILLS_KEY(ownerId),
    queryFn: () => fetchOwnerSkills(ownerId),
    enabled: !!ownerId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
    }: {
      formData: FormData;
      ownerId: string;
    }) => {
      const response = await fetch("/api/skills", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create skill");
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: OWNER_SKILLS_KEY(variables.ownerId),
      });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
      ownerId: string;
    }) => {
      const response = await fetch(`/api/skills/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update skill");
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: OWNER_SKILLS_KEY(variables.ownerId),
      });
      queryClient.invalidateQueries({ queryKey: ["skill", variables.id] });
    },
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
    return skill;
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
