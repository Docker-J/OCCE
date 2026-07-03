import sendNotification from "./../api/sendNotification.js";

var RECENTDATE;

async function getMostRecentFile(env) {
  const bucket = env.weeklyupdate;
  if (!bucket) {
    throw new Error("R2 bucket binding 'weeklyupdate' is missing. Please check wrangler.json.");
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const previousYear = (currentYear - 1).toString();
  const nextYear = (currentYear + 1).toString();

  const prefixes = [previousYear, currentYear.toString(), nextYear];
  const promises = prefixes.map((prefix) => {
    return bucket.list({ prefix, delimiter: "/" });
  });

  try {
    const results = await Promise.all(promises);

    const allObjects = results
      .flatMap((result) => result.objects || []) // list() returns result.objects in Workers
      .map((obj) => obj.key) // Extract the file name
      .filter((key) => !key.includes("_member")); // Filter out _member files

    allObjects.sort((a, b) => b.localeCompare(a)); // Reverse sort
    return allObjects[0]; // Return the most recent file name
  } catch (error) {
    console.error("Error listing R2 objects:", error);
    return null;
  }
}

export const getRecentWeelyUpdateDate = async (env) => {
  const kv = env.weeklyupdate_kv;
  if (kv) {
    try {
      RECENTDATE = await kv.get("recent_date");
    } catch (e) {
      console.error("Failed to read recent_date from KV:", e);
    }
  }

  if (!RECENTDATE) {
    console.log("KV cache miss or empty. Scanning R2 bucket for recent weekly update date...");
    RECENTDATE = await getMostRecentFile(env);
    if (RECENTDATE && kv) {
      try {
        await kv.put("recent_date", RECENTDATE);
        console.log(`KV cache populated with: ${RECENTDATE}`);
      } catch (e) {
        console.error("Failed to write recent_date to KV:", e);
      }
    }
  }
};

export const getRecentWeeklyUpdateDateController = async (c) => {
  if (RECENTDATE == null) {
    await getRecentWeelyUpdateDate(c.env);
  }
  return c.text(RECENTDATE || "");
};

export const getWeeklyUpdateController = async (c) => {
  const date = c.req.param("date");
  const authenticated = c.get("authenticated") || false;
  const key = `${date}${authenticated ? "_member" : ""}`;
  const bucket = c.env.weeklyupdate;

  if (!bucket) {
    return c.json({ error: "R2 bucket binding 'weeklyupdate' is missing." }, 500);
  }

  try {
    const object = await bucket.get(key);

    if (!object) {
      if (authenticated) {
        // Retry without "_member" for authenticated users
        const retryObject = await bucket.get(date);
        if (!retryObject) {
          return c.body(null, 404);
        }
        c.header("Content-Type", "application/pdf");
        return c.body(retryObject.body);
      }
      return c.body(null, 404);
    }

    c.header("Content-Type", "application/pdf");
    return c.body(object.body);
  } catch (error) {
    console.error("Fetch weekly update failed:", error);
    return c.body(null, 404);
  }
};

export const uploadWeeklyUpdateController = async (c) => {
  const env = c.env;
  const date = c.req.param("date");
  const bucket = env.weeklyupdate;

  if (!bucket) {
    return c.json({ error: "R2 bucket binding 'weeklyupdate' is missing." }, 500);
  }

  try {
    const formData = await c.req.formData();
    const files = formData.getAll("pdfs"); // files is an array of File objects

    const promises = files.map(async (file, index) => {
      const arrayBuffer = await file.arrayBuffer();
      const key = `${date}${index === 1 ? "_member" : ""}`;
      return bucket.put(key, arrayBuffer, {
        httpMetadata: { contentType: "application/pdf" },
      });
    });
    await Promise.all(promises);

    const kv = env.weeklyupdate_kv;
    if (!RECENTDATE || date > RECENTDATE) {
      RECENTDATE = date;
      if (kv) {
        try {
          await kv.put("recent_date", date);
        } catch (e) {
          console.error("Failed to update KV with new upload date:", e);
        }
      }
    }

    // Send push notification asynchronously in the background
    c.executionCtx.waitUntil(
      sendNotification(
        env,
        "새로운 주보가 업로드 되었습니다",
        date,
        `weeklyupdate/${date}`
      )
    );

    return c.text(date);
  } catch (error) {
    console.error("Upload weekly update failed:", error);
    return c.body(null, 500);
  }
};

export const deleteWeeklyUpdateController = async (c) => {
  const date = c.req.param("date");
  const env = c.env;
  const bucket = env.weeklyupdate;

  if (!bucket) {
    return c.json({ error: "R2 bucket binding 'weeklyupdate' is missing." }, 500);
  }

  try {
    await bucket.delete(date);
    await bucket.delete(`${date}_member`);
    
    // Recalculate recent date
    RECENTDATE = await getMostRecentFile(env);
    
    const kv = env.weeklyupdate_kv;
    if (kv) {
      try {
        if (RECENTDATE) {
          await kv.put("recent_date", RECENTDATE);
        } else {
          await kv.delete("recent_date");
        }
      } catch (e) {
        console.error("Failed to update KV on deletion:", e);
      }
    }
    
    return c.text(RECENTDATE || "");
  } catch (error) {
    console.error("Delete weekly update failed:", error);
    return c.body(null, 500);
  }
};
