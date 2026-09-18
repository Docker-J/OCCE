import { Hono } from "hono";

import user from "./user.routes.js";
import announcements from "./announcements.routes.js";
import columns from "./columns.routes.js";
import weeklyupdate from "./weeklyupdate.routes.js";
import albums from "./albums.routes.js";
import schedules from "./schedules.routes.js";
import meditationon from "./meditationon.routes.js";
import notification from "./notification.routes.js";
import images from "./images.routes.js";
import attendance from "./attendance.routes.js";
import bible291 from "./bible291.routes.js";
import admin from "./admin.routes.js";

/**
 * Composite API Router
 * Aggregates and mounts all feature-based modular sub-routers under /api
 */
const apiRouter = new Hono();

apiRouter.route("/user", user);
apiRouter.route("/announcements", announcements);
apiRouter.route("/columns", columns);
apiRouter.route("/weekly-update", weeklyupdate);
apiRouter.route("/albums", albums);
apiRouter.route("/schedules", schedules);
apiRouter.route("/meditation-on", meditationon);
apiRouter.route("/notification", notification);
apiRouter.route("/images", images);
apiRouter.route("/attendance", attendance);
apiRouter.route("/bible291", bible291);
apiRouter.route("/admin", admin);

export default apiRouter;
