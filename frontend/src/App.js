import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import "./App.css";

import ResponsiveAppBar from "./header/ResponsiveAppBar";

import Main from "./pages/Main/Main";
import About from "./pages/About/About";
// import WeeklyUpdate from "./pages/WeeklyUpdate/WeeklyUpdate";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppBarWrapper />}>
      <Route path="/" element={<Main />} />
      <Route path="/aboutus" element={<About />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route
        exact
        path="/announcements/announcement/"
        element={<Announcement />}
      />
      <Route path="/weeklyupdate" element={<WeeklyUpdate />} />
      <Route path="/newcomers" element={<NewComers />} />

      <Route path="/community/smallgroup" element={<SmallGroup />} />
      <Route path="/community/ministry" element={<Ministry />} />

      <Route path="/online/sundayservice" element={<SundayService />} />
      <Route path="/online/sermon" element={<Sermon />} />
      <Route path="/online/worship" element={<Worship />} />
      <Route path="/online/prayON" element={<PrayON />} />
      <Route path="/online/meditationON" element={<MeditationON />} />
      <Route exact path="/meditationON/post/" element={<MeditationONPost />} />

      <Route path="/nextgen/preschool" element={<Preschool />} />
      <Route path="/nextgen/elementary" element={<Elementary />} />
      <Route path="/nextgen/youth" element={<Youth />} />
      <Route path="/nextgen/youngadult" element={<YoungAdult />} />
    </Route>
  )
);

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
