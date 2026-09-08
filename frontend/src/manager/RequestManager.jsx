import axios from "axios";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";

const RequestManager = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const idToken = useAuthStore((state) => state.idToken);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((request) => {
      const tokenToSend = idToken || accessToken;
      if (tokenToSend) {
        request.headers.Authorization = `Bearer ${tokenToSend}`;
      }

      return request;
    });
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken, idToken]);
};

export default RequestManager;
