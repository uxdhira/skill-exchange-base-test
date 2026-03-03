"use client";

import { useGlobalState } from "@/hooks/useGlobalState";
import Link from "next/link";
import { Button } from "../../button";

const AuthButtons = () => {
  const { user } = useGlobalState();

  return (
    <>
      {!user ? (
        <>
          <Link href="/login">
            <Button variant="default">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Register</Button>
          </Link>
        </>
      ) : (
        <Link href="/dashboard">
          <Button variant="outline">Dashboard</Button>
        </Link>
      )}
    </>
  );
};

export default AuthButtons;
