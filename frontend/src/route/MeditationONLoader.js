import axios from "axios";

var restored;

// window.onpopstate = () => {
//   console.log("backed!");
//   restored = true;
// };

export async function loader({ request }) {
  console.log("request");

  if (restored === true) {
    const savedData = sessionStorage.getItem("posts");
    if (savedData !== null) {
      restored = false;
      console.log("restored!!!");
      return JSON.parse(sessionStorage.getItem("posts"));
    }
  }

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const lastVisible = searchParams.get("lastVisible");
  const timeStamp = searchParams.get("timeStamp");

  const result = await axios.get(
    `/api/MeditationON/getPosts${
      lastVisible === null
        ? ""
        : `?lastVisible=${lastVisible}&timeStamp=${timeStamp}`
    }`
  );

  // console.log(result.data);
  return result.data;
}
