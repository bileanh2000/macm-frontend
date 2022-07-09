import axios from 'axios';
import axiosClient from './axiosClient';

const dashboardApi = {
    getAttendanceReportBySemester: (semester) => {
        const url = `/admin/dashboard/attendance?semester=${semester}`;
        return axiosClient.get(url);
    },
    getMemberReport: () => {
        const url = `/admin/dashboard/collaborator`;
        return axiosClient.get(url);
    },
    getUserStatus: () => {
        const url = `/admin/dashboard/member/status`;
        return axiosClient.get(url);
    },
};

export default dashboardApi;
