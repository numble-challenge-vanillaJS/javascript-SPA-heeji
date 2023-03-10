import axios from 'axios';

export namespace apiService {
  const axiosInstance = axios.create({
    baseURL: 'http://43.201.103.199/',
  });

  export async function get<T>(url: string, params: any = null) {
    return axiosInstance.get<T>(url, { ...params });
  }

  export async function post<T>(url: string, data: any) {
    return axiosInstance.post<T>(url, data);
  }

  export async function patch<T>(url: string, data: any) {
    return axiosInstance.patch<T>(url, data);
  }

  export async function _delete<T>(url: string) {
    return axiosInstance.delete<T>(url);
  }
}
