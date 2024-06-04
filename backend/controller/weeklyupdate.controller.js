import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const BUCKET = "weeklyupdate";
const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

var RECENTDATE;

async function getMostRecentFile() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const previousYear = (currentYear - 1).toString();
  const nextYear = (currentYear + 1).toString();

  const prefixes = [previousYear, currentYear.toString(), nextYear];
  const promises = prefixes.map((prefix) => {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      Delimiter: "/",
    });

    return R2.send(command);
  });

  try {
    const results = await Promise.all(promises);

    const allObjects = results
      .flatMap((result) => result.Contents || []) // Flatten the Contents arrays
      .map((obj) => obj.Key) // Extract the Key (file name)
      .filter((key) => !key.includes("_member")); // Filter out _member files

    allObjects.sort((a, b) => b.localeCompare(a)); // Reverse sort
    return allObjects[0]; // Return the most recent file name
  } catch (error) {
    console.error("Error listing R2 objects:", error);
    return null;
  }
}

export const getRecentWeelyUpdateDate = async () => {
  RECENTDATE = await getMostRecentFile();
};

export const getRecentWeeklyUpdateDateController = async (_, res) => {
  res.send(RECENTDATE);
};

export const getWeeklyUpdateController = async (req, res) => {
  const key = `${req.params.date}${res.locals.authenticated ? "_member" : ""}`;

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
    const result = await R2.send(command);

    result.Body.pipe(res); // Stream the data directly to the response
  } catch (error) {
    if (res.locals.authenticated) {
      // Retry without "_member" for authenticated users
      try {
        const retryCommand = new GetObjectCommand({
          Bucket: BUCKET,
          Key: req.params.date,
        });
        const retryResult = await R2.send(retryCommand);
        retryResult.Body.pipe(res);
      } catch (retryError) {
        // Second attempt failed for authenticated user, send 404
        console.error(retryError);
        res.sendStatus(404);
      }
    } else {
      // First attempt failed for unauthenticated user, send 404
      console.error(error);
      res.sendStatus(404);
    }
  }
};

export const uploadWeeklyUpdateController = async (req, res) => {
  const files = req.files;

  try {
    const promises = files.map((file, index) => {
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: `${req.params.date}${index === 1 ? "_member" : ""}`,
        Body: file.buffer,
        ContentType: "application/pdf",
      });
      return R2.send(command);
    });
    await Promise.all(promises);

    if (req.params.date > RECENTDATE) {
      RECENTDATE = req.params.date;
    }

    res.send(req.params.date);

    // sendNotification(
    //   "새로운 주보가 업로드 되었습니다",
    //   req.body.date,
    //   `weeklyupdate/${req.body.date}`
    // );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
