import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("strapi-jwt")?.value;
}

function buildPopulateQuery() {
  return [
    "populate[fromUser][populate][0]=avatar",
    "populate[toUser][populate][0]=avatar",
    "populate[skill][populate][0]=owner",
    "populate[booking][populate][0]=requester",
    "populate[booking][populate][1]=provider",
  ].join("&");
}

export async function GET() {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const response = await fetch(
      `${STRAPI_URL}/api/reviews?${buildPopulateQuery()}&sort[0]=createdAt:desc`,
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

    return NextResponse.json({
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
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
    const { booking, fromUser, rating, comment, toUser, skill } =
      body?.data || {};

    // console.log("Received review data:", body);

    // ---- Basic validation ----
    if (!booking || !fromUser) {
      return NextResponse.json(
        { error: "booking and fromUser are required" },
        { status: 400 },
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // ---- Fetch booking with skill owners ----
    const bookingRes = await fetch(
      `${STRAPI_URL}/api/bookings/${booking}?populate[requester]=true&populate[provider]=true&populate[requestedSkill][populate]=owner&populate[providedSkill][populate]=owner`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    let bookingJson;
    try {
      bookingJson = await bookingRes.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid response from booking service" },
        { status: 500 },
      );
    }

    if (!bookingRes.ok) {
      return NextResponse.json(bookingJson, { status: bookingRes.status });
    }

    if (!bookingJson?.data) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const bookingData = bookingJson.data;

    // ---- Status check ----
    const status = bookingData?.bookingStatus;
    if (status !== "completed") {
      return NextResponse.json(
        { error: "Can only review completed bookings" },
        { status: 400 },
      );
    }

    // ---- Extract users ----
    // const requesterDocId = bookingData?.requester?.documentId;
    // const providerDocId = bookingData?.provider?.documentId;

    // if (!requesterDocId || !providerDocId) {
    //   return NextResponse.json(
    //     { error: "Invalid booking relations" },
    //     { status: 500 },
    //   );
    // }

    // // ---- Validate reviewer ----
    // if (fromUser !== requesterDocId && fromUser !== providerDocId) {
    //   return NextResponse.json(
    //     { error: "Unauthorized reviewer" },
    //     { status: 403 },
    //   );
    // }

    // ---- Extract skills + owners ----
    // const requestedSkill = bookingData?.requestedSkill;
    // const providedSkill = bookingData?.providedSkill;

    // const requestedSkillDocId = requestedSkill?.documentId;
    // const providedSkillDocId = providedSkill?.documentId;

    // const requestedSkillOwner = requestedSkill?.owner?.documentId;
    // const providedSkillOwner = providedSkill?.owner?.documentId;

    // if (
    //   !requestedSkillDocId ||
    //   !providedSkillDocId ||
    //   !requestedSkillOwner ||
    //   !providedSkillOwner
    // ) {
    //   return NextResponse.json(
    //     { error: "Invalid booking skills" },
    //     { status: 500 },
    //   );
    // }

    // let toUser: string;
    // let skill: string;

    // // ---- CORE FIX: enforce correct ownership ----
    // if (fromUser === providerDocId) {
    //   // Provider reviewing → must review requester's skill
    //   if (requestedSkillOwner !== requesterDocId) {
    //     return NextResponse.json(
    //       { error: "Requested skill does not belong to requester" },
    //       { status: 400 },
    //     );
    //   }

    //   toUser = requesterDocId;
    //   skill = requestedSkillDocId;
    // } else {
    //   // Requester reviewing → must review provider's skill
    //   if (providedSkillOwner !== providerDocId) {
    //     return NextResponse.json(
    //       { error: "Provided skill does not belong to provider" },
    //       { status: 400 },
    //     );
    //   }

    //   toUser = providerDocId;
    //   skill = providedSkillDocId;
    // }

    // ---- Prevent self-review ----
    if (fromUser === toUser) {
      return NextResponse.json(
        { error: "Cannot review yourself" },
        { status: 400 },
      );
    }

    // ---- Check duplicate review ----
    const existingRes = await fetch(
      `${STRAPI_URL}/api/reviews/${bookingData.documentId}?filters[fromUser][documentId][$eq]=${fromUser}&filters[toUser][documentId][$eq]=${toUser}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    const existingJson = await existingRes.json();

    if (existingJson?.data?.length > 0) {
      return NextResponse.json(
        { error: "You have already reviewed this booking" },
        { status: 400 },
      );
    }

    // ---- Create review ----
    const payload = {
      booking,
      fromUser,
      toUser,
      skill,
      rating,
      comment: comment || "",
    };

    // console.log("Creating review with payload:", payload);

    const createRes = await fetch(`${STRAPI_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: payload }),
    });

    let createJson;
    try {
      createJson = await createRes.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid response from review service" },
        { status: 500 },
      );
    }

    if (!createRes.ok) {
      return NextResponse.json(createJson, {
        status: createRes.status,
      });
    }

    return NextResponse.json({ data: createJson.data }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
