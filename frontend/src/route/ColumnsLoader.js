import axios from "axios";
import { defer, redirect } from "react-router-dom";

export async function loader({ request }) {
  const page = new URL(request.url).searchParams.get("page");
  if (page === null) {
    return redirect("?page=1");
  }

  const getAnnouncements = axios.get(`/api/columns?page=${page}`);

  return defer({ announcementsData: getAnnouncements });
}
