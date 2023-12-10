import axios from "axios";

export async function loader({ params }) {
  const result = await axios.get("/api/WeeklyUpdate/RecentDate");
  const date = JSON.stringify(result.data);
  let formattedDateStr = `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(
    6
  )}`;

  const maxDate = new Date(formattedDateStr);

  if (!params.date) {
    const queryDate = maxDate;
    return { maxDate, queryDate };
  }

  const year = params.date.substring(0, 4);
  const month = params.date.substring(4, 6);
  const day = params.date.substring(6, 8);
  const queryDate = new Date(year, month - 1, day);
  return { maxDate, queryDate };
}
