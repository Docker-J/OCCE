import { getPost } from "../api/meditationon";

export async function loader({ params }) {
  const result = await getPost(params.postID);

  return result.data;
}
