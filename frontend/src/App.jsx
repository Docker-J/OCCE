import { Outlet, createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { lazy, Suspense } from "react";

import "./App.css";

import ResponsiveAppBar from "./header/ResponsiveAppBar";

import Main from "./pages/Main/Main";

import Footer from "./header/Footer";
import NotificationManager from "./manager/NotificationManager";
import UserManager from "./manager/UserManager";
import RequestManager from "./manager/RequestManager";

// a function to retry loading a chunk to avoid chunk load error for out of date code
const lazyRetry = function(componentImport, name) {
  return new Promise((resolve, reject) => {
    // check if the window has already been refreshed
    const hasRefreshed = JSON.parse(
      window.sessionStorage.getItem(`retry-${name}-refreshed`) || "false"
    );
    // try to import the component
    componentImport()
      .then((component) => {
        window.sessionStorage.setItem(`retry-${name}-refreshed`, "false"); // success so reset the refresh
        resolve(component);
      })
      .catch((error) => {
        if (!hasRefreshed) {
          // not been refreshed yet
          window.sessionStorage.setItem(`retry-${name}-refreshed`, "true"); // we are now going to refresh
          return window.location.reload(); // refresh the page
        }
        reject(error); // Default error behaviour as already tried refresh
      });
  });
};

const About = lazy(() =>
  lazyRetry(() => import("./pages/AboutUs/AboutUs"), "About")
);

// News
const Announcements = lazy(() =>
  lazyRetry(
    () => import("./pages/News/Announcements/Announcements"),
    "Announcements"
  )
);
const Announcement = lazy(() =>
  lazyRetry(
    () => import("./pages/News/Announcements/Announcement"),
    "Announcement"
  )
);
const WeeklyUpdate = lazy(() =>
  lazyRetry(
    () => import("./pages/News/WeeklyUpdate/WeeklyUpdate"),
    "WeeklyUpdate"
  )
);
const Columns = lazy(() =>
  lazyRetry(() => import("./pages/News/Columns/Columns"), "Columns")
);
const Column = lazy(() =>
  lazyRetry(() => import("./pages/News/Columns/Column"), "Column")
);
const Schedules = lazy(() =>
  lazyRetry(() => import("./pages/News/Schedules/Schedules"), "Schedules")
);
const NewComers = lazy(() =>
  lazyRetry(() => import("./pages/News/NewComers/NewComers"), "NewComers")
);
const Albums = lazy(() =>
  lazyRetry(() => import("./pages/News/Albums/Albums"), "Albums")
);
const Album = lazy(() =>
  lazyRetry(() => import("./pages/News/Albums/Album"), "Album")
);

// Online
const SundayService = lazy(() =>
  lazyRetry(() => import("./pages/Online/SundayService"), "SundayService")
);
const Sermon = lazy(() =>
  lazyRetry(() => import("./pages/Online/Sermon"), "Sermon")
);
const Worship = lazy(() =>
  lazyRetry(() => import("./pages/Online/Worship"), "Worship")
);
const DawnQT = lazy(() =>
  lazyRetry(() => import("./pages/Online/DawnQT"), "DawnQT")
);
const PrayON = lazy(() =>
  lazyRetry(() => import("./pages/Online/PrayON"), "PrayON")
);
const MeditationON = lazy(() =>
  lazyRetry(
    () => import("./pages/Online/MeditationON/MeditationON"),
    "MeditationON"
  )
);
const MeditationONPost = lazy(() =>
  lazyRetry(
    () => import("./pages/Online/MeditationON/MeditationONPost"),
    "MeditationONPost"
  )
);
const Bible291 = lazy(() =>
  lazyRetry(() => import("./pages/Online/Bible291"), "Bible291")
);

// Community
const SmallGroup = lazy(() =>
  lazyRetry(() => import("./pages/Community/SmallGroup"), "SmallGroup")
);
const Ministry = lazy(() =>
  lazyRetry(() => import("./pages/Community/Ministry"), "Ministry")
);

// NextGen
const Preschool = lazy(() =>
  lazyRetry(() => import("./pages/NextGen/Preschool"), "Preschool")
);
const Elementary = lazy(() =>
  lazyRetry(() => import("./pages/NextGen/Elementary"), "Elementary")
);
const Youth = lazy(() =>
  lazyRetry(() => import("./pages/NextGen/Youth/Youth"), "Youth")
);
const YoungAdult = lazy(() =>
  lazyRetry(() => import("./pages/NextGen/YoungAdult"), "YoungAdult")
);

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
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
