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
  { params }: { params: { documentId: string } },
) {
  try {
    const { documentId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("strapi-jwt");

    if (!token?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";

    let data: any = {};
    let avatarFile: File | null = null;

    // ✅ Handle multipart safely
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const rawData = formData.get("data");

      if (typeof rawData === "string") {
        try {
          data = JSON.parse(rawData);
        } catch (err) {
          console.error("Invalid JSON:", rawData);
          return NextResponse.json(
            { error: "Invalid data format" },
            { status: 400 },
          );
        }
      }

      avatarFile = formData.get("files.avatar") as File | null;

      // 🔍 Debug if needed
      // console.log([...formData.entries()]);
    } else {
      // fallback JSON
      const body = await request.json();
      data = body?.data || {};
    }

    // ✅ sanitize availability
    if (Array.isArray(data?.availability)) {
      data.availability = data.availability.map((slot: any) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));
    }

    // ✅ Step 1: Upload avatar if exists
    let uploadedFileId: number | null = null;

    if (avatarFile) {
      const uploadForm = new FormData();
      uploadForm.append("files", avatarFile);

      const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: uploadForm,
      });

      const uploaded = await uploadRes.json();

      if (!uploadRes.ok) {
        console.error("Upload failed:", uploaded);
        return NextResponse.json(uploaded, { status: uploadRes.status });
      }

      uploadedFileId = Array.isArray(uploaded)
        ? uploaded[0]?.id
        : uploaded?.[0]?.id;
    }

    // ✅ Step 2: Attach avatar
    if (uploadedFileId) {
      data.avatar = uploadedFileId;
    }

    // ✅ Step 3: Update profile
    const response = await fetch(`${STRAPI_URL}/api/profiles/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({ data }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Profile update failed:", result);
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
