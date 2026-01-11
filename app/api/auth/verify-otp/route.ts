import { NextResponse } from "next/server";
import axios from "axios";
import api from "@/lib/axios";

type VerifyOtpBody = {
  phone: string;
  otp: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VerifyOtpBody;
    if (!body?.phone || !body?.otp) {
      return NextResponse.json(
        { message: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    const backendRes = await api.post("/influencer/auth/verify-otp", body);
    const data = backendRes.data as {
      accessToken?: string;
      message?: string;
    };

    const accessToken = data?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Token missing from backend response" },
        { status: 500 }
      );
    }

    const res = NextResponse.json(
      { message: "OTP verified", token: accessToken },
      { status: 200 }
    );

    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const msg =
        (err.response?.data as { message?: string })?.message ??
        "OTP verification failed";

      return NextResponse.json({ message: msg }, { status });
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
