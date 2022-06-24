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
                // IsContinuous: params.IsContinuous,
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
        const url = `/event/headculture/getallusercanceljoinevent/${params}?pageNo=0&pageSize=1000&sortBy=id`;
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
};
export default eventApi;
