// app/api/auth/user/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL!;
async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("strapi-jwt")?.value;
}
export async function GET() {
  try {
    const token = await getToken();

    // Not logged in → explicit 401
    if (!token) {
      return NextResponse.json(null, { status: 401 });
    }

    const response = await fetch(
      `${STRAPI_URL}/api/users/me?populate[profile]=*`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 401) {
      return NextResponse.json(null, { status: 401 });
    }

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const user = await response.json();

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
