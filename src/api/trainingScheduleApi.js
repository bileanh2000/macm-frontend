import axiosClient from './axiosClient';

const trainingSchedule = {
    getAllSchedule: (params) => {
        const url = '/admin/hr/getallmemberandcollaborator?pageNo=0&pageSize=100';
        return axiosClient.get(url, { params });
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
