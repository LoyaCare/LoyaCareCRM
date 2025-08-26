import { NextResponse } from "next/server";
import { BACKEND_API_URL } from "@/shared/config/urls";

export async function GET(req: Request) {
  try {
    const res = await fetch(`${BACKEND_API_URL}/deals/lost`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Fail to get lost deals" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Url=", `${BACKEND_API_URL}/deals/lost`);
    console.error("API route error:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
