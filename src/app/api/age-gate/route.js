import { NextResponse } from "next/server";

const AGE_GATE_COOKIE = "tv-age-gate";
const VALID_STATUSES = new Set(["accepted", "rejected"]);

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365 * 10,
};

export async function GET(request) {
  const status = request.cookies.get(AGE_GATE_COOKIE)?.value;

  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ status: "unknown" });
  }

  return NextResponse.json({ status });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const requestedStatus = body?.status;

  if (!VALID_STATUSES.has(requestedStatus)) {
    return NextResponse.json(
      { error: "Invalid age gate status" },
      { status: 400 },
    );
  }

  const existingStatus = request.cookies.get(AGE_GATE_COOKIE)?.value;
  const lockedStatus = VALID_STATUSES.has(existingStatus)
    ? existingStatus
    : requestedStatus;

  const response = NextResponse.json({ status: lockedStatus });
  response.cookies.set(AGE_GATE_COOKIE, lockedStatus, cookieOptions);

  return response;
}

export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Age gate reset is disabled in production" },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ status: "unknown", reset: true });
  response.cookies.set(AGE_GATE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
