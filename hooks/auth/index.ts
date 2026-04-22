"use client";

import type { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AUTH_KEY = ["auth", "user"];

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: StrapiUser;
}

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id: number;
    avatar?: string;
    bio?: string;
    location?: string;
    rating?: number;
    reviewCount?: number;
  };
}

interface LoginResponse {
  jwt: string;
  user: StrapiUser;
}

interface RegisterResponse {
  jwt: string;
  user: StrapiUser;
}

async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Login failed" }));
    throw new Error(error.error || "Login failed");
  }

  return response.json();
}

async function register(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Registration failed" }));
    throw new Error(error.error || "Registration failed");
  }

  return response.json();
}

async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}

async function fetchCurrentUser(): Promise<User> {
  const response = await fetch("/api/auth/user");

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Not authenticated");
    }
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEY, data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEY, data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_KEY,
    queryFn: fetchCurrentUser,
    retry: true,
    staleTime: 1000, // 5 minutes
    // staleTime: 1000 * 60 * 5,
  });
}
