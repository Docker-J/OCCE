import axios from "axios";
import { redirect } from "react-router";

export async function loader({ request }) {
  const page = new URL(request.url).searchParams.get("page");
  if (page === null) {
    return redirect("?page=1");
  }

  const getAnnouncements = axios.get(`/api/columns?page=${page}`);

  return { announcementsData: getAnnouncements };
}
