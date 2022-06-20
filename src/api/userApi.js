// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const userApi = {
    getAll: (params) => {
        const url = '/admin/hr/getallmemberandcollaborator?pageNo=0&pageSize=100';
        return axiosClient.get(url, { params });
    },
    getAllMemberAndAdmin: (params) => {
        const url = '/admin/hr/viceheadclub/getallusers';
        return axiosClient.get(url, { params });
    },
    getAllUserBySemester: (params) => {
        const url = `/admin/hr/viceheadclub/getmembers/semester?semester=${params}`;
        return axiosClient.get(url);
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
    getAllAdminBySemester: (params) => {
        const url = `/admin/hr/viceheadclub/getadmins/semester?semester=${params}`;
        return axiosClient.get(url);
    },
    deleteAdmin: (id) => {
        const url = `/admin/hr/deleteadmin/${id}`;
        return axiosClient.put(url);
    },
    updateUser: (params) => {
        const url = `/admin/hr/updateuser/${params.setId}`;
        return axiosClient.put(url, params);
    },
    updateUserStatus: (params) => {
        const url = `/admin/hr/updatestatus?semester=${params.semester}&studentId=${params.studentId}`;
        // const url = `/admin/hr/updatestatus`;
        return axiosClient.put(url);
    },
    importListFromFile: (params) => {
        const url = `/admin/hr/users/import`;
        return axiosClient.post(url, params);
    },
    exportUserListToExcel: (params) => {
        const url = `/admin/hr/users/export`;
        return axiosClient.get(url);
    },
};
export default userApi;
