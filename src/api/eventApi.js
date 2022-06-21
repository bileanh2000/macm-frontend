// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const eventApi = {
    getAll: (params) => {
        const url = '/event/geteventsbyname';
        return axiosClient.get(url, { params });
    },
    getEventBySemester: (params) => {
        const url = `/event/geteventsbysemester?semester=${params}`;
        return axiosClient.get(url);
    },
    createPreviewEvent: (params) => {
        const url = '/eventschedule/headculture/createpreview/';
        return axiosClient.post(url, null, {
            params: {
                eventName: params.name,
                startDate: params.startDate,
                finishDate: params.finishDate,
                startTime: params.startTime,
                finishTime: params.finishTime,
            },
        });
    },
    createEvent: (params) => {
        const url = `/event/headculture/createevent`;
        return axiosClient.post(url, params);
    },
    createScheduleSession: (params, eventId) => {
        const url = `/eventschedule/headculture/addnewschedule/${eventId}`;
        return axiosClient.post(url, params);
    },
};
export default eventApi;
