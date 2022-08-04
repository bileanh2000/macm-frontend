import axios from 'axios';
import axiosClient from './axiosClient';

const adminAttendanceAPI = {
    checkAttendanceByScheduleId: (trainingScheduleId) => {
        const url = `/admin/headtechnique/checkattendance/${trainingScheduleId}`;
        return axiosClient.get(url);
    },

    takeAttendance: (studentId, status) => {
        const url = `/admin/headtechnique/takeattendance/${studentId}`;
        return axiosClient.put(url, null, { params: { status } });
    },

    getTrainingSessionByDate: (date) => {
        const url = `trainingschedule/gettrainingsesionbydate`;
        return axiosClient.get(url, { params: { date } });
    },

    attendanceReportBySemester: (semester) => {
        const url = `/admin/headtechnique/checkattendance/report`;
        return axiosClient.get(url, { params: { semester } });
    },

    //Event

    getAttendanceByEventId: (eventId) => {
        const url = `/event/headculture/checkattendance/${eventId}`;
        return axiosClient.get(url);
    },

    takeAttendanceEvent: (memberEventId, status) => {
        const url = `/event/headculture/takeattendanceevent/${memberEventId}`;
        return axiosClient.get(url, { params: { status: status } });
    },

    //common

    getCommonSessionByDate: (date) => {
        const url = '/commonschedule/getcommonsessionbydate';
        return axiosClient.get(url, { params: { date } });
    },
};

export default adminAttendanceAPI;
