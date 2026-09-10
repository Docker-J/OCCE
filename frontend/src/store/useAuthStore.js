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

const getInitialSessionHint = () => {
  try {
    return (
      typeof window !== "undefined" &&
      localStorage.getItem("hasSession") === "true"
    );
  } catch {
    return false;
  }
};

const hasSessionHint = getInitialSessionHint();

const useAuthStore = create((set) => ({
  authenticated: false,
  // If there's no session hint, the user is an anonymous visitor: initialize immediately!
  authInitialized: !hasSessionHint,
  admin: false,
  isLeader: false,
  isRemembered: false,
  accessToken: null,
  idToken: null,
  userProfile: null,
  expireTime: null,

  setToken: (payload) => {
    try {
      localStorage.setItem("hasSession", "true");
    } catch {}

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
      authInitialized: true,
      admin: payload.groups?.some((group) => group === "Staff") || false,
      isLeader:
        payload.groups?.some(
          (group) => group === "Staff" || group === "GardenKeeper"
        ) || false,
      isRemembered: payload.remember ?? false,
      accessToken: payload.accessToken,
      idToken: payload.idToken || null,
      userProfile: userProfile,
      expireTime: new Date().getTime() + TOKEN_TIME_OUT,
    });
  },

  deleteToken: () => {
    try {
      localStorage.removeItem("hasSession");
    } catch {}

    set({
      authenticated: false,
      authInitialized: true,
      admin: false,
      isLeader: false,
      isRemembered: false,
      accessToken: null,
      idToken: null,
      userProfile: null,
      expireTime: null,
    });
  },
}));

export default useAuthStore;
