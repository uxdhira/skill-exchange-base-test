import LoginForm from "@/components/blocks/login/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

// This page only renders the login form component.
const Page = () => {
  return <LoginForm />;
};

export default Page;
