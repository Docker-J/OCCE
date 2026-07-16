import { Outlet, createBrowserRouter, useNavigation, RouterProvider } from "react-router";
import { LinearProgress, CircularProgress, Box } from "@mui/material";
import { lazy, Suspense } from "react";

import "./App.css";

import ResponsiveAppBar from "./header/ResponsiveAppBar";

import Footer from "./header/Footer";
import NotificationManager from "./manager/NotificationManager";
import UserManager from "./manager/UserManager";
import RequestManager from "./manager/RequestManager";
import { ErrorBoundary } from "react-error-boundary";
import FullScreenLoading from "./common/FullScreenLoading";

window.addEventListener("vite:preloadError", () => {
  const isRefreshed = window.sessionStorage.getItem("vite-preload-error-refreshed");
  if (!isRefreshed) {
    window.sessionStorage.setItem("vite-preload-error-refreshed", "true");
    window.location.reload();
  } else {
    window.sessionStorage.removeItem("vite-preload-error-refreshed");
  }
});

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const Managers = () => {
  return (
    <>
      <UserManager />
      <NotificationManager />
      <RequestManager />
    </>
  );
};

const GlobalLoader = () => {
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return <LinearProgress sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }} color="primary" />;
  }
  return null;
};

const HeaderFooterWrapper = () => {
  return (
    <>
      <GlobalLoader />
      <Managers />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "100vh",
        }}
      >
        <ResponsiveAppBar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

const HeaderWrapper = () => {
  return (
    <>
      <GlobalLoader />
      <Managers />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "100vh",
        }}
      >
        <ResponsiveAppBar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <HeaderFooterWrapper />,
    children: [
      {
        path: "/",
        lazy: async () => ({ Component: (await import("./pages/Main/Main")).default }),
      },
      {
        path: "/aboutus",
        lazy: async () => ({ Component: (await import("./pages/AboutUs/AboutUs")).default }),
      },
      {
        path: "/announcements",
        lazy: async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Announcements/Announcements"),
            import("./route/AnnouncementsLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        },
      },
      {
        path: "/announcements/:announcementID",
        lazy: async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Announcements/Announcement"),
            import("./route/AnnouncementLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        },
      },
      {
        path: "/weeklyupdate/:date?",
        lazy: async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/WeeklyUpdate/WeeklyUpdate"),
            import("./route/WeeklyUpdateLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        },
        shouldRevalidate: () => false,
      },
      {
        path: "/albums/:albumID",
        lazy: async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Albums/Album"),
            import("./route/AlbumLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        },
      },
      {
        path: "/columns",
        lazy: async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Columns/Columns"),
            import("./route/ColumnsLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        },
      },
      {
        path: "/columns/:columnID",
        lazy: async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Columns/Column"),
            import("./route/ColumnLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        },
      },
      {
        path: "/schedules",
        lazy: async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Schedules/Schedules"),
            import("./route/SchedulesLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        },
      },
      {
        path: "/newcomers",
        lazy: async () => ({ Component: (await import("./pages/News/NewComers/NewComers")).default }),
      },
      {
        path: "/community",
        children: [
          {
            path: "smallgroup",
            lazy: async () => ({ Component: (await import("./pages/Community/SmallGroup")).default }),
          },
          {
            path: "smallgroup/report",
            lazy: async () => {
              const m = await import("./pages/Community/SmallGroupReport");
              return { Component: m.default, action: m.action };
            },
          },
          {
            path: "ministry",
            lazy: async () => ({ Component: (await import("./pages/Community/Ministry")).default }),
          },
        ],
      },
      {
        path: "/online",
        children: [
          {
            path: "sundayservice",
            lazy: async () => ({ Component: (await import("./pages/Online/SundayService")).default }),
          },
          {
            path: "sermon",
            lazy: async () => ({ Component: (await import("./pages/Online/Sermon")).default }),
          },
          {
            path: "worship",
            lazy: async () => ({ Component: (await import("./pages/Online/Worship")).default }),
          },
          {
            path: "dawnQT",
            lazy: async () => ({ Component: (await import("./pages/Online/DawnQT")).default }),
          },
          {
            path: "prayON",
            lazy: async () => ({ Component: (await import("./pages/Online/PrayON")).default }),
          },
          {
            path: "meditationON/:postID",
            lazy: async () => {
              const [m, l] = await Promise.all([
                import("./pages/Online/MeditationON/MeditationONPost"),
                import("./route/MeditationONPostLoader")
              ]);
              return { Component: m.default, loader: l.loader };
            },
          },
          {
            path: "bible291",
            lazy: async () => {
              const [m, l] = await Promise.all([
                import("./pages/Online/Bible291"),
                import("./route/Bible291Loader")
              ]);
              return { Component: m.default, loader: l.loader };
            },
          },
        ],
      },
      {
        path: "/nextgen",
        children: [
          {
            path: "preschool",
            lazy: async () => ({ Component: (await import("./pages/NextGen/Preschool")).default }),
          },
          {
            path: "elementary",
            lazy: async () => ({ Component: (await import("./pages/NextGen/Elementary")).default }),
          },
          {
            path: "youth",
            lazy: async () => ({ Component: (await import("./pages/NextGen/Youth/Youth")).default }),
          },
          {
            path: "youngadult",
            lazy: async () => ({ Component: (await import("./pages/NextGen/YoungAdult")).default }),
          },
        ],
      },
    ],
  },
  {
    element: <HeaderWrapper />,
    children: [
      {
        path: "/albums",
        lazy: async () => ({ Component: (await import("./pages/News/Albums/Albums")).default }),
      },
      {
        path: "/online/meditationON",
        lazy: async () => ({ Component: (await import("./pages/Online/MeditationON/MeditationON")).default }),
      },
    ],
  },
]);

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<FullScreenLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
