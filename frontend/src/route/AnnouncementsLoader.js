import axios from "axios";
import { redirect } from "react-router-dom";

export async function loader({ request }) {
  const page = new URL(request.url).searchParams.get("page");
  if (page === null) {
    return redirect("?page=1");
  }

  const getCount = await axios.get("/api/Announcements/getAnnouncementsCount");
  const getAnnouncements = await axios.get(
    `/api/Announcements/getAnnouncements?page=${page}`
  );

  const count = getCount.data.count;
  const announcements = getAnnouncements.data;

  return { count, announcements };
}
