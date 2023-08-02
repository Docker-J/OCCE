import axios from "axios";

export async function loader({ params }) {
  const result = await axios.get("/api/MeditationON/getPostDetail", {
    params: {
      id: params.postID,
    },
  });

  return result.data;
}
