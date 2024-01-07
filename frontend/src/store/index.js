import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./Auth";
import modalReducer from "./modalSlice";

export default configureStore({
  reducer: {
    authToken: tokenReducer,
    modal: modalReducer,
  },
});
