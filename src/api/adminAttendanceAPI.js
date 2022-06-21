import axiosClient from './axiosClient';

const adminAttendanceAPI = {
    getAttendanceByStudentId: (trainingScheduleId) => {
        const url = `/admin/headtechnique/checkattendance/${trainingScheduleId}`;
        return axiosClient.get(url);
    },

    takeAttendance: (studentId) => {
        const url = `/admin/headtechnique/takeattendance/${studentId}`;
        return axiosClient.put(url);
    },
};

export default adminAttendanceAPI;
