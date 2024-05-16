import axios from "axios";

export async function loader({ params }) {
  const result = await axios.get(
    `/api/announcements/announcement/${params.announcementID}`
  );

  return result.data;
}
