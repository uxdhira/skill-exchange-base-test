"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import ForgotPasswordForm from "./forgot-password-form";

const ForgotPassword = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full shadow-md sm:max-w-md border-none">
        <CardHeader className="gap-4">
          <div>
            <CardTitle className="mb-1.5 text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you instructions to reset
              your password
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <ForgotPasswordForm />

          <Link
            href="/login"
            className="group mx-auto flex w-fit items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <ChevronLeftIcon className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to login</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
