"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, PlusCircle } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-8">
        
        {/* Left Side: Navigation */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-gray-500 hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/dashboard/browse-skill" className="text-gray-500 hover:text-black transition-colors">
            Browse
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/submit-skill">
            <Button variant="default" size="sm" className="flex gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Skill
            </Button>
          </Link>

          <Link href="/">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}