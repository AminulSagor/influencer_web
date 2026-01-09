import { NextResponse } from "next/server";

export const POST = async () => {
  const res = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );

  res.cookies.set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
};
