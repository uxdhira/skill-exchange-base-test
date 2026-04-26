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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileDocumentId: string }> },
) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { profileDocumentId } = await params;

    const reviewsResponse = await fetch(
      `${STRAPI_URL}/api/reviews?filters[toUser][documentId][$eq]=${profileDocumentId}&${buildPopulateQuery()}&sort[0]=createdAt:desc`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    const reviewsResult = await reviewsResponse.json();

    if (!reviewsResponse.ok) {
      return NextResponse.json(reviewsResult, {
        status: reviewsResponse.status,
      });
    }

    const reviews = reviewsResult.data || [];
    const totalReviews = reviews.length;

    let totalRating = 0;

    reviews.forEach((review: any) => {
      totalRating += review.rating || 0;
    });

    const averageRating =
      totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0";

    return NextResponse.json({
      data: {
        totalReviews,
        averageRating: parseFloat(averageRating),
        reviews,
      },
      meta: reviewsResult.meta,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch user reviews" },
      { status: 500 },
    );
  }
}
