import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";


import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import ModalsProvider from "./util/ModalsProvider";
import Modals from "./util/Modals";
import SnackbarProvider from "./util/SnackBarProvider";
import SnackBar from "./util/SnackBar";

const container = document.getElementById("root");
const root = createRoot(container);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      light: "#ff9240",
      main: "#FF6B00",
      dark: "#d95b00",
      contrastText: "#ffffff",
      red: "#ff0000",
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
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <ModalsProvider>
          <App />
          <Modals />
        </ModalsProvider>
        <SnackBar />
      </SnackbarProvider>
    </ThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
