// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const adminTournament = {
    createTournament: (params) => {
        const url = `/tournament/headclub/createtournament`;
        return axiosClient.post(url, params);
    },

    deleteTournament: (tournamentId) => {
        const url = `tournament/headclub/delete/${tournamentId}`;
        return axiosClient.delete(url);
    },

    updateTournament: (params, tournamentId) => {
        const url = `/tournament/headclub/update/${tournamentId}`;
        return axiosClient.put(url, params);
    },

    getAllTournament: (params) => {
        const url = `/tournament/headclub/tournament/getall?semester=${params}`;
        return axiosClient.get(url);
    },
    getTournamentById: (params) => {
        const url = `tournament/headclub/tournament/${params}`;
        return axiosClient.get(url);
    },

    //schedule

    createPreviewTournamentSchedule: (params) => {
        const url = '/tournamentschedule/headclub/createpreview';
        return axiosClient.post(url, null, {
            params: {
                tournamentName: params.tournamentName,
                startDate: params.startDate,
                finishDate: params.finishDate,
                startTime: params.startTime,
                finishTime: params.finishTime,
            },
        });
    },

    createTournamentSchedule: (params, tournamentId) => {
        const url = `/tournamentschedule/headclub/addnewschedule/${tournamentId}`;
        return axiosClient.post(url, params, { params: { isOverwritten: true } });
    },
    ///////////////////////////
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
export default adminTournament;
