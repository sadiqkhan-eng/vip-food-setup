import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { existsSync, statSync, createReadStream } from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const publicDir = join(process.cwd(), "public");
  const videoPath = join(publicDir, "video", slug);

  if (!existsSync(videoPath)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (!videoPath.startsWith(publicDir)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const stat = statSync(videoPath);
  const fileSize = stat.size;
  const range = request.headers.get("range");

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const file = createReadStream(videoPath, { start, end });
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": String(chunkSize),
      "Content-Type": "video/mp4",
    };
    return new NextResponse(file, { status: 206, headers });
  }

  const fileStream = createReadStream(videoPath);
  const headers = {
    "Content-Length": String(fileSize),
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Content-Disposition": "inline",
  };
  return new NextResponse(fileStream, { status: 200, headers });
}