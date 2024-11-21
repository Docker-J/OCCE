import axios from "axios";

export async function loader({ params }) {
  const result = await axios.get(`/api/columns/column/${params.columID}`);

  return result.data;
}
