import axiosClient from './axiosClient';

const notificationApi = {
    checkPaymentStatus: (studentId) => {
        const url = `/notification/checkpaymentstatus/${studentId}`;
        return axiosClient.get(url);
    },

    getAllNotification: (studentId, pageNo) => {
        const url = `notification/getallnotificationbystudentid/${studentId}`;
        return axiosClient.get(url, {
            params: {
                pageNo: pageNo,
                pageSize: '5',
            },
        });
    },

    markNotificationAsRead: (notificationId, studentId) => {
        const url = `/notification/marknotificationasread/${notificationId}/${studentId}`;
        return axiosClient.put(url);
    },
    markAllNotificationAsRead: (studentId) => {
        const url = `/notification/markallnotificationasread/${studentId}`;
        return axiosClient.put(url);
    },

    getAllNotificationUnread: (studentId, pageNo) => {
        const url = `notification/getallunreadnotificationbystudentid/${studentId}`;
        return axiosClient.get(url, {
            params: {
                pageNo: pageNo,
                pageSize: '5',
            },
        });
    },
    // /api/notification/getallunreadnotificationbystudentid/{studentId}

    // /api/notification/marknotificationasread/{notificationId}/{studentId}
};
export default notificationApi;
