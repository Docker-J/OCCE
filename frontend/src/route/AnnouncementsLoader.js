import { redirect } from "react-router";
import { queryClient } from "../index";
import { getAnnouncements } from "../api/announcements";

export async function loader({ request }) {
  const page = new URL(request.url).searchParams.get("page");
  if (page === null) {
    return redirect("?page=1");
  }

  // Pre-fetch page data into TanStack Query cache before component mounts
  queryClient.prefetchQuery({
    queryKey: ["announcements", page],
    queryFn: () => getAnnouncements(page),
    staleTime: 5 * 60 * 1000,
  });

  return { page };
}
