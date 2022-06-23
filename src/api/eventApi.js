// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const eventApi = {
    getAll: (params) => {
        const url = '/event/geteventsbysemester';
        return axiosClient.get(url);
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
    updateEvent: (params, eventId) => {
        const url = `/event/headculture/updateevent/${eventId}`;
        return axiosClient.put(url, params);
    },
    getEventScheduleByEvent: (params) => {
        const url = `/eventschedule/geteventschedulebyevent/${params}`;
        return axiosClient.get(url);
    },
};
export default eventApi;
