"use client";

import type { Booking } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BOOKINGS_KEY = ["bookings"];
const BOOKING_KEY = (documentId: string) => ["booking", documentId];

export interface CreateBookingPayload {
  requestedSkill: string;
  providedSkill: string;
  provider: string;
  requester: string;
  bookingStatus?:
    | "pending"
    | "accepted"
    | "rejected"
    | "completed"
    | "cancelled";
  mode: "online" | "inperson" | "hybrid";
  scheduledAt: string;
  durationMinutes: number;
  location?: string;
  providerMessage?: string;
  requesterMessage?: string;
}

export interface UpdateBookingPayload {
  requestedSkill?: string;
  providedSkill?: string;
  provider?: string;
  requester?: string;
  bookingStatus?:
    | "pending"
    | "accepted"
    | "rejected"
    | "completed"
    | "cancelled";
  mode?: "online" | "inperson" | "hybrid";
  scheduledAt?: string;
  durationMinutes?: number;
  location?: string;
  providerMessage?: string;
  requesterMessage?: string;
}

async function fetchBookings(): Promise<Booking[]> {
  const response = await fetch("/api/bookings");

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  const result = await response.json();
  return result.data || [];
}

async function fetchBooking(documentId: string): Promise<Booking | null> {
  const response = await fetch(`/api/bookings/${documentId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch booking");
  }

  const result = await response.json();
  console.log({ result });
  return result.data || null;
}

async function createBooking(data: CreateBookingPayload): Promise<Booking> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to create booking");
  }

  const result = await response.json();
  return result.data;
}

async function updateBooking({
  documentId,
  data,
}: {
  documentId: string;
  data: UpdateBookingPayload;
}): Promise<Booking> {
  const response = await fetch(`/api/bookings/${documentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to update booking");
  }

  const result = await response.json();
  return result.data;
}

async function deleteBooking(documentId: string): Promise<void> {
  const response = await fetch(`/api/bookings/${documentId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete booking");
  }
}

export function useBookings() {
  return useQuery({
    queryKey: BOOKINGS_KEY,
    queryFn: fetchBookings,
  });
}

export function useBooking(documentId: string) {
  return useQuery({
    queryKey: BOOKING_KEY(documentId),
    queryFn: () => fetchBooking(documentId),
    enabled: !!documentId,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
      if (data.documentId) {
        queryClient.invalidateQueries({
          queryKey: BOOKING_KEY(data.documentId),
        });
      }
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
    },
  });
}
