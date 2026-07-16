import sendNotification from "./../api/sendNotification.js";
import { format, subMonths } from "date-fns";

async function getMostRecentFile(env) {
  const bucket = env.weeklyupdate;
  if (!bucket) {
    throw new Error("R2 bucket binding 'weeklyupdate' is missing. Please check wrangler.json.");
  }

  const today = new Date();
  const currentPrefix = format(today, "yyyyMM");
  const prevPrefix = format(subMonths(today, 1), "yyyyMM");
  const currentYear = format(today, "yyyy");

  try {
    // 1. List current month and previous month in parallel (2 requests concurrent)
    const promises = [
      bucket.list({ prefix: currentPrefix, delimiter: "/" }),
      bucket.list({ prefix: prevPrefix, delimiter: "/" }),
    ];
    
    const results = await Promise.all(promises);
    const objects = results
      .flatMap((res) => res.objects || [])
      .map((obj) => obj.key)
      .filter((key) => !key.includes("_member"));

    if (objects.length > 0) {
      objects.sort((a, b) => b.localeCompare(a));
      return objects[0];
    }

    // 2. Last resort fallback: scan the entire current year (e.g. 2026)
    console.log(`No files found for prefixes ${currentPrefix} or ${prevPrefix}. Scanning current year ${currentYear}...`);
    const listResult = await bucket.list({ prefix: currentYear, delimiter: "/" });
    const fallbackObjects = (listResult.objects || [])
      .map((obj) => obj.key)
      .filter((key) => !key.includes("_member"));

    if (fallbackObjects.length > 0) {
      fallbackObjects.sort((a, b) => b.localeCompare(a));
      return fallbackObjects[0];
    }

    return null;
  } catch (error) {
    console.error("Error listing R2 objects in getMostRecentFile:", error);
    return null;
  }
}

export const getRecentWeeklyUpdateDateController = async (c) => {
  const force = c.req.query("refresh") === "true";
  const kv = c.env.weeklyupdate_kv;
  
  let recentDate = null;
  if (kv && !force) {
    try {
      recentDate = await kv.get("recent_date");
    } catch (e) {
      console.error("Failed to read recent_date from KV:", e);
    }
  }

  if (!recentDate) {
    console.log("KV cache miss or forced refresh. Scanning R2 bucket for recent weekly update date...");
    recentDate = await getMostRecentFile(c.env);
    if (recentDate && kv) {
      try {
        await kv.put("recent_date", recentDate);
        console.log(`KV cache populated with: ${recentDate}`);
      } catch (e) {
        console.error("Failed to write recent_date to KV:", e);
      }
    }
  }

  return c.text(recentDate || "");
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

    // Update the KV cache directly
    const kv = env.weeklyupdate_kv;
    if (kv) {
      try {
        const cached = await kv.get("recent_date");
        if (!cached || date > cached) {
          await kv.put("recent_date", date);
        }
      } catch (e) {
        console.error("Failed to update KV with new upload date:", e);
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
  const kv = env.weeklyupdate_kv;

  if (!bucket) {
    return c.json({ error: "R2 bucket binding 'weeklyupdate' is missing." }, 500);
  }

  try {
    await bucket.delete(date);
    await bucket.delete(`${date}_member`);
    
    let newRecentDate = null;
    let skipScan = false;

    if (kv) {
      try {
        const cachedRecentDate = await kv.get("recent_date");
        if (cachedRecentDate && date < cachedRecentDate) {
          newRecentDate = cachedRecentDate;
          skipScan = true;
          console.log(`Deleted an older weekly update (${date}). Skipping R2 scan. Recent date remains: ${newRecentDate}`);
        }
      } catch (e) {
        console.error("Failed to read recent_date from KV on deletion check:", e);
      }
    }

    if (!skipScan) {
      console.log(`Deleted the most recent or uncached weekly update (${date}). Recalculating...`);
      newRecentDate = await getMostRecentFile(env);
      if (kv) {
        try {
          if (newRecentDate) {
            await kv.put("recent_date", newRecentDate);
          } else {
            await kv.delete("recent_date");
          }
        } catch (e) {
          console.error("Failed to update KV on deletion:", e);
        }
      }
    }
    
    return c.text(newRecentDate || "");
  } catch (error) {
    console.error("Delete weekly update failed:", error);
    return c.body(null, 500);
  }
};
