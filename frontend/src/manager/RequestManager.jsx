import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const RequestManager = () => {
  const accessToken = useSelector((state) => state.authToken?.accessToken);

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
