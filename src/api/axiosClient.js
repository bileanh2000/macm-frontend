// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';
import ForbiddenPage from 'src/Pages/ForbiddenPage';
import { Navigate, useNavigate } from 'react-router-dom';
// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-config` for the full list of configs
const axiosClient = axios.create({
    baseURL: 'https://capstone-project-macm.herokuapp.com/api',
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: (params) => queryString.stringify(params),
    body: (params) => JSON.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }

        return response;
    },
    (error) => {
        // Handle errors
        if (error.response.status === 403) {
            // redirect to 403 page
            // window.location = '/forbidden';
            // <Navigate to="/403" />;
        }
        // throw error;
    },
);
export default axiosClient;
