import axios from "axios";

export async function loader({ params }) {
  const result = await axios.get(
    `/api/Announcements/getAnnouncement?id=${params.announcementID}`
  );

  return result.data;
}
