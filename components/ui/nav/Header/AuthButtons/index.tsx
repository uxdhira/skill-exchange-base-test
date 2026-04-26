"use client";

import { useGlobalState } from "@/hooks/GlobalState";
import Link from "next/link";
import { Button } from "../../../button";

const AuthButtons = () => {
  // const { data: user, isLoading } = useCurrentUser();
  const { user } = useGlobalState();
  // if (isLoading) {
  //   return <LoadingSkeleton />;
  // }

  // const isLoggedIn = user?.profile;
  return user ? (
    <Link href="/dashboard">
      <Button variant="outline">Dashboard</Button>
    </Link>
  ) : (
    <>
      <Link href="/login">
        <Button variant="default">Login</Button>
      </Link>
      <Link href="/register">
        <Button variant="outline">Register</Button>
      </Link>
    </>
  );
};

export default AuthButtons;
