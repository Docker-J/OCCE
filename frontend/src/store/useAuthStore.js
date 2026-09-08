import { create } from "zustand";

export const TOKEN_TIME_OUT = 3600 * 1000;

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const useAuthStore = create((set) => ({
  authenticated: false,
  admin: false,
  isLeader: false,
  accessToken: null,
  idToken: null,
  userProfile: null,
  expireTime: null,

  setToken: (payload) => {
    const idPayload = payload.idToken ? parseJwt(payload.idToken) : null;
    const userProfile = idPayload
      ? {
          name: idPayload.name || "",
          phoneNumber: idPayload.phone_number || "",
          email: idPayload.email || "",
          sub: idPayload.sub || "",
        }
      : null;

    set({
      authenticated: true,
      admin: payload.groups?.some((group) => group === "Staff") || false,
      isLeader:
        payload.groups?.some(
          (group) => group === "Staff" || group === "GardenKeeper"
        ) || false,
      accessToken: payload.accessToken,
      idToken: payload.idToken || null,
      userProfile: userProfile,
      expireTime: new Date().getTime() + TOKEN_TIME_OUT,
    });
  },

  deleteToken: () =>
    set({
      authenticated: false,
      admin: false,
      isLeader: false,
      accessToken: null,
      idToken: null,
      userProfile: null,
      expireTime: null,
    }),
}));

export default useAuthStore;
