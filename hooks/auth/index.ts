"use client";

import type { Profile } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  profile?: Profile;
}

interface LoginResponse {
  jwt: string;
  user: StrapiUser;
}

interface RegisterResponse {
  jwt: string;
  user: StrapiUser;
}
const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

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
async function forgotPassword(email: string) {
  const res = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json(); // parse once

  if (!res.ok) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}
async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}

export async function fetchCurrentUser(): Promise<StrapiUser | null> {
  const response = await fetch("/api/auth/user", {
    credentials: "include",
  });

  // ✅ NOT logged in → return null (NOT throw)
  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export async function changePassword({
  currentPassword,
  password,
  passwordConfirmation,
}: {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}) {
  const credentials = { currentPassword, password, passwordConfirmation };
  const response = await fetch("/api/auth/password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Password update  failed" }));
    throw new Error(error.error || "Password update  failed");
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
  return useQuery<StrapiUser | null>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,

    // Important for auth UX
    retry: false, // don't retry 401
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}
// Forgot password hook
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("If this email exists, a reset link has been sent.");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
}
// Change password hook (requires current password and new password)
export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export const useDeactivateAccount = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/deactivate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Something went wrong");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Account deactivated");
      queryClient.clear();
      router.push("/login?message=account_deactivated");
    },
    onError: (error) => {
      console.error("Deactivation failed:", error.message);
    },
  });
};
