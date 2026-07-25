import { NextResponse } from "next/server";
import { join } from "path";
import { readdirSync } from "fs";

export async function GET() {
  try {
    const publicDir = join(process.cwd(), "public", "video");
    const files = readdirSync(publicDir);
    const videos = files
      .filter((f) => f.endsWith(".mp4"))
      .map((name) => ({
        name,
        url: `/api/video/${name}`,
      }));
    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json(
      { error: "Failed to list videos" },
      { status: 500 }
    );
  }
}