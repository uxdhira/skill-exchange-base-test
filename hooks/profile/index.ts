"use client";

import type { AvailabilitySlot, Profile } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PROFILE_KEY = (documentId: string) => ["profile", documentId];

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  availability?: AvailabilitySlot[];
}

async function fetchProfile(documentId: string): Promise<Profile> {
  const response = await fetch(`/api/profile/${documentId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  const result = await response.json();
  return result.data;
}

async function updateProfile({
  documentId,
  data,
}: {
  documentId: string;
  data: UpdateProfilePayload;
}): Promise<Profile> {
  const response = await fetch(`/api/profile/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  const result = await response.json();
  return result.data;
}

export function useCurrentProfile(documentId: string) {
  return useQuery({
    queryKey: PROFILE_KEY(documentId),
    queryFn: () => fetchProfile(documentId),
    enabled: !!documentId,
    staleTime: 1000 * 60,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: PROFILE_KEY(variables.documentId),
      });
      queryClient.invalidateQueries({
        queryKey: ["auth", "user"],
      });
    },
  });
}
