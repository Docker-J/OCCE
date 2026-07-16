// A comprehensive, categorized list of modern crawler and scraper user-agents
const BOT_AGENTS = [
  // --- Traditional Search Engines ---
  "googlebot",
  "bingbot",
  "yandex",
  "baiduspider",
  "duckduckbot",
  "sogou",

  // --- AI Scrapers & LLM Crawlers ---
  "gptbot", // OpenAI
  "chatgpt-user", // OpenAI user browsing
  "claude-bot", // Anthropic
  "claudebot", // Anthropic alternative string
  "cohere-ai", // Cohere
  "google-extended", // Google's AI crawler
  "perplexitybot", // Perplexity

  // --- Social Media Link Previews ---
  "facebookexternalhit",
  "kakaotalk-scrap",
  "twitterbot",
  "linkedinbot",
  "pinterest/0.",
  "slackbot",
  "discordbot",
  "whatsapp",
  "telegrambot",
  "vkshare",
  "redditbot",
  "applebot", // Apple iMessage previews & Spotlight

  // --- Common SEO / Dev Tools ---
  "screaming frog seospider",
  "ahrefsbot",
  "semrushbot",
  "rogerbot", // Moz
  "w3c_validator",
];

const ROUTE_TITLES = {
  "/": "ON Community Church of Edmonton",
  "/aboutus": "교회소개 - OCCE",
  "/announcements": "공지사항 - OCCE",
  "/weeklyupdate": "주보 - OCCE",
  "/columns": "목회칼럼 - OCCE",
  "/schedules": "교회일정 - OCCE",
  "/newcomers": "새가족 - OCCE",
  "/albums": "교회사진 - OCCE",
  "/online/sundayservice": "주일예배 - OCCE",
  "/online/sermon": "말씀 - OCCE",
  "/online/worship": "찬양 - OCCE",
  "/online/dawnQT": "새벽QT - OCCE",
  "/online/prayON": "기도ON - OCCE",
  "/online/meditationon": "묵상ON - OCCE",
  "/online/bible291": "291일 성경1독 - OCCE",
  "/community/smallgroup": "소그룹 - OCCE",
  "/community/smallgroup/report": "소그룹 보고서 - OCCE",
  "/community/ministry": "사역 - OCCE",
  "/nextgen/preschool": "유아유치부 - OCCE",
  "/nextgen/elementary": "유초등부 - OCCE",
  "/nextgen/youth": "중고등부 - OCCE",
  "/nextgen/youngadult": "청년부 - OCCE",
};

export const linkPreviewMiddleware = async (c, next, app) => {
  const userAgent = (c.req.header("user-agent") || "").toLowerCase();
  const isBot = BOT_AGENTS.some((bot) => userAgent.includes(bot));

  const url = new URL(c.req.url);
  const cleanPath = url.pathname.length > 1 && url.pathname.endsWith("/")
    ? url.pathname.slice(0, -1)
    : url.pathname;

  const isApi = cleanPath.startsWith("/api/");
  const isStaticFile = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|webmanifest|json)$/i.test(cleanPath);

  if (isBot && !isApi && !isStaticFile) {
    let title = ROUTE_TITLES[cleanPath] || "ON Community Church of Edmonton";

    // Handle dynamic routing
    try {
      const cleanPathLower = cleanPath.toLowerCase();
      if (cleanPathLower.startsWith("/announcements/")) {
        const id = cleanPath.split("/")[2];
        if (id && c.env.DB) {
          const { results } = await c.env.DB.prepare("SELECT title FROM Announcements WHERE id = ?").bind(id).all();
          if (results && results.length > 0) {
            title = `${results[0].title} - OCCE`;
          }
        }
      } else if (cleanPathLower.startsWith("/columns/")) {
        const id = cleanPath.split("/")[2];
        if (id && c.env.DB) {
          const { results } = await c.env.DB.prepare("SELECT title FROM Columns WHERE id = ?").bind(id).all();
          if (results && results.length > 0) {
            title = `${results[0].title} - 목회칼럼 - OCCE`;
          }
        }
      } else if (cleanPathLower.startsWith("/albums/")) {
        const id = cleanPath.split("/")[2];
        if (id && app) {
          const res = await app.fetch(new Request(new URL(`/api/albums/${id}`, url.origin)), c.env);
          if (res.ok) {
            const data = await res.json();
            if (data && data.title) {
              title = `${data.title} - OCCE`;
            }
          }
        }
      } else if (cleanPathLower.startsWith("/online/meditationon/")) {
        const id = cleanPath.split("/")[3];
        if (id && app) {
          const res = await app.fetch(new Request(new URL(`/api/meditation-on/${id}`, url.origin)), c.env);
          if (res.ok) {
            const data = await res.json();
            if (data && data.Timestamp) {
              const dateObj = new Date(data.Timestamp);
              const formatter = new Intl.DateTimeFormat("en-CA", {
                timeZone: "America/Edmonton",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
              });
              const formattedDate = formatter.format(dateObj);
              title = `${formattedDate} QT A/S - OCCE`;
            }
          }
        }
      } else if (cleanPathLower.startsWith("/weeklyupdate/")) {
        const dateParam = cleanPath.split("/")[2];
        if (dateParam && /^\d{8}$/.test(dateParam)) {
          const year = dateParam.slice(0, 4);
          const month = dateParam.slice(4, 6);
          const day = dateParam.slice(6, 8);
          title = `${year}-${month}-${day} 주보 - OCCE`;
        }
      }
    } catch (error) {
      console.error("Error setting dynamic title in middleware:", error);
    }

    const logoUrl = new URL("/img/link_preview_banner.jpg", url.origin).toString();

    // Fetch the index.html from static assets using c.env.ASSETS
    if (c.env.ASSETS) {
      try {
        const response = await c.env.ASSETS.fetch(new URL("/index.html", c.req.url));
        const rewrittenResponse = new HTMLRewriter()
          .on("title", {
            element(element) {
              element.setInnerContent(title);
            },
          })
          .on("head", {
            element(element) {
              element.append(`<meta property="og:title" content="${title}" />`, { html: true });
              element.append(`<meta name="twitter:title" content="${title}" />`, { html: true });
              element.append(`<meta property="og:image" content="${logoUrl}" />`, { html: true });
              element.append(`<meta name="twitter:image" content="${logoUrl}" />`, { html: true });
              element.append(`<meta property="og:type" content="website" />`, { html: true });
              element.append(`<meta name="twitter:card" content="summary_large_image" />`, { html: true });
            },
          })
          .transform(response);

        return rewrittenResponse;
      } catch (err) {
        console.error("Error running HTMLRewriter in middleware:", err);
      }
    }
  }

  await next();
};
