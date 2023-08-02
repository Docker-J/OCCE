import axios from "axios";
import { redirect } from "react-router-dom";

export async function loader({ request }) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  if (!searchParams.has("page")) {
    return redirect("?page=1");
  }

  const page = searchParams.get("page");
  const lastVisible = searchParams.get("lastVisible");

  if (page > 1 && lastVisible === null) {
    const savedData = sessionStorage.getItem("posts");
    if (savedData.length > 0) {
      return JSON.parse(sessionStorage.getItem("posts"));
    }
  }

  const result = await axios.get(
    `/api/MeditationON/getPosts?page=${searchParams.get("page")}`,
    {
      params: { lastVisible: searchParams.get("lastVisible") },
    }
  );

  return result.data;
}
