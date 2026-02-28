"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirecting to the browse-skill page inside dashboard as requested
    router.push("/dashboard/browse-skill");
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
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription className="text-slate-500">
            Join our skill exchange community
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input 
                id="fullname" 
                placeholder="John Doe" 
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
                placeholder="your.email@example.com" 
                className="bg-slate-50/50 border-slate-200"
                required 
              />
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="........" 
                className="bg-slate-50/50 border-slate-200"
                required 
              />
            </div>

            {/* Create Account Button */}
            <Button 
              type="submit" 
              className="w-full bg-[#050510] hover:bg-slate-900 text-white font-semibold py-6 mt-2"
            >
              Create Account
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