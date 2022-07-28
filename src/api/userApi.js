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
    deleteAdmin: (params) => {
        const url = `/admin/hr/deleteadmin/${params.studentId}?semester=${params.semester}`;
        return axiosClient.put(url);
    },
    updateUser: (params) => {
        const url = `/admin/hr/updateuser/${params.setId}`;
        return axiosClient.put(url, params);
    },
    updateUserStatus: (params) => {
        const url = `/admin/hr/updatestatus?semester=${params.semester}&studentId=${params.studentId}`;
        // const url = `/admin/hr/updatestatus?semester=Summer2022&studentId=${params}`;
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
    searchByMultipleField: (params, data) => {
        const url = `/admin/hr/viceheadclub/member/search`;
        return axiosClient.get(url, data, {
            params: {
                dateFrom: params.startDate,
                dateTo: params.endDate,
                email: params.email,
                gender: params.gender,
                generation: params.generation,
                isActive: params.isActive,
                name: params.name,
                roleId: params.roleId,
                studentId: params.studentId,
            },
        });
    },
    generateQrCode: (params) => {
        const url = `/admin/hr/member/qrcode/create`;
        return axiosClient.post(
            url,
            {
                email: params.email,
                studentId: params.studentId,
                studentName: params.name,
            },
            null,
        );
    },
    getAllMember: () => {
        const url = '/admin/hr/getallmemberandcollaborator';
        return axiosClient.get(url);
    },
    getAllAttendanceStatus: (studentId) => {
        const url = `/admin/hr/getallattendancestatusofuser/${studentId}`;
        return axiosClient.get(url);
    },
};
export default userApi;
