import RegisterForm from "@/components/blocks/register/register";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Register",
};
const Page = () => {
  return <RegisterForm />;
};

export default Page;
