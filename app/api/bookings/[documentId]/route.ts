import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { normalizeBooking } from "../_utils";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("strapi-jwt")?.value;
}

function buildPopulateQuery() {
  return [
    "populate[requestedSkill][populate][0]=owner",
    "populate[requester][populate][0]=avatar",
    // "populate[requester][populate][0]=category",
    "populate[providedSkill][populate][0]=owner",
    "populate[provider][populate][0]=avatar",
    // "populate[provider][populate][0]=category",
  ].join("&");
}

async function getCurrentUserProfile(token: string) {
  const response = await fetch(
    `${STRAPI_URL}/api/users/me?populate[profile]=*`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
}

async function getBooking(documentId: string, token: string) {
  const response = await fetch(
    `${STRAPI_URL}/api/bookings/${documentId}?${buildPopulateQuery()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result = await response.json();
  return { response, result };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { documentId } = await params;
    const { response, result } = await getBooking(documentId, token);
    console.log("Booking fetch response:", response, result);
    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { documentId } = await params;
    const body = await request.json();
    const currentUser = await getCurrentUserProfile(token);
    const profileDocumentId = currentUser?.profile?.documentId;

    const currentBooking = await getBooking(documentId, token);

    if (!currentBooking.response.ok) {
      return NextResponse.json(currentBooking.result, {
        status: currentBooking.response.status,
      });
    }

    if (
      body?.data?.bookingStatus &&
      profileDocumentId &&
      currentBooking.result?.data?.provider?.documentId !== profileDocumentId
    ) {
      return NextResponse.json(
        { error: "Only the provider can change booking status" },
        { status: 403 },
      );
    }

    const response = await fetch(
      `${STRAPI_URL}/api/bookings/${documentId}?${buildPopulateQuery()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json({ data: normalizeBooking(result.data) });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { documentId } = await params;

    const response = await fetch(`${STRAPI_URL}/api/bookings/${documentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 },
    );
  }
}
