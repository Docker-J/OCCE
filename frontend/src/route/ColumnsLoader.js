import { redirect } from "react-router";
import { queryClient } from "../index";
import { getColumns } from "../api/columns";

export async function loader({ request }) {
  const page = new URL(request.url).searchParams.get("page");
  if (page === null) {
    return redirect("?page=1");
  }

  // Pre-fetch page data into TanStack Query cache before component mounts
  queryClient.prefetchQuery({
    queryKey: ["columns", page],
    queryFn: () => getColumns(page),
    staleTime: 5 * 60 * 1000,
  });

  return { page };
}
