import {
  deleteToStrapi,
  fetchFromStrapi,
  putToStrapi,
  StrapiResponse,
} from "@/lib/backend/strapi";

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";

    const response = await fetchFromStrapi<SkillsResponse>(
      `/api/skills?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
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

// export async function POST(request: NextRequest) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("strapi-jwt");
//     const incomingFormData = await request.formData();

//     // Create the payload for Strapi
//     const strapiFormData = new FormData();

//     // Explicitly grab and append the keys we know Strapi needs
//     const dataField = incomingFormData.get("data");
//     const imageFile = incomingFormData.get("files.image");

//     if (dataField) {
//       strapiFormData.append("data", dataField);
//     }

//     if (imageFile instanceof File) {
//       strapiFormData.append("files.image", imageFile);
//     }
//     console.log({ strapiFormData });
//     const res = await fetch(`${STRAPI_URL}/api/skills`, {
//       method: "POST",
//       headers: {
//         // ONLY pass the Auth header.
//         // DO NOT manually set Content-Type.
//         Authorization: `Bearer ${token?.value}`,
//       },
//       body: strapiFormData,
//     });

//     const result = await res.json();
//     return NextResponse.json(result, { status: res.status });
//   } catch (error) {
//     console.error("Route Handler Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

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
    console.log("createdSkill");

    if (!createResponse.ok) {
      return NextResponse.json(createdSkill, { status: createResponse.status });
    }
    console.log("here", file);

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
    console.log({ attachedSkill });
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
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Skill ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const response = await putToStrapi<StrapiResponse<Skill>>(
      `/api/skills/${id}`,
      body,
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
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
