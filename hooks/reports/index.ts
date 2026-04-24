"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const REPORTS_BY_BOOKING_KEY = (bookingDocumentId: string) => [
  "reports",
  "booking",
  bookingDocumentId,
];

export interface CreateReportPayload {
  booking: string;
  reporter: string;
  reportedUser: string;
  reason: string;
  cause?: string;
}

interface Report {
  id: string;
  documentId?: string;
  cause: string;
  reason: string;
  reportStatus: string;
  createdAt: string;
  reporter?: {
    documentId?: string;
    firstName?: string;
    lastName?: string;
    avatar?: { url?: string } | string | null;
  };
  reportedUser?: {
    documentId?: string;
    firstName?: string;
    lastName?: string;
    avatar?: { url?: string } | string | null;
  };
  booking?: {
    documentId?: string;
    requester?: { firstName?: string; lastName?: string };
    provider?: { firstName?: string; lastName?: string };
  };
}

async function fetchReportsByBooking(bookingDocumentId: string): Promise<Report[]> {
  const response = await fetch(`/api/reports?booking=${bookingDocumentId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }

  const result = await response.json();
  return result.data || [];
}

async function createReport(data: CreateReportPayload): Promise<Report> {
  const response = await fetch("/api/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "Failed to create report");
  }

  const result = await response.json();
  return result.data;
}

export function useReportsByBooking(bookingDocumentId: string) {
  return useQuery({
    queryKey: REPORTS_BY_BOOKING_KEY(bookingDocumentId),
    queryFn: () => fetchReportsByBooking(bookingDocumentId),
    enabled: !!bookingDocumentId,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      if (data?.booking) {
        queryClient.invalidateQueries({
          queryKey: REPORTS_BY_BOOKING_KEY(data.booking as unknown as string),
        });
      }
    },
  });
}