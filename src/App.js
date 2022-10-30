import { Route, Routes } from "react-router-dom";

import Main from "./components/Main";
import About from "./components/About";
import WeeklyUpdate from "./components/WeeklyUpdate";
import SignUp from "./components/SignUp";

import "./App.css";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { createTheme, ThemeProvider } from "@mui/material";
import Community from "./components/Community";
import Announcements from "./components/Announcements";
import Announcement from "./components/Announcement";
import MeditationON from "./components/MeditationON";
import MeditationONPost from "./components/MeditationONPost";
import PrayON from "./components/PrayON";
import Worship from "./components/Worship";
import SundayService from "./components/SundayService";
import Sermon from "./components/Sermon";

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <ResponsiveAppBar />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route
            exact
            path="/announcements/announcement/"
            element={<Announcement />}
          />
          <Route path="/weeklyupdate" element={<WeeklyUpdate />} />
          <Route path="/online/sundayservice" element={<SundayService />} />
          <Route path="/online/sermon" element={<Sermon />} />
          <Route path="/online/worship" element={<Worship />} />
          <Route path="/online/prayON" element={<PrayON />} />
          <Route path="/online/meditationON" element={<MeditationON />} />
          <Route
            exact
            path="/meditationON/post/"
            element={<MeditationONPost />}
          />
          <Route path="/community" element={<Community />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
