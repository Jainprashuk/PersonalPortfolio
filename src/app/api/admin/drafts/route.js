import { NextResponse } from "next/server";
import { isDev, listDrafts } from "../../../lib/drafts";

// Never serve the filesystem in production — this route only exists in dev.
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDev()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const drafts = listDrafts().map(({ content, ...meta }) => meta);
  return NextResponse.json({ drafts });
}
