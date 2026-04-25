import { deleteToStrapi, fetchFromStrapi } from "@/lib/backend/strapi";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Skill {
  id: number;
  attributes: {
    title: string;
    description: string;
    category: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SkillsResponse {
  data: Skill[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const page = searchParams.get("page") || "1";
//     const pageSize = searchParams.get("pageSize") || "10";

//     const response = await fetchFromStrapi<SkillsResponse>(
//       `/api/skills?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
//     );

//     return NextResponse.json(response);
//   } catch (error) {
//     console.error("Error fetching skills:", error);
//     return NextResponse.json(
//       {
//         data: [],
//         meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } },
//       },
//       { status: 200 },
//     );
//   }
// }
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "9";

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";

    let filters = "";

    // Search (title OR description)
    if (search) {
      filters += `&filters[$or][0][title][$containsi]=${search}`;
      filters += `&filters[$or][1][description][$containsi]=${search}`;
    }

    // Category (by slug)
    if (category && category !== "all") {
      filters += `&filters[category][slug][$eq]=${category}`;
    }

    // Location
    if (location) {
      filters += `&filters[location][$containsi]=${location}`;
    }
    const sort = searchParams.get("sort") || "createdAt:desc";

    const response = await fetchFromStrapi(
      `/api/skills?pagination[page]=${page}&pagination[pageSize]=${pageSize}${filters}&sort=${sort}&populate=*`,
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      {
        data: [],
        meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } },
      },
      { status: 200 },
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("strapi-jwt");
    const incomingFormData = await request.formData();

    const rawData = incomingFormData.get("data");
    if (typeof rawData !== "string") {
      return NextResponse.json(
        { error: 'Missing required "data" field in multipart body' },
        { status: 400 },
      );
    }

    const parsedData = JSON.parse(rawData) as Record<string, unknown>;
    const payload = {
      ...parsedData,
      // Strapi stores this enum as `inperson`, while the UI uses `in_person`.
      mode: parsedData.mode === "in_person" ? "inperson" : parsedData.mode,
    };

    const file = incomingFormData.get("files.image");
    const createResponse = await fetch(`${STRAPI_URL}/api/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
      body: JSON.stringify({ data: payload }),
    });

    const createdSkill = await createResponse.json();

    if (!createResponse.ok) {
      return NextResponse.json(createdSkill, { status: createResponse.status });
    }

    if (!(file instanceof File)) {
      return NextResponse.json(createdSkill, { status: createResponse.status });
    }

    const uploadFormData = new FormData();
    uploadFormData.append("files", file);

    const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
      body: uploadFormData,
    });

    const uploadedFiles = await uploadResponse.json();

    if (!uploadResponse.ok) {
      return NextResponse.json(uploadedFiles, {
        status: uploadResponse.status,
      });
    }

    const uploadedFile = Array.isArray(uploadedFiles)
      ? uploadedFiles[0]
      : uploadedFiles?.[0];

    if (!uploadedFile?.id || !createdSkill?.data?.documentId) {
      return NextResponse.json(createdSkill, { status: createResponse.status });
    }

    const attachResponse = await fetch(
      `${STRAPI_URL}/api/skills/${createdSkill.data.documentId}?populate=*`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify({
          data: {
            image: uploadedFile.id,
          },
        }),
      },
    );

    const attachedSkill = await attachResponse.json();
    return NextResponse.json(attachedSkill, { status: attachResponse.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Strapi Proxy Error:", message);

    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 },
    );
  }
}
// export async function PUT(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { error: "Skill ID is required" },
//         { status: 400 },
//       );
//     }

//     const body = await request.json();
//     const response = await putToStrapi<StrapiResponse<Skill>>(
//       `/api/skills/${id}`,
//       body,
//     );
//     return NextResponse.json(response);
//   } catch (error) {
//     console.error("Error updating skill:", error);
//     return NextResponse.json(
//       { error: "Failed to update skill" },
//       { status: 500 },
//     );
//   }
// }
export async function PUT(
  request: NextRequest,
  { params }: { params: { documentId: string } },
) {
  try {
    const { documentId } = params;

    const cookieStore = cookies();
    const token = cookieStore.get("strapi-jwt");

    if (!token?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";

    let data: any = {};
    let avatarFile: File | null = null;

    // ✅ HANDLE MULTIPART
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const rawData = formData.get("data");
      data = rawData ? JSON.parse(rawData.toString()) : {};

      avatarFile = formData.get("files.avatar") as File | null;
    } else {
      // fallback (JSON only)
      const body = await request.json();
      data = body?.data || {};
    }

    // ✅ sanitize availability (same as before)
    if (Array.isArray(data?.availability)) {
      data.availability = data.availability.map((slot: any) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));
    }

    // ✅ STEP 1: Upload avatar if exists
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

    // ✅ STEP 2: Attach avatar if uploaded
    if (uploadedFileId) {
      data.avatar = uploadedFileId;
    }

    // ✅ STEP 3: Update profile (JSON only)
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
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Skill ID is required" },
        { status: 400 },
      );
    }

    await deleteToStrapi(`/api/skills/${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 },
    );
  }
}
