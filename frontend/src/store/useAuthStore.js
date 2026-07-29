import { create } from "zustand";

export const TOKEN_TIME_OUT = 3600 * 1000;

const useAuthStore = create((set) => ({
  authenticated: false,
  admin: false,
  isLeader: false,
  accessToken: null,
  expireTime: null,

  setToken: (payload) =>
    set({
      authenticated: true,
      admin: payload.groups.some((group) => group === "Staff"),
      isLeader: payload.groups.some(
        (group) => group === "Staff" || group === "GardenKeeper"
      ),
      accessToken: payload.accessToken,
      expireTime: new Date().getTime() + TOKEN_TIME_OUT,
    }),

  deleteToken: () =>
    set({
      authenticated: false,
      admin: false,
      isLeader: false,
      accessToken: null,
      expireTime: null,
    }),
}));

export default useAuthStore;
