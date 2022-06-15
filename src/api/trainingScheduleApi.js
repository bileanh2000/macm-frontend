import axiosClient from './axiosClient';

const trainingScheduleApi = {
    getAllSchedule: () => {
        const url = '/trainingschedule/gettrainingschedule';
        return axiosClient.get(url);
    },
    createSchedule: (params) => {
        const url = `/trainingschedule/headtechnique/addnewschedule`;
        return axiosClient.post(url, params.daysOfWeek, {
            params: {
                finishDate: params.endDate,
                finishTime: params.endTime,
                startDate: params.startDate,
                startTime: params.startTime,
            },
        });
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
};
export default trainingScheduleApi;
