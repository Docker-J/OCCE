import axios from "axios";
import { redirect } from "react-router";
import { queryClient } from "../index";

export const announcementsQuery = (page) => ({
  queryKey: ["announcements", page],
  queryFn: async () => {
    const { data } = await axios.get(`/api/announcements?page=${page}`);
    return data;
  },
});

export async function loader({ request }) {
  const page = new URL(request.url).searchParams.get("page");
  if (page === null) {
    return redirect("?page=1");
  }

  // Pre-fetch the query so it's ready in the cache or currently fetching when the component renders
  queryClient.prefetchQuery(announcementsQuery(page));

  return null;
}
