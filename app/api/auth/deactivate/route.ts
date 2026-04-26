import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Ensure this matches your Strapi base URL (e.g., http://localhost:1337)
const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PUT() {
  try {
    // 1. Retrieve the JWT from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("strapi-jwt")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token found" },
        { status: 401 },
      );
    }

    // 2. Call the custom Strapi deactivation endpoint
    // We use /api/user/deactivate based on your Strapi route configuration
    const response = await fetch(`${STRAPI_URL}/api/user/deactivate`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // Note: No body needed since the backend identifies the user via the JWT
    });

    // 3. Handle non-JSON responses (Prevents the "Unexpected token M" crash)
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.error?.message || "Failed to deactivate" },
          { status: response.status },
        );
      }

      return NextResponse.json({ success: true });
    } else {
      // If Strapi sends "Method Not Allowed" or a 404 text page
      const textError = await response.text();
      console.error("Strapi Backend Error:", textError);

      return NextResponse.json(
        { error: `Backend Error: ${textError}` },
        { status: response.status },
      );
    }
  } catch (error: any) {
    console.error("Next.js API Route Error:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
