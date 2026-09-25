/**
 * @file RequestManager.jsx
 * @description Global Axios Request & Response interceptor manager.
 * - Automatically injects Bearer authorization token into outgoing requests.
 * - Catches 401 Unauthorized errors and performs transparent silent token renewal
 *   and automatic request retry.
 */

import axios from "axios";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { performTokenRefresh } from "../util/authRefresh";

const RequestManager = () => {
  useEffect(() => {
    // 1. Request Interceptor: Attach current bearer token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const { idToken, accessToken } = useAuthStore.getState();
        const tokenToSend = idToken || accessToken;
        if (tokenToSend && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${tokenToSend}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Response Interceptor: Intercept 401, refresh token, and seamlessly retry
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Skip interceptor if:
        // - There is no HTTP response object
        // - Status is not 401
        // - Request was already retried once (_retry flag prevents infinite loops)
        // - Request was itself an authentication lifecycle endpoint
        if (
          !error.response ||
          error.response.status !== 401 ||
          !originalRequest ||
          originalRequest._retry ||
          originalRequest.url?.includes("/api/user/sign-in") ||
          originalRequest.url?.includes("/api/user/refresh-sign-in") ||
          originalRequest.url?.includes("/api/user/sign-out")
        ) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          // Singleton refresh call (concurrent 401s share the same promise)
          const result = await performTokenRefresh();
          const tokenToSend = result.idToken || result.accessToken;
          if (tokenToSend) {
            originalRequest.headers.Authorization = `Bearer ${tokenToSend}`;
          }
          // Transparently re-execute the original request with the fresh token
          return axios(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return null;
};

export default RequestManager;
