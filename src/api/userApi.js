// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const userApi = {
    getAll: (params) => {
        const url = '/admin/hr/getallmemberandcollaborator?pageNo=0&pageSize=100';
        return axiosClient.get(url, { params });
    },

    get: (id) => {
        const url = `/products/${id}`;
        return axiosClient.get(url);
    },
    createUser: (params) => {
        const url = `/admin/hr/adduser`;
        return axiosClient.post(url, params);
    },
    getUserbyId: (params) => {
        const url = `/admin/hr/getbystudentid/${params}`;
        return axiosClient.get(url);
    },
    getAllAdmin: (params) => {
        const url = '/admin/hr/headclub/getalladmin';
        return axiosClient.get(url, { params });
    },
};

export default userApi;
