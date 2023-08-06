import axios from "axios";

export async function loader({ params }) {
  const result = await axios.get("/api/photos/getAlbumDetail", {
    params: {
      id: params.albumID,
    },
  });

  return result.data;
}
