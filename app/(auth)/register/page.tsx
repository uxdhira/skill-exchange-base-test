import RegisterForm from "@/components/blocks/register/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

// This page only renders the register form component.
const Page = () => {
  return <RegisterForm />;
};

export default Page;
