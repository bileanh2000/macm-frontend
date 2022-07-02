// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const eventApi = {
    getAll: (params) => {
        const url = '/event/geteventsbysemester';
        return axiosClient.get(url);
    },
    getEventBySemester: (month, page, semester) => {
        const url = `/event/geteventsbysemester?month=${month}&pageNo=${page}&pageSize=5&semester=${semester}`;
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
                // IsContinuous: params.IsContinuous,
            },
        });
    },
    createEvent: (params) => {
        const url = `/event/headculture/createevent`;
        return axiosClient.post(url, params);
    },
    createScheduleSession: (params, eventId) => {
        const url = `/eventschedule/headculture/addnewschedule/${eventId}?isOverwritten=true`;
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
    deleteEvent: (params) => {
        const url = `/event/headculture/deleteevent/${params}`;
        return axiosClient.put(url);
    },

    getAllMemberEvent: (params, index) => {
        const url = `/event/headculture/getmemberjoinevent/${params}?filterIndex=${index}&pageSize=1000&sortBy=id`;
        return axiosClient.get(url);
    },

    getAllMember: (params) => {
        const url = `/event/headculture/getallmemberevent/${params}?pageNo=0&pageSize=1000&sortBy=id`;
        return axiosClient.get(url);
    },
    getAllMemberCancel: (params) => {
        const url = `/event/headculture/getallmembercanceljoinevent/${params}?pageNo=0&pageSize=1000&sortBy=id`;
        return axiosClient.get(url);
    },
    updateRoleEvent: (params) => {
        const url = `/event/headculture/updateuserroleevent`;
        return axiosClient.get(url, { params });
    },
    getListMemberToUpdate: (params) => {
        const url = `/event/headculture/getlistmembereventtoupdaterole/${params}`;
        return axiosClient.get(url);
    },
    updateMemberRole: (params) => {
        const url = `/event/headculture/updatelistmembereventrole`;
        return axiosClient.put(url, params);
    },

    getPeriodTime: (id) => {
        const url = `/eventschedule/headculture/getperiodtimeofevent/${id}`;
        return axiosClient.get(url);
    },

    previewUpdateEventSessionTime: (eventId, params) => {
        const url = `/eventschedule/headculture/updatepreview/${eventId}`;
        return axiosClient.post(url, null, {
            params: {
                startDate: params.startDate,
                finishDate: params.finishDate,
                startTime: params.startTime,
                finishTime: params.finishTime,
            },
        });
    },
    updateEventSchedule: (eventId, params) => {
        const url = `/eventschedule/headculture/updateschedule/${eventId}?isOverwritten=true`;
        return axiosClient.post(url, params);
    },

    getMonthsBySemester: (semester) => {
        const url = `/semester/getlistmonths?semester=${semester}`;
        return axiosClient.get(url);
    },
};
export default eventApi;
