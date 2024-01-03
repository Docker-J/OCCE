import { format } from "date-fns";
import Papa from "papaparse";

const DATE_FORMAT = "M월 d일";

function parse(today) {
  return new Promise((resolve, reject) => {
    Papa.parse("/img/Online/291Bible/schedule.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const match = results.data.find((data) => data.date === today);

        resolve(match);
      },
    });
  });
}

export async function loader() {
  const today = format(new Date(), DATE_FORMAT);
  const match = await parse(today);

  return { today, match };
}
