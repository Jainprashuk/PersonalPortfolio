import { NextResponse } from "next/server";
import { isDev, approveDraft } from "../../../../lib/drafts";

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

  const { slug, force } = body || {};
  const result = approveDraft(slug, { force: force === true });

  if (!result.ok) {
    // 409 for "still has blockers", 400 for everything else caller-fixable.
    const status = result.code === "markers" || result.code === "exists" ? 409 : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
