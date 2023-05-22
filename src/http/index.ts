import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const baseURL = 'http://localhost:8080';

const http = axios.create({
  baseURL,
});

http.interceptors.request.use(
  async (config: any) => {
    const access = localStorage.getItem('access');
    if (access) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;

      return http
        .post('/auth/refresh', {
          token: localStorage.getItem('refresh'),
        })
        .then((res) => {
          localStorage.setItem('access', res.data.token);
          http.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
          return http(originalRequest);
        })
        .catch(() => {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('userData');
        });
    }
    return Promise.reject(error);
  },
);

export { http };
