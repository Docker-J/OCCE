import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import "./App.css";

import ResponsiveAppBar from "./header/ResponsiveAppBar";

import Main from "./pages/Main/Main";
import About from "./pages/About/About";
import { loader as weeklyUpdateLoader } from "./route/WeeklyUpdateLoader";
import { loader as meditationONLoader } from "./route/MeditationONLoader";
import { loader as MeditationONPostLoader } from "./route/MeditationONPostLoader";

// import NewComers from "./pages/NewComers";

// import Community from "./pages/Community";
// import Announcements from "./pages/Announcements/Announcements";
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
const Announcements = lazy(() => import("./pages/Announcements/Announcements"));
const Announcement = lazy(() =>
  import("./components/Announcement/Announcement")
);
const WeeklyUpdate = lazy(() => import("./pages/WeeklyUpdate/WeeklyUpdate"));
const NewComers = lazy(() => import("./pages/NewComers/NewComers"));

// Online
const MeditationON = lazy(() => import("./pages/Online/MeditationON"));
const MeditationONPost = lazy(() => import("./pages/Online/MeditationONPost"));
const PrayON = lazy(() => import("./pages/Online/PrayON"));
const Worship = lazy(() => import("./pages/Online/Worship"));
const SundayService = lazy(() => import("./pages/Online/SundayService"));
const Sermon = lazy(() => import("./pages/Online/Sermon"));

// Community
const SmallGroup = lazy(() => import("./pages/Community/SmallGroup"));
const Ministry = lazy(() => import("./pages/Community/Ministry"));

// NextGen
const Preschool = lazy(() => import("./pages/NextGen/Preschool"));
const Elementary = lazy(() => import("./pages/NextGen/Elementary"));
const Youth = lazy(() => import("./pages/NextGen/Youth"));
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

const AppBarWrapper = () => {
  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  );
};

// const router = createBrowserRouter(
//   <Route element={<AppBarWrapper />}>
//     <Route path="/" element={<Main />} />
//     <Route path="/aboutus" element={<About />} />
//     <Route exact path="/announcements" element={<Announcements />} />
//     <Route path="/announcements/announcement/" element={<Announcement />} />
//     <Route path="/weeklyupdate" element={<WeeklyUpdate />} />
//     <Route path="/newcomers" element={<NewComers />} />

//     <Route path="/community/smallgroup" element={<SmallGroup />} />
//     <Route path="/community/ministry" element={<Ministry />} />

//     <Route path="/online/sundayservice" element={<SundayService />} />
//     <Route path="/online/sermon" element={<Sermon />} />
//     <Route path="/online/worship" element={<Worship />} />
//     <Route path="/online/prayON" element={<PrayON />} />
//     <Route exact path="/online/meditationON" element={<MeditationON />} />
//     <Route path="/online/meditationON/post/" element={<MeditationONPost />} />

//     <Route path="/nextgen/preschool" element={<Preschool />} />
//     <Route path="/nextgen/elementary" element={<Elementary />} />
//     <Route path="/nextgen/youth" element={<Youth />} />
//     <Route path="/nextgen/youngadult" element={<YoungAdult />} />
//   </Route>
// );

const router = createBrowserRouter([
  {
    element: <AppBarWrapper />,
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
      {
        path: "/online/meditationON",
        element: <MeditationON />,
        loader: meditationONLoader,
        shouldRevalidate: () => false,
      },
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
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
