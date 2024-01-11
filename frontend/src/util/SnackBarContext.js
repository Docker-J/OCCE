import { createContext } from "react";

// 현재 open된 modal들을 나타냄.
export const SnackBarStateContext = createContext({});

// modal을 열고 닫는 함수
export const SnackBarDispatchContext = createContext({
  open: () => {},
  close: () => {},
});
