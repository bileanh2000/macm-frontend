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
        const url = `/trainingschedule/headtechnique/deletesession/${params}`;
        return axiosClient.put(url);
    },
    updateSchedule: (params) => {
        const url = `/trainingschedule/headtechnique/updatesession/${params.id}`;
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
};
export default trainingScheduleApi;
