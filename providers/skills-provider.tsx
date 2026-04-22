import { fetchSkills } from "@/lib/backend/fetch-skills";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function SkillsProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["skills", 1, 10],
    queryFn: () => fetchSkills(1, 10),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
