import ForgotPassword from "@/components/blocks/forgot-password/forgot-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

// This page only renders the forgot password component.
const Page = () => {
  return <ForgotPassword />;
};

export default Page;
