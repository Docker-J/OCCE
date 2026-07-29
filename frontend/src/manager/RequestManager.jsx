import axios from "axios";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";

const RequestManager = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((request) => {
      if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
      }

      return request;
    });
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);
};

export default RequestManager;
