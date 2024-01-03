import axios from "axios";
import { redirect } from "react-router-dom";

export async function loader({ request }) {
  const page = new URL(request.url).searchParams.get("page");
  if (page === null) {
    return redirect("?page=1");
  }

  const getCount = await axios.get("/api/Announcements/getAnnouncementsCount");
  const getPinned = await axios.get(
    "/api/Announcements/getPinnedAnnouncements"
  );
  const getAnnouncements = await axios.get(
    `/api/Announcements/getAnnouncements?page=${page}`
  );

  const count = getCount.data.count;
  const pinned = getPinned.data;
  const unpinned = getAnnouncements.data;
  const announcements = pinned.concat(unpinned);

  return { count, announcements };
}
