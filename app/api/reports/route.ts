import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("strapi-jwt")?.value;
}

function buildPopulateQuery() {
  return [
    "populate[reporter][populate][0]=avatar",
    "populate[reportedUser][populate][0]=avatar",
    "populate[booking][populate][0]=requester",
    "populate[booking][populate][1]=provider",
  ].join("&");
}
function buildBookingPopulateQuery() {
  return [
    "populate[requestedSkill][populate][0]=owner",
    // "populate[requester][populate][0]=avatar",
    // "populate[requester][populate][0]=category",
    "populate[providedSkill][populate][0]=owner",
    // "populate[provider][populate][0]=avatar",
    // "populate[provider][populate][0]=category",
  ].join("&");
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("booking");

    if (!bookingId) {
      return NextResponse.json(
        { error: "booking query parameter is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${STRAPI_URL}/api/reports?filters[booking][documentId][$eq]=${bookingId}&${buildPopulateQuery()}&sort[0]=createdAt:desc`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json({
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
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
    const { booking, reporter, reportedUser, reason, cause } = body?.data || {};
    if (!booking) {
      return NextResponse.json(
        { error: "Booking is required" },
        { status: 400 },
      );
    }

    if (!reporter) {
      return NextResponse.json(
        { error: "Reporter is required" },
        { status: 400 },
      );
    }

    if (!reportedUser) {
      return NextResponse.json(
        { error: "Reported user is required" },
        { status: 400 },
      );
    }

    if (!reason) {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 },
      );
    }

    const validReasons = [
      "Harassment or inappropriate behavior",
      "No-show or unreliability",
      "Inappropriate content",
      "Suspicious activity or scam",
      "Other",
    ];

    if (!validReasons.includes(reason)) {
      return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
    }

    const bookingResponse = await fetch(
      `${STRAPI_URL}/api/bookings/${booking}?populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const bookingResult = await bookingResponse.json();
    // console.log({ here: bookingResult });

    if (!bookingResponse.ok) {
      return NextResponse.json(bookingResult, {
        status: bookingResponse.status,
      });
    }

    if (!bookingResult?.data) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingResult.data;
    const requesterDocId = bookingData?.requester?.documentId;
    const providerDocId = bookingData?.provider?.documentId;

    if (reporter !== requesterDocId && reporter !== providerDocId) {
      return NextResponse.json(
        {
          error:
            "Reporter must be either the requester or provider of the booking",
        },
        { status: 403 },
      );
    }

    if (reportedUser !== requesterDocId && reportedUser !== providerDocId) {
      return NextResponse.json(
        {
          error:
            "Reported user must be either the requester or provider of the booking",
        },
        { status: 403 },
      );
    }

    if (reporter === reportedUser) {
      return NextResponse.json(
        { error: "Cannot report yourself" },
        { status: 400 },
      );
    }

    const payload = {
      booking,
      reporter,
      reportedUser,
      reason,
      cause: cause || "",
      reportStatus: "pending",
    };
    console.log({ payload });
    const createResponse = await fetch(`${STRAPI_URL}/api/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: payload }),
    });

    const createResult = await createResponse.json();

    if (!createResponse.ok) {
      return NextResponse.json(createResult, { status: createResponse.status });
    }

    return NextResponse.json({ data: createResult.data }, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 },
    );
  }
}
