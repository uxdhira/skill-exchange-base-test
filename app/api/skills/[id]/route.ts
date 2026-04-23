import {
  deleteToStrapi,
  fetchFromStrapi,
  StrapiResponse,
} from "@/lib/backend/strapi";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Skill } from "../route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const response = await fetchFromStrapi<StrapiResponse<Skill>>(
      `/api/skills/${id}?populate[image]=*&populate[owner]=*&populate[category]=*`,
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching skill:", error);
    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
      mode: parsedData.mode === "in_person" ? "inperson" : parsedData.mode,
    };

    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/skills/${id}?populate=*`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify({ data: payload }),
      },
    );

    const updatedSkill = await updateResponse.json();
    if (!updateResponse.ok) {
      return NextResponse.json(updatedSkill, { status: updateResponse.status });
    }

    const file = incomingFormData.get("files.image");
    if (!(file instanceof File)) {
      return NextResponse.json(updatedSkill, { status: updateResponse.status });
    }

    const uploadFormData = new FormData();
    uploadFormData.append("files", file);

    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
        body: uploadFormData,
      },
    );

    const uploadedFiles = await uploadResponse.json();
    if (!uploadResponse.ok) {
      return NextResponse.json(uploadedFiles, {
        status: uploadResponse.status,
      });
    }

    const uploadedFile = Array.isArray(uploadedFiles)
      ? uploadedFiles[0]
      : uploadedFiles;

    if (!uploadedFile?.id) {
      return NextResponse.json(updatedSkill, { status: updateResponse.status });
    }

    const attachResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/skills/${id}?populate=*`,
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
    console.error(
      "Error updating skill:",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
