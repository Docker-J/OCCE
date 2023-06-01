import { createSlice } from "@reduxjs/toolkit";

export const TOKEN_TIME_OUT = 3600 * 1000;

export const tokenSlice = createSlice({
  name: "authToken",
  initialState: {
    authenticated: false,
    admin: false,
    accessToken: null,
    expireTime: null,
  },
  reducers: {
    SET_TOKEN: (state, action) => {
      state.authenticated = true;
      state.admin = action.payload.groups.some((group) => {
        return group === "Staff";
      });
      state.accessToken = action.payload.accessToken;
      state.expireTime = new Date().getTime() + TOKEN_TIME_OUT;
    },
    DELETE_TOKEN: (state) => {
      state.authenticated = false;
      state.admin = false;
      state.accessToken = null;
      state.expireTime = null;
    },
  },
});

export const { SET_TOKEN, DELETE_TOKEN } = tokenSlice.actions;

export default tokenSlice.reducer;
