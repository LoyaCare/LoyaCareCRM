import { BACKEND_API_URL } from "@/shared/config/urls";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API_URL}/leads`);
    const leads = await response.json();
    
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
