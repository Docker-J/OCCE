import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import store from "./store";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { createTheme, ThemeProvider } from "@mui/material";

import ModalsProvider from "./util/ModalsProvider";
import Modals from "./util/Modals";
import SnackbarProvider from "./util/SnackBarProvider";
import SnackBar from "./util/SnackBar";

const container = document.getElementById("root");
const root = createRoot(container);

const theme = createTheme({
  palette: {
    primary: {
      light: "#f79633",
      main: "#f57c00",
      // dark: "#ab5600",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffffff",
    },
  },
  typography: {
    fontFamily: "NanumSquareNeoVariable",
  },
});

root.render(
  // <React.StrictMode>
  <CookiesProvider>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <ModalsProvider>
            <App />
            <Modals />
          </ModalsProvider>
          <SnackBar />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  </CookiesProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
