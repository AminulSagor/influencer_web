// app/api/auth/login/route.ts
import { decodeJwtPayload } from "@/helpers/helper";
import api from "@/lib/axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const backendRes = await api.post("/influencer/auth/login", body);

    const data = backendRes.data as { accessToken?: string; message?: string };

    if (!data?.accessToken) {
      return NextResponse.json(
        { message: "Server Error" },
        { status: 500 }
      );
    }

    const payload = decodeJwtPayload(data.accessToken);
    const role = payload?.role;
    const isVerified = Boolean(payload?.isVerified);

    if (!role) {
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }

    const res = NextResponse.json(
      { message: "Login Successful", role, isVerified },
      { status: 200 }
    );

    res.cookies.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return res;
  } catch {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
};
