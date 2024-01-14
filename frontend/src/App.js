import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import "./App.css";

import ResponsiveAppBar from "./header/ResponsiveAppBar";

import Main from "./pages/Main/Main";
import About from "./pages/AboutUs/AboutUs";

import { loader as AnnouncementsLoader } from "./route/AnnouncementsLoader";
import { loader as AnnouncementLoader } from "./route/AnnouncementLoader";
import { loader as WeeklyUpdateLoader } from "./route/WeeklyUpdateLoader";
// import { loader as meditationONLoader } from "./route/MeditationONLoader";
import { loader as MeditationONPostLoader } from "./route/MeditationONPostLoader";
import { loader as Bible291Loader } from "./route/Bible291Loader";
import { loader as AlbumPhotosLoader } from "./route/AlbumPhotosLoader";
import Footer from "./header/Footer";

// import NewComers from "./pages/NewComers";

// import Community from "./pages/Community";
// import MeditationON from "./pages/Online/MeditationON";
// import MeditationONPost from "./pages/Online/MeditationONPost";
// import PrayON from "./pages/Online/PrayON";
// import Worship from "./pages/Online/Worship";
// import SundayService from "./pages/Online/SundayService";
// import Sermon from "./pages/Online/Sermon";

// const Main = lazy(() => import("./pages/Main/Main"));
// const About = lazy(() => import("./pages/About/About"));

// News
const Announcements = lazy(() =>
  import("./pages/News/Announcements/Announcements")
);
const Announcement = lazy(() =>
  import("./pages/News/Announcements/Announcement")
);
const WeeklyUpdate = lazy(() =>
  import("./pages/News/WeeklyUpdate/WeeklyUpdate")
);
const NewComers = lazy(() => import("./pages/News/NewComers/NewComers"));
const Photos = lazy(() => import("./pages/News/Photos/Photos"));
const AlbumPhotos = lazy(() => import("./pages/News/Photos/AlbumPhotos"));

// Online
const SundayService = lazy(() => import("./pages/Online/SundayService"));
const Sermon = lazy(() => import("./pages/Online/Sermon"));
const Worship = lazy(() => import("./pages/Online/Worship"));
const DawnQT = lazy(() => import("./pages/Online/DawnQT"));
const PrayON = lazy(() => import("./pages/Online/PrayON"));
const MeditationON = lazy(() =>
  import("./pages/Online/MeditationON/MeditationON")
);
const MeditationONPost = lazy(() =>
  import("./pages/Online/MeditationON/MeditationONPost")
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

const HeaderFooterWrapper = () => {
  return (
    <>
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
      <ResponsiveAppBar />
      <Outlet />
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
        loader: AnnouncementsLoader,
      },
      {
        path: "/announcements/:announcementID",
        element: <Announcement />,
        loader: AnnouncementLoader,
      },
      {
        path: "/weeklyupdate/:date?",
        element: <WeeklyUpdate />,
        loader: WeeklyUpdateLoader,
        shouldRevalidate: () => false,
      },
      // {
      //   path: "/photos",
      //   element: <Photos />,
      // },
      {
        path: "/photos/:albumID",
        element: <AlbumPhotos />,
        loader: AlbumPhotosLoader,
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
            loader: MeditationONPostLoader,
          },
          {
            path: "bible291",
            element: <Bible291 />,
            loader: Bible291Loader,
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
        path: "/photos",
        element: <Photos />,
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
