"use client"; // Required for handling the click event and navigation

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currentUser } from "@/data/mockData";
import { useGlobalState } from "@/hooks/useGlobalState";
import Link from "next/link"; // react extends html anchor a component for client side navigation between pages or routes
import { useRouter } from "next/navigation"; // Hook for redirection
import { useState } from "react";

// `next/link` is used for fast client-side navigation between pages.
// We use it for links like register and forgot password.
// This file also uses Shadcn UI components like `Card`, `Button`, `Input`,
// `Label`, and `Checkbox` to build a clean and consistent login form quickly.

/**
 * This component shows the login form.
 * In the current prototype, it logs in the demo user and redirects to the dashboard.
 */
export default function LoginPage() {
  // `useRouter` lets us navigate in code after login succeeds.
  const router = useRouter();
  const { loginUser } = useGlobalState();
  const [showPassword, setShowPassword] = useState(false);

  // This is a React event handler for form submission.
  // Handle form submit and log in the demo user.
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const userData = currentUser;
    loginUser(userData);

    // Move the user to the dashboard after login.
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1 text-center pb-2">
          {/* Logo */}

          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500">
            Login to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Form with onSubmit handler */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={"uxdhira@gmail.com"}
                placeholder="your.email@example.com"
                className="bg-slate-50/50 border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  defaultValue={"uxdk1234"}
                  placeholder="........"
                  className="bg-slate-50/50 border-slate-200"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-slate-600 cursor-pointer leading-none"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button handles the redirect */}
            <Button
              type="submit"
              className="w-full bg-[#050510] hover:bg-slate-900 text-white font-semibold py-6"
            >
              Login
            </Button>

            <div className="text-center text-sm text-slate-500 pt-2">
              Do not have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Create account{" "}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
