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

    getTournamentSchedule: (params) => {
        const url = `/tournamentschedule/headclub/tournamentschedule/${params}`;
        return axiosClient.get(url);
    },

    //Member

    getAllCompetitivePlayer: (tournamentId, params) => {
        const url = `/tournament/headclub/getallcompetitiveplayer/${tournamentId}`;
        return axiosClient.get(url, {
            params: {
                weightMax: params.weightMax,
                weightMin: params.weightMin,
            },
        });
    },

    getAllExhibitionTeam: (tournamentId, params) => {
        const url = `/tournament/headclub/getallexhibitionteam/${tournamentId}`;
        return axiosClient.get(url, {
            params: {
                exhibitionType: params.exhibitionType,
            },
        });
    },

    getAllTournamentOrganizingCommittee: (tournamentId) => {
        const url = `/tournament/headclub/getalltournamentorganizingcommittee/${tournamentId}`;
        return axiosClient.get(url);
    },

    updateTournamentOrganizingCommitteeRole: (params) => {
        const url = `/tournament/headclub/updatetournamentorganizingcommitteerole`;
        return axiosClient.get(url, params);
    },

    getAllExhibitionType: (tournamentId) => {
        const url = `/tournament/headclub/getallexhibitiontype/${tournamentId}`;
        return axiosClient.get(url);
    },

    getAllOrginizingCommitteeRole: () => {
        const url = `/tournament/headclub/getallorganizingcommitteerole`;
        return axiosClient.get(url);
    },

    declineRequestToJoinOrganizingCommittee: (organizingCommitteeId) => {
        const url = `/tournament/headclub/declinerequesttojoinorganizingcommittee/${organizingCommitteeId}`;
        return axiosClient.put(url);
    },

    acceptRequestToJoinOrganizingCommittee: (organizingCommitteeId) => {
        const url = `/tournament/headclub/acceptrequesttojoinorganizingcommittee/${organizingCommitteeId}`;
        return axiosClient.put(url);
    },

    updateTournamentOrganizingCommitteeRole: (params) => {
        const url = '/tournament/headclub/updatetournamentorganizingcommitteerole';
        return axiosClient.put(url, params);
    },
    ///////////////////////////

    // getAllMemberEvent: (params, index) => {
    //     const url = `/event/headculture/getmemberjoinevent/${params}?filterIndex=${index}&pageSize=1000&sortBy=id`;
    //     return axiosClient.get(url);
    // },

    // getAllMember: (params) => {
    //     const url = `/event/headculture/getallmemberevent/${params}?pageNo=0&pageSize=1000&sortBy=id`;
    //     return axiosClient.get(url);
    // },
    // getAllMemberCancel: (params) => {
    //     const url = `/event/headculture/getallusercanceljoinevent/${params}?pageNo=0&pageSize=1000&sortBy=id`;
    //     return axiosClient.get(url);
    // },
    // updateRoleEvent: (params) => {
    //     const url = `/event/headculture/updateuserroleevent`;
    //     return axiosClient.get(url, { params });
    // },
    // getListMemberToUpdate: (params) => {
    //     const url = `/event/headculture/getlistmembereventtoupdaterole/${params}`;
    //     return axiosClient.get(url);
    // },
    // updateMemberRole: (params) => {
    //     const url = `/event/headculture/updatelistmembereventrole`;
    //     return axiosClient.put(url, params);
    // },
};
export default adminTournament;
