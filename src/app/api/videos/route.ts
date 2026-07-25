import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blobs = await list({ prefix: "video/" });
    const videos = blobs.blobs.map((blob) => ({
      name: blob.pathname,
      url: blob.url,
    }));
    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json(
      { error: "Failed to list videos" },
      { status: 500 }
    );
  }
}