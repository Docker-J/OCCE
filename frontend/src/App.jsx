import { Outlet, createBrowserRouter, useNavigation, RouterProvider } from "react-router";
import { LinearProgress, CircularProgress, Box } from "@mui/material";
import { lazy, Suspense } from "react";

import "./App.css";

import ResponsiveAppBar from "./header/ResponsiveAppBar";

import Footer from "./header/Footer";
import { NotificationProvider } from "./context/NotificationContext";
import UserManager from "./manager/UserManager";
import RequestManager from "./manager/RequestManager";
import { ErrorBoundary } from "react-error-boundary";
import FullScreenLoading from "./common/FullScreenLoading";
import GlobalLoader from "./common/GlobalLoader";
import { lazyRetry, handleChunkReload, isChunkLoadError } from "./util/lazyRetry";

window.addEventListener("vite:preloadError", () => {
  handleChunkReload();
});

window.addEventListener("unhandledrejection", (event) => {
  if (isChunkLoadError(event?.reason)) {
    handleChunkReload();
  }
});

import ErrorFallback from "./pages/Error/ErrorFallback";
import NotFound from "./pages/Error/NotFound";

const Managers = () => {
  return (
    <>
      <UserManager />
      <RequestManager />
    </>
  );
};


const RootLayout = () => {
  return (
    <NotificationProvider>
      <GlobalLoader />
      <Managers />
      <Outlet />
    </NotificationProvider>
  );
};

const HeaderFooterWrapper = () => {
  return (
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
  );
};

const HeaderWrapper = () => {
  return (
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
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        element: <HeaderFooterWrapper />,
        children: [
      {
        path: "/",
        lazy: lazyRetry(async () => ({ Component: (await import("./pages/Main/Main")).default })),
      },
      {
        path: "/aboutus",
        lazy: lazyRetry(async () => ({ Component: (await import("./pages/AboutUs/AboutUs")).default })),
      },
      {
        path: "/announcements",
        lazy: lazyRetry(async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Announcements/Announcements"),
            import("./route/AnnouncementsLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        }),
      },
      {
        path: "/announcements/:announcementID",
        lazy: lazyRetry(async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Announcements/Announcement"),
            import("./route/AnnouncementLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        }),
      },
      {
        path: "/weeklyupdate/:date?",
        lazy: lazyRetry(async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/WeeklyUpdate/WeeklyUpdate"),
            import("./route/WeeklyUpdateLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        }),
        shouldRevalidate: () => false,
      },
      {
        path: "/albums/:albumID",
        lazy: lazyRetry(async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Albums/Album"),
            import("./route/AlbumLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        }),
      },
      {
        path: "/columns",
        lazy: lazyRetry(async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Columns/Columns"),
            import("./route/ColumnsLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        }),
      },
      {
        path: "/columns/:columnID",
        lazy: lazyRetry(async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Columns/Column"),
            import("./route/ColumnLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        }),
      },
      {
        path: "/schedules",
        lazy: lazyRetry(async () => {
          const [m, l] = await Promise.all([
            import("./pages/News/Schedules/Schedules"),
            import("./route/SchedulesLoader")
          ]);
          return { Component: m.default, loader: l.loader };
        }),
      },
      {
        path: "/newcomers",
        lazy: lazyRetry(async () => ({ Component: (await import("./pages/News/NewComers/NewComers")).default })),
      },
      {
        path: "/admin/members",
        lazy: lazyRetry(async () => ({ Component: (await import("./pages/Admin/MemberManagement")).default })),
      },
      {
        path: "/community",
        children: [
          {
            path: "smallgroup",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/Community/SmallGroup")).default })),
          },
          {
            path: "smallgroup/report",
            lazy: lazyRetry(async () => {
              const m = await import("./pages/Community/SmallGroupReport");
              return { Component: m.default, action: m.action };
            }),
          },
          {
            path: "ministry",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/Community/Ministry")).default })),
          },
        ],
      },
      {
        path: "/online",
        children: [
          {
            path: "sundayservice",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/Online/SundayService")).default })),
          },
          {
            path: "sermon",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/Online/Sermon")).default })),
          },
          {
            path: "worship",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/Online/Worship")).default })),
          },
          {
            path: "dawnQT",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/Online/DawnQT")).default })),
          },
          {
            path: "prayON",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/Online/PrayON")).default })),
          },
          {
            path: "meditationON/:postID",
            lazy: lazyRetry(async () => {
              const [m, l] = await Promise.all([
                import("./pages/Online/MeditationON/MeditationONPost"),
                import("./route/MeditationONPostLoader")
              ]);
              return { Component: m.default, loader: l.loader };
            }),
          },
          {
            path: "bible291",
            lazy: lazyRetry(async () => {
              const [m, l] = await Promise.all([
                import("./pages/Online/Bible291"),
                import("./route/Bible291Loader")
              ]);
              return { Component: m.default, loader: l.loader };
            }),
          },
        ],
      },
      {
        path: "/nextgen",
        children: [
          {
            path: "preschool",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/NextGen/Preschool")).default })),
          },
          {
            path: "elementary",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/NextGen/Elementary")).default })),
          },
          {
            path: "youth",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/NextGen/Youth/Youth")).default })),
          },
          {
            path: "youngadult",
            lazy: lazyRetry(async () => ({ Component: (await import("./pages/NextGen/YoungAdult")).default })),
          },
        ],
      },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
    {
      element: <HeaderWrapper />,
      children: [
        {
          path: "/albums",
          lazy: lazyRetry(async () => ({ Component: (await import("./pages/News/Albums/Albums")).default })),
        },
        {
          path: "/online/meditationON",
          lazy: lazyRetry(async () => ({ Component: (await import("./pages/Online/MeditationON/MeditationON")).default })),
        },
      ],
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
