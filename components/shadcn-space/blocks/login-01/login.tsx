"use client"; // Required for handling the click event and navigation

import Link from "next/link";
import { useRouter } from "next/navigation"; // Hook for redirection
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally add your auth logic (Firebase, Supabase, NextAuth)
    // For now, we simulate a successful login and redirect
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1 text-center pb-2">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
              <ArrowRightLeft className="h-8 w-8" />
              <span>SkillSpill</span>
            </div>
          </div>
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
                placeholder="your.email@example.com" 
                className="bg-slate-50/50 border-slate-200"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="........" 
                className="bg-slate-50/50 border-slate-200"
                required 
              />
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
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}