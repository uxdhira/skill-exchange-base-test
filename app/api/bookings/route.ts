import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import qs from "qs";
import { normalizeBooking } from "./_utils";
const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("strapi-jwt")?.value;
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

function buildPopulateQuery() {
  return [
    "populate[requestedSkill][populate][owner]=*",
    "populate[requestedSkill][populate][category]=*",
    "populate[requestedSkill][populate][image]=*",
    "populate[providedSkill][populate][owner]=*",
    "populate[providedSkill][populate][category]=*",
    "populate[providedSkill][populate][image]=*",
    // "populate[provider][populate][avatar]=*",
    // "populate[requester][populate][avatar]=*",
    // "sort[0]=createdAt:desc",
  ].join("&");
}

export async function GET() {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await getCurrentUserProfile(token);
    const profileDocumentId = user?.profile?.documentId;

    if (!profileDocumentId) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const params = new URLSearchParams();
    const query = qs.stringify(
      {
        populate: {
          requestedSkill: {
            populate: {
              owner: "*",
              category: "*",
              image: "*",
            },
          },
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      },
    );
    // ✅ CORE LOGIC: provider OR requester match
    params.append(
      "filters[$or][0][provider][documentId][$eq]",
      profileDocumentId,
    );
    params.append(
      "filters[$or][1][requester][documentId][$eq]",
      profileDocumentId,
    );

    // Minimal populate (add more only if needed)
    // params.append("populate[provider]", "*");
    // params.append("populate[requester]", "*");
    // params.append("populate[requestedSkill]", "*");
    // params.append("populate[providedSkill]", "*");

    const response = await fetch(
      `${STRAPI_URL}/api/bookings?populate[requestedSkill][populate][0]=owner&populate[requester][populate][0]=avatar&populate[providedSkill][populate][0]=owner&populate[provider][populate][0]=avatar`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }
    const data = {
      data: result?.data ?? [],
      meta: result?.meta ?? {},
    };
    console.log({ bookingsResponse: data.data });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bookings:", error);

    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const payload = {
      ...body?.data,
      bookingStatus: "pending",
    };

    const response = await fetch(
      `${STRAPI_URL}/api/bookings?${buildPopulateQuery()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: payload }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(
      { data: normalizeBooking(result.data) },
      { status: response.status },
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
