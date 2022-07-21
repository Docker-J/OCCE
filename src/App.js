import { Route, Routes } from "react-router-dom";

import Main from "./components/Main";
import About from "./components/About";
import Announcement from "./components/Announcement";
import Online from "./components/Online";
import SignUp from "./components/SignUp";

import "./App.css";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
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
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/online" element={<Online />} />
          <Route path="/signup/:date" element={<SignUp />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
