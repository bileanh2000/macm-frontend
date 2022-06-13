import axiosClient from './axiosClient';

const trainingSchedule = {
    getAllSchedule: () => {
        const url = '/trainingschedule/gettrainingschedule';
        return axiosClient.get(url);
    },
    createSchedule: (params) => {
        const url = `trainingschedule/headtechnique/addnewschedule`;
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
export default trainingSchedule;
