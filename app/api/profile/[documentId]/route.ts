import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

const profilePopulateQuery =
  "populate[0]=availability" +
  "&populate[1]=privacy" +
  "&populate[2]=notifications";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const { documentId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("strapi-jwt");

    if (!token?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const response = await fetch(
      `${STRAPI_URL}/api/profiles/${documentId}?populate[0]=avatar&populate[1]=privacy&populate[2]=notifications&populate[3]=availability`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    );

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const { documentId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("strapi-jwt");

    if (!token?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const sanitizedAvailability = Array.isArray(body?.data?.availability)
      ? body.data.availability.map(
          (slot: {
            dayOfWeek?: number;
            startTime?: string;
            endTime?: string;
          }) => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
          }),
        )
      : body?.data?.availability;

    const sanitizedBody = {
      ...body,
      data: {
        ...body?.data,
        availability: sanitizedAvailability,
      },
    };

    const response = await fetch(`${STRAPI_URL}/api/profiles/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(sanitizedBody),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Strapi profile update failed:", result);
    }
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
