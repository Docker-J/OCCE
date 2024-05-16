import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const RequestManager = () => {
  const accessToken = useSelector((state) => state.authToken?.accessToken);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((request) => {
      request.headers.Authorization = `Bearer ${accessToken}`;
      console.log(request.headers.Authorization);

      return request;
    });
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);
};

export default RequestManager;
