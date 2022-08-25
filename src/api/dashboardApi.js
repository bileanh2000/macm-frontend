import axios from 'axios';
import axiosClient from './axiosClient';

const dashboardApi = {
    getAttendanceReportBySemester: (semester, month) => {
        const url = `/admin/dashboard/attendance?semester=${semester}&month=${month}`;
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
    getFeeReportBySemester: (semester) => {
        const url = `/admin/dashboard/fee?semester=${semester}`;
        return axiosClient.get(url);
    },

    getAllUpcomingActivities: (filterType) => {
        const url = `/admin/dashboard/getallupcomingactivities/${filterType}`;
        return axiosClient.get(url);
    },

    getActivityReport: (semester) => {
        const url = `/admin/dashboard/activityreport?semester=${semester}`;
        return axiosClient.get(url);
    },
};

export default dashboardApi;
