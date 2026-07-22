import { NextResponse } from "next/server";
import { isDev, deleteDraft } from "../../../../lib/drafts";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isDev()) {
    return new NextResponse("Not found", { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const result = deleteDraft(body?.slug);
  if (!result.ok) {
    const status = result.code === "not_found" ? 404 : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
