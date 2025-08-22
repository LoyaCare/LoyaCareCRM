import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API_URL } from "@/shared";

export async function GET(req: NextRequest) {
  try {
    // Получаем токен из заголовка запроса
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Отправляем запрос к вашему бэкенд API
    const response = await fetch(`${BACKEND_API_URL}/auth/me`, {
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to get user info" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}