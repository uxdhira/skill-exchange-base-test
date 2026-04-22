"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/auth";
import { useGlobalState } from "@/hooks/GlobalState";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// `use client` is needed because this component uses hooks, click handlers,
// browser redirects, and form interaction.

/**
 * This component shows the registration form.
 * In the current prototype, it creates a demo account and logs the user in.
 */
export default function RegisterPage() {
  // `useRouter` is a Next.js navigation hook.
  // We use it to move the user to another page after registration.
  const router = useRouter();
  const { user, loginUser } = useGlobalState();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // If a user is already logged in, send them away from the register page.
  // `useEffect` is used for this redirect side effect.
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  // This is an example of event handling in React.
  // We use `onSubmit` so the form logic runs in JavaScript.
  // Handle account creation using the demo user data.
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await registerMutation.mutateAsync({
        username,
        firstName,
        lastName,
        email,
        password,
      });

      const newUser = {
        id: result.user.id.toString(),
        name: result.user.username,
        email: result.user.email,
        profile: result.user.profile,
      };

      loginUser(newUser);

      toast("Your account has been created successfully!", {
        position: "top-center",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      toast("Registration failed. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1 text-center pb-2">
          {/* Logo */}

          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription className="text-slate-500">
            Join our skill exchange community
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* FIRST Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="bg-slate-50/50 border-slate-200"
                required
              />
            </div>

            {/* LAST Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="bg-slate-50/50 border-slate-200"
                required
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="bg-slate-50/50 border-slate-200"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="bg-slate-50/50 border-slate-200"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="flex gap-2">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="........"
                  className="bg-slate-50/50 border-slate-200"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              className="w-full bg-[#050510] hover:bg-slate-900 text-white font-semibold py-6 mt-2"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? "Creating account..."
                : "Create Account"}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm text-slate-500 pt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
