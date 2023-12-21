import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import "./App.css";

import ResponsiveAppBar from "./header/ResponsiveAppBar";

import Main from "./pages/Main/Main";
import About from "./pages/AboutUs/AboutUs";
import { loader as weeklyUpdateLoader } from "./route/WeeklyUpdateLoader";
import { loader as meditationONLoader } from "./route/MeditationONLoader";
import { loader as MeditationONPostLoader } from "./route/MeditationONPostLoader";
import { loader as AlbumPhotosLoader } from "./route/AlbumPhotosLoader";
import Footer from "./header/Footer";

// import NewComers from "./pages/NewComers";

// import Community from "./pages/Community";
// import Announcement from "./components/Announcement/Announcement";
// import MeditationON from "./pages/Online/MeditationON";
// import MeditationONPost from "./pages/Online/MeditationONPost";
// import PrayON from "./pages/Online/PrayON";
// import Worship from "./pages/Online/Worship";
// import SundayService from "./pages/Online/SundayService";
// import Sermon from "./pages/Online/Sermon";

// const Main = lazy(() => import("./pages/Main/Main"));
// const About = lazy(() => import("./pages/About/About"));

//Announcements
// const Announcements = lazy(() =>
//   import("./pages/News/Announcements/Announcements")
// );
// const Announcement = lazy(() =>
//   import("./components/Announcement/Announcement")
// );
const Announcements = lazy(() =>
  import("./pages/News/Announcements/Announcements")
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
const PrayON = lazy(() => import("./pages/Online/PrayON"));
const MeditationON = lazy(() =>
  import("./pages/Online/MeditationON/MeditationON")
);
const MeditationONPost = lazy(() =>
  import("./pages/Online/MeditationON/MeditationONPost")
);

// Community
const SmallGroup = lazy(() => import("./pages/Community/SmallGroup"));
const Ministry = lazy(() => import("./pages/Community/Ministry"));

// NextGen
const Preschool = lazy(() => import("./pages/NextGen/Preschool"));
const Elementary = lazy(() => import("./pages/NextGen/Elementary"));
const Youth = lazy(() => import("./pages/NextGen/Youth/Youth"));
const YoungAdult = lazy(() => import("./pages/NextGen/YoungAdult"));

const theme = createTheme({
  palette: {
    primary: {
      light: "#f79633",
      main: "#f57c00",
      dark: "#ab5600",
    },
    secondary: {
      main: "#ffffff",
    },
  },
  typography: {
    fontFamily: "nanumsquare",
  },
});

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
        // style={{
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   flexDirection: "column",
        // }}
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
      },
      {
        path: "/weeklyupdate/:date?",
        element: <WeeklyUpdate />,
        loader: weeklyUpdateLoader,
        shouldRevalidate: () => false,
      },
      {
        path: "/photos",
        element: <Photos />,
      },
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
        path: "/community/smallgroup",
        element: <SmallGroup />,
      },
      {
        path: "/community/ministry",
        element: <Ministry />,
      },
      {
        path: "/online/sundayservice",
        element: <SundayService />,
      },
      {
        path: "/online/sermon",
        element: <Sermon />,
      },
      {
        path: "/online/worship",
        element: <Worship />,
      },
      {
        path: "/online/prayON",
        element: <PrayON />,
      },
      // {
      //   path: "/online/meditationON",
      //   element: <MeditationON />,
      // },
      {
        path: "/online/meditationON/:postID",
        element: <MeditationONPost />,
        loader: MeditationONPostLoader,
      },
      {
        path: "/nextgen/preschool",
        element: <Preschool />,
      },
      {
        path: "/nextgen/elementary",
        element: <Elementary />,
      },
      {
        path: "/nextgen/youth",
        element: <Youth />,
      },
      {
        path: "/nextgen/youngadult",
        element: <YoungAdult />,
      },
    ],
  },
  {
    element: <HeaderWrapper />,
    children: [
      {
        path: "/online/meditationON",
        element: <MeditationON />,
      },
    ],
  },
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
