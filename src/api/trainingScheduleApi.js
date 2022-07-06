import axiosClient from './axiosClient';

const trainingScheduleApi = {
    getAllSchedule: () => {
        const url = '/trainingschedule/gettrainingschedule';
        return axiosClient.get(url);
    },
    getAllScheduleBySemester: (semesterId) => {
        const url = `/trainingschedule/gettrainingschedulebysemester/${semesterId}`;
        return axiosClient.get(url);
    },
    createSchedule: (params) => {
        const url = `/trainingschedule/headtechnique/addnewschedule`;
        return axiosClient.post(url, params);
    },
    deleteSession: (params) => {
        const url = `/trainingschedule/headtechnique/deletesession?date=${params}`;
        return axiosClient.put(url);
    },
    updateSchedule: (date, params) => {
        const url = `/trainingschedule/headtechnique/updatesession?date=${date}`;
        return axiosClient.put(url, params);
    },
    createSession: (params) => {
        const url = `/trainingschedule/headtechnique/addnewsession`;
        return axiosClient.post(url, params);
    },
    previewSchedule: (params) => {
        const url = `/trainingschedule/headtechnique/createpreview`;
        return axiosClient.post(url, params.daysOfWeek, {
            params: {
                finishDate: params.endDate,
                finishTime: params.endTime,
                startDate: params.startDate,
                startTime: params.startTime,
            },
        });
    },
    commonSchedule: () => {
        const url = `/commonschedule/getcommonschedule`;
        return axiosClient.get(url);
    },
    commonScheduleBySemesterId: (semesterId) => {
        const url = `/commonschedule/getcommonschedulebysemester/${semesterId}`;
        return axiosClient.get(url);
    },

    getTrainingSessionByDate: (date) => {
        const url = `/trainingschedule/gettrainingsesionbydate?date=${date}`;
        return axiosClient.get(url);
    },
};
export default trainingScheduleApi;
