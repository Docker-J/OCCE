import { Route, Routes } from "react-router-dom";

import Main from "./pages/Main/Main";
import About from "./pages/About/About";
import WeeklyUpdate from "./pages/WeeklyUpdate/WeeklyUpdate";
import NewComers from "./pages/NewComers";
import SignUp from "./components/SignUp";

import "./App.css";
import ResponsiveAppBar from "./header/ResponsiveAppBar";
import { createTheme, ThemeProvider } from "@mui/material";
import Community from "./components/Community";
import Announcements from "./pages/Announcements/Announcements";
import Announcement from "./components/Announcement/Announcement";
import MeditationON from "./pages/Online/MeditationON";
import MeditationONPost from "./pages/Online/MeditationONPost";
import PrayON from "./pages/Online/PrayON";
import Worship from "./pages/Online/Worship";
import SundayService from "./pages/Online/SundayService";
import Sermon from "./pages/Online/Sermon";

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
          <Route path="/newcomers" element={<NewComers />} />
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
