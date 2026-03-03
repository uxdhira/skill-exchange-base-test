"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPasswordForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate API call
    alert("Reset link has been sent to your email.");

    console.log("Reset link requested");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label htmlFor="userEmail">Email address*</Label>
        <Input
          type="email"
          id="userEmail"
          placeholder="Enter your email address"
          required
        />
      </div>

      <Button className="w-full" type="submit">
        Send Reset Link
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
