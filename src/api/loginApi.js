import axios from 'axios';
import axiosClient from './axiosClient';

const loginApi = {
    login: () => {
        const url = `/login`;
        return axiosClient.get(url);
    },
};

export default loginApi;
