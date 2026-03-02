import ForgotPassword from "@/components/blocks/forgot-password/forgot-password";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Forgot Password",
};
const Page = () => {
  return <ForgotPassword />;
};

export default Page;
