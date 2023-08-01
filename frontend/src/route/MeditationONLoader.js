import axios from "axios";

export async function loader({ params }) {
  const result = await axios.get(
    `/api/MeditationON/getPosts?page=${params.page}`
  );
  const posts = result.data;

  return posts;
}
