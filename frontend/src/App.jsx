import { Outlet, createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { lazy, Suspense } from "react";

import "./App.css";

import ResponsiveAppBar from "./header/ResponsiveAppBar";

import Footer from "./header/Footer";
import NotificationManager from "./manager/NotificationManager";
import UserManager from "./manager/UserManager";
import RequestManager from "./manager/RequestManager";
import { ErrorBoundary } from "react-error-boundary";

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

const Main = lazy(() => import("./pages/Main/Main"));

const About = lazy(() => import("./pages/AboutUs/AboutUs"));

// News
const Announcements = lazy(() =>
  import("./pages/News/Announcements/Announcements"),
);
const Announcement = lazy(() =>
  import("./pages/News/Announcements/Announcement"),
);
const WeeklyUpdate = lazy(() =>
  import("./pages/News/WeeklyUpdate/WeeklyUpdate"),
);
const Columns = lazy(() => import("./pages/News/Columns/Columns"));
const Column = lazy(() => import("./pages/News/Columns/Column"));
const Schedules = lazy(() => import("./pages/News/Schedules/Schedules"));
const NewComers = lazy(() => import("./pages/News/NewComers/NewComers"));
const Albums = lazy(() => import("./pages/News/Albums/Albums"));
const Album = lazy(() => import("./pages/News/Albums/Album"));

// Online
const SundayService = lazy(() => import("./pages/Online/SundayService"));
const Sermon = lazy(() => import("./pages/Online/Sermon"));
const Worship = lazy(() => import("./pages/Online/Worship"));
const DawnQT = lazy(() => import("./pages/Online/DawnQT"));
const PrayON = lazy(() => import("./pages/Online/PrayON"));
const MeditationON = lazy(() =>
  import("./pages/Online/MeditationON/MeditationON"),
);
const MeditationONPost = lazy(() =>
  import("./pages/Online/MeditationON/MeditationONPost"),
);
const Bible291 = lazy(() => import("./pages/Online/Bible291"));

// Community
const SmallGroup = lazy(() => import("./pages/Community/SmallGroup"));
const Ministry = lazy(() => import("./pages/Community/Ministry"));

// NextGen
const Preschool = lazy(() => import("./pages/NextGen/Preschool"));
const Elementary = lazy(() => import("./pages/NextGen/Elementary"));
const Youth = lazy(() => import("./pages/NextGen/Youth/Youth"));
const YoungAdult = lazy(() => import("./pages/NextGen/YoungAdult"));

const Managers = () => {
  return (
    <>
      <UserManager />
      <NotificationManager />
      <RequestManager />
    </>
  );
};

const HeaderFooterWrapper = () => {
  return (
    <>
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
        element: <Main />,
      },
      {
        path: "/aboutus",
        element: <About />,
      },
      {
        path: "/announcements",
        element: <Announcements />,
        loader: async ({ request }) => {
          const { loader } = await import("./route/AnnouncementsLoader");
          return loader({ request });
        },
      },
      {
        path: "/announcements/:announcementID",
        element: <Announcement />,
        loader: async ({ params }) => {
          const { loader } = await import("./route/AnnouncementLoader");
          return loader({ params });
        },
      },
      {
        path: "/weeklyupdate/:date?",
        element: <WeeklyUpdate />,
        loader: async ({ params }) => {
          const { loader } = await import("./route/WeeklyUpdateLoader");
          return loader({ params });
        },
        shouldRevalidate: () => false,
      },
      // {
      //   path: "/albums",
      //   element: <Albums />,
      // },
      {
        path: "/albums/:albumID",
        element: <Album />,
        loader: async ({ params }) => {
          const { loader } = await import("./route/AlbumLoader");
          return loader({ params });
        },
      },
      {
        path: "/columns",
        element: <Columns />,
        loader: async ({ request }) => {
          const { loader } = await import("./route/ColumnsLoader");
          return loader({ request });
        },
      },
      {
        path: "/columns/:columnID",
        element: <Column />,
        loader: async ({ params }) => {
          const { loader } = await import("./route/ColumnLoader");
          return loader({ params });
        },
      },
      {
        path: "/schedules",
        element: <Schedules />,
        loader: async () => {
          const { loader } = await import("./route/SchedulesLoader");
          return loader();
        },
      },
      {
        path: "/newcomers",
        element: <NewComers />,
      },
      {
        path: "/community",
        children: [
          {
            path: "smallgroup",
            element: <SmallGroup />,
          },
          {
            path: "ministry",
            element: <Ministry />,
          },
        ],
      },
      {
        path: "/online",
        children: [
          {
            path: "sundayservice",
            element: <SundayService />,
          },
          {
            path: "sermon",
            element: <Sermon />,
          },
          {
            path: "worship",
            element: <Worship />,
          },
          {
            path: "dawnQT",
            element: <DawnQT />,
          },
          {
            path: "prayON",
            element: <PrayON />,
          },
          // {
          //   path: "/online/meditationON",
          //   element: <MeditationON />,
          // },
          {
            path: "meditationON/:postID",
            element: <MeditationONPost />,
            loader: async ({ params }) => {
              const { loader } = await import("./route/MeditationONPostLoader");
              return loader({ params });
            },
          },
          {
            path: "bible291",
            element: <Bible291 />,
            loader: async () => {
              const { loader } = await import("./route/Bible291Loader");
              return loader();
            },
          },
        ],
      },
      {
        path: "/nextgen",
        children: [
          {
            path: "preschool",
            element: <Preschool />,
          },
          {
            path: "elementary",
            element: <Elementary />,
          },
          {
            path: "youth",
            element: <Youth />,
          },
          {
            path: "youngadult",
            element: <YoungAdult />,
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
        element: <Albums />,
      },
      {
        path: "/online/meditationON",
        element: <MeditationON />,
      },
    ],
  },
]);

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
