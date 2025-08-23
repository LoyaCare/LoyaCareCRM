// shared/auth/api.ts
import { User, LoginCredentials } from "./model/types";
import { NEXT_PUBLIC_API_URL } from "@/shared/config/urls";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{user: User, token: string}> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to login");
    }
    const responseData = await response.json();
    return responseData;
  },
  
  getCurrentUser: async (token: string): Promise<User> => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user info");
    }

    const responseData = await response.json();
    if (!responseData?.user || !responseData.success) {
      throw new Error("Failed to get user info");
    }
    return responseData.user;
  },
  
  logout: async (token: string): Promise<void> => {
    await fetch(`${NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },
};