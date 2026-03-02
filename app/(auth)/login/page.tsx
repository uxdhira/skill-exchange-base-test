import LoginForm from "@/components/blocks/login/login";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login",
};
const Page = () => {
  return <LoginForm />;
};

export default Page;
