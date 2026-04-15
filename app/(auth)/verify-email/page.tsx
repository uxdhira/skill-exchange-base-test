"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function VerifyEmail() {
  const handleResend = () => {
    toast.success("Verification email sent! Please check your inbox.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We have sent a verification link to your email address
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Check your inbox</p>
                <p>
                  Click the verification link in the email to activate your
                  account and access all features.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Did not receive the email?
            </p>
            <Button variant="outline" className="w-full" onClick={handleResend}>
              Resend Verification Email
            </Button>
          </div>

          <div className="pt-4 text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:underline"
            >
              Go to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
