import axiosClient from './axiosClient';

const notificationApi = {
    checkPaymentStatus: (studentId) => {
        const url = `/notification/checkpaymentstatus/${studentId}`;
        return axiosClient.get(url);
    },
};
export default notificationApi;
