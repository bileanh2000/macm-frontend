import axiosClient from './axiosClient';

const adminClubFeeAPI = {
    //membership api
    getListMembership: (semesterId) => {
        const url = `/admin/treasure/membership/${semesterId}`;
        return axiosClient.get(url);
    },

    updateMembership: (id, studentId) => {
        const url = `/admin/treasure/membership/update/${id}/${studentId}`;
        return axiosClient.put(url);
    },

    getSemester: () => {
        const url = '/semester/gettop3semesters';
        return axiosClient.get(url);
    },

    getCurrentSemester: () => {
        const url = '/semester/currentsemester';
        return axiosClient.get(url);
    },

    getSemesterFee: (semesterName) => {
        const url = `/admin/treasure/membership/membershipinfo/${semesterName}`;
        return axiosClient.get(url);
    },

    updateMembershipFee: (semesterId, totalAmount) => {
        const url = `admin/treasure/membership/membershipinfo/${semesterId}`;
        return axiosClient.put(url, null, {
            params: {
                amount: totalAmount,
            },
        });
    },

    getReportMembership: (id) => {
        const url = `admin/treasure/membership/getreportmembershippaymentstatus/${id}?pageNo=0&pageSize=1000&sortBy=id
        `;
        return axiosClient.get(url);
    },

    //event fee api
    getEventBySemester: (semesterId) => {
        const url = `/event/geteventsbysemester`;
        return axiosClient.get(url, { params: { semester: semesterId } });
    },

    getUserJoinEvent: (eventId) => {
        const url = `/event/headculture/getmemberjoinevent/${eventId}`;
        return axiosClient.get(url);
    },

    updateUserPayment: (id, studentId) => {
        const url = `/event/treasurer/updatemembereventpaymentstatus/${id}/${studentId}`;
        return axiosClient.put(url);
    },

    getReportEvent: (id) => {
        const url = `event/treasurer/getreportpaymentstatus/${id}`;
        return axiosClient.get(url, {
            params: {
                pageNo: 0,
                pageSize: 1000,
                sortBy: 'id',
            },
        });
    },
};

export default adminClubFeeAPI;
