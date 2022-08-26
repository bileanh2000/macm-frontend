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
        const url = `/admin/hr/updateuser/${params.studentId}`;
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
        return axiosClient.post(url, data, {
            params: {
                email: params.email,
                gender: params.gender,
                generation: params.generation,
                isActive: params.isActive,
                name: params.name,
                roleId: params.roleId,
                studentId: params.studentId,
                months: params.month,
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
        const url = '/admin/hr/getallactivememberandcollaborator';
        return axiosClient.get(url);
    },
    getAllAttendanceStatus: (studentId) => {
        const url = `/admin/hr/getallattendancestatusofuser/${studentId}`;
        return axiosClient.get(url);
    },

    getAllAttendanceStatusBySemester: (studentId, semester, month) => {
        const url = `/admin/headtechnique/getallattendancestatusbystudentidandsemester/${studentId}?semester=${semester}&month=${month}`;
        return axiosClient.get(url);
    },
    getAllRole: () => {
        const url = `/role/getroles`;
        return axiosClient.get(url);
    },

    getAllGen: () => {
        const url = `/admin/hr/getallgen`;
        return axiosClient.get(url);
    },

    updateStatusByUser: (params) => {
        const url = `/admin/hr/updatestatusbymember`;
        return axiosClient.put(url, null, { params });
    },
    getStatusWhenStartSemester: (studentId) => {
        const url = `/admin/hr/membersemesterinfor?studentId=${studentId}`;
        return axiosClient.get(url);
    },

    checkAttendanceStatusByStudentId: (studentId) => {
        const url = `/admin/headtechnique/checkattendancestatusbystudentid/${studentId}`;
        return axiosClient.get(url);
    },
};
export default userApi;
