import axios from 'axios';

export namespace apiService {
  const axiosInstance = axios.create({
    baseURL: 'http://43.201.103.199/',
  });

  export async function get<T>(url: string, params: any = null) {
    return axiosInstance.get<T>(url, { ...params });
  }
}
