"use client";

import type { Review } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const REVIEWS_KEY = ["reviews"];
const REVIEWS_BY_SKILL_KEY = (skillDocumentId: string) => [
  "reviews",
  "skill",
  skillDocumentId,
];
const REVIEWS_BY_BOOKING_KEY = (bookingDocumentId: string) => [
  "reviews",
  "booking",
  bookingDocumentId,
];
const USER_REVIEWS_KEY = (profileDocumentId: string) => [
  "reviews",
  "user",
  profileDocumentId,
];

export interface CreateReviewPayload {
  booking: string;
  fromUser: string;
  toUser: string;
  skill: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

interface UserReviewsStats {
  totalReviews: number;
  averageRating: number;
  reviews: Review[];
}

async function fetchReviews(): Promise<Review[]> {
  const response = await fetch("/api/reviews");

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const result = await response.json();
  return result.data || [];
}

async function fetchReview(documentId: string): Promise<Review | null> {
  const response = await fetch(`/api/reviews/${documentId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch review");
  }

  const result = await response.json();
  return result.data || null;
}

async function fetchReviewsBySkill(skillDocumentId: string): Promise<Review[]> {
  const response = await fetch(`/api/reviews/skill/${skillDocumentId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch reviews for skill");
  }

  const result = await response.json();
  return result.data || [];
}

async function fetchReviewsByBooking(
  bookingDocumentId: string,
): Promise<Review[]> {
  const response = await fetch(`/api/reviews/booking/${bookingDocumentId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch reviews for booking");
  }

  const result = await response.json();
  return result.data || [];
}

async function fetchUserReviewsStats(
  profileDocumentId: string,
): Promise<UserReviewsStats> {
  const response = await fetch(`/api/reviews/user/${profileDocumentId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user reviews");
  }

  const result = await response.json();
  return result.data || { totalReviews: 0, averageRating: 0, reviews: [] };
}

async function createReview(data: CreateReviewPayload): Promise<Review> {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  console.log({ review: data });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "Failed to create review");
  }

  const result = await response.json();
  console.log({ result });
  return result.data;
}

async function updateReview({
  documentId,
  data,
}: {
  documentId: string;
  data: UpdateReviewPayload;
}): Promise<Review> {
  const response = await fetch(`/api/reviews/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to update review");
  }

  const result = await response.json();
  return result.data;
}

async function deleteReview(documentId: string): Promise<void> {
  const response = await fetch(`/api/reviews/${documentId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete review");
  }
}

export function useReviews() {
  return useQuery({
    queryKey: REVIEWS_KEY,
    queryFn: fetchReviews,
  });
}

export function useReview(documentId: string) {
  return useQuery({
    queryKey: ["review", documentId],
    queryFn: () => fetchReview(documentId),
    enabled: !!documentId,
  });
}

export function useReviewsBySkill(skillDocumentId: string) {
  return useQuery({
    queryKey: REVIEWS_BY_SKILL_KEY(skillDocumentId),
    queryFn: () => fetchReviewsBySkill(skillDocumentId),
    enabled: !!skillDocumentId,
  });
}

export function useReviewsByBooking(bookingDocumentId: string) {
  return useQuery({
    queryKey: REVIEWS_BY_BOOKING_KEY(bookingDocumentId),
    queryFn: () => fetchReviewsByBooking(bookingDocumentId),
    enabled: !!bookingDocumentId,
  });
}

export function useUserReviewsStats(profileDocumentId: string) {
  return useQuery({
    queryKey: USER_REVIEWS_KEY(profileDocumentId),
    queryFn: () => fetchUserReviewsStats(profileDocumentId),
    enabled: !!profileDocumentId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_KEY });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_KEY });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_KEY });
    },
  });
}
