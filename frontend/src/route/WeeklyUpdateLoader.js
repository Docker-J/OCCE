import { parse } from "date-fns";
import { getRecentWeelyUpdateDate } from "../api/weeklyupdate";

const DATE_FORMAT = "yyyyMMdd";

export async function loader({ params }) {
  console.log("test");
  const result = await getRecentWeelyUpdateDate();

  const date = JSON.stringify(result.data);

  const maxDate = parse(date, DATE_FORMAT, new Date());

  if (!params.date) {
    const queryDate = maxDate;
    return { maxDate, queryDate };
  }

  const queryDate = parse(params.date, DATE_FORMAT, new Date());
  return { maxDate, queryDate };
}
