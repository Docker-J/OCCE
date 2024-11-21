import { getColumn } from "../api/columns";

export async function loader({ params }) {
  const result = await getColumn(params.columnID);

  return result;
}
