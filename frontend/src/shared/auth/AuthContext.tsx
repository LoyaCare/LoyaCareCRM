// shared/auth/AuthContext.tsx
"use client";
import { createContext, useReducer, useEffect } from "react";
import { User, AuthState, LoginCredentials } from "./types";
import { authApi } from "./api";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Создаем контекст
export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {
    throw new Error("login function not implemented");
  },
  logout: async () => {
    throw new Error("logout function not implemented");
  },
  checkAuth: async () => {
    throw new Error("checkAuth function not implemented");
  },
});

// Типы действий для редьюсера
export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "AUTH_CHECK_START" }
  | { type: "AUTH_CHECK_SUCCESS"; payload: { user: User } }
  | { type: "AUTH_CHECK_FAILURE" };

// Reducer for managing authentication state
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  console.log("Auth action:", action);
  console.log("Auth state:", state);
  switch (action.type) {
    case "LOGIN_START":
    case "AUTH_CHECK_START":
      return { ...state, isLoading: true, error: null };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case "AUTH_CHECK_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case "AUTH_CHECK_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };

    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    default:
      return state;
  }
}