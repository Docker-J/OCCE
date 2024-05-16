import axios from "axios";

export async function loader({ params }) {
  const result = await axios.get(`/api/albums/album/${params.albumID}`);

  return result.data;
}
