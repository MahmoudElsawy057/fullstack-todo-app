import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config";
import { AxiosRequestConfig } from "axios";

interface IAuthenticatedQuery {
  url: string;
  queryKey: string[];
  config?: AxiosRequestConfig;
}

const useAuthenticatedQuery = ({
  url,
  queryKey,
  config,
}: IAuthenticatedQuery) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, config);
      return data;
    },
  });
};

export default useAuthenticatedQuery;
