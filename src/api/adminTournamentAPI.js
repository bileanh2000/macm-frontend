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

    createTournamentSession: (tournamentId, params) => {
        const url = `/tournamentschedule/headclub/tournamentschedule/create/${tournamentId}`;
        return axiosClient.post(url, params);
    },

    updateTournamentSession: (tournamentId, params) => {
        const url = `/tournamentschedule/headclub/tournamentschedule/update/${tournamentId}`;
        return axiosClient.put(url, params);
    },

    deleteTournamentSession: (tournamentSessionId) => {
        const url = `/tournamentschedule/headclub/tournamentschedule/delete/${tournamentSessionId}`;
        return axiosClient.delete(url);
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
                exhibitionType: params.id,
            },
        });
    },

    getAllTournamentOrganizingCommittee: (tournamentId) => {
        const url = `/tournament/headclub/getalltournamentorganizingcommittee/${tournamentId}`;
        return axiosClient.get(url);
    },

    updateTournamentOrganizingCommitteeRole: (params) => {
        const url = `/tournament/headclub/updatetournamentorganizingcommitteerole`;
        return axiosClient.put(url, params);
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

    getAllCompetitiveType: (tournamentId) => {
        const url = `/tournament/treasurer/getallcompetitivetype/${tournamentId}`;
        return axiosClient.get(url);
    },

    //Fee

    getAllTournamentOrganizingCommitteePaymentStatus: (tournamentId) => {
        const url = `/tournament/treasurer/getalltournamentorganizingcommitteepaymentstatus/${tournamentId}`;
        return axiosClient.get(url);
    },

    updateTournamentOrganizingCommitteePaymentStatus: (id) => {
        const url = `/tournament/treasurer/updatetournamentorganizingcommitteepaymentstatus/${id}`;
        return axiosClient.put(url);
    },

    getAllTournamentOrganizingCommitteePaymentStatusReport: (tournamentId) => {
        const url = `/tournament/treasurer/getalltournamentorganizingcommitteepaymentstatusreport/${tournamentId}`;
        return axiosClient.get(url);
    },

    getAllTournamentPlayerPaymentStatus: (tournamentId) => {
        const url = `/tournament/treasurer/getalltournamentplayerpaymentstatus/${tournamentId}`;
        return axiosClient.get(url);
    },

    updateTournamentPlayerPaymentStatus: (tournamentId) => {
        const url = `/tournament/treasurer/updatetournamentplayerpaymentstatus/${tournamentId}`;
        return axiosClient.put(url);
    },

    getAllTournamentPlayerPaymentStatusReport: (tournamentId) => {
        const url = `/tournament/treasurer/getalltournamentplayerpaymentstatusreport/${tournamentId}`;
        return axiosClient.get(url);
    },

    ///////////////////////////

    getListPlayerBracket: (competitiveTypeId, round) => {
        const url = `/competitive/headclub/getlistplayerbracket/${competitiveTypeId}`;
        return axiosClient.get(url, null, {
            params: {
                round: round,
            },
        });
    },

    spawnMatchs: (competitiveTypeId, round) => {
        const url = `/competitive/headclub/spawnmatchs/${competitiveTypeId}`;
        return axiosClient.post(url, null, {
            params: {
                round: round,
            },
        });
    },
    updateResultMatch: (params) => {
        const url = `/competitive/headclub/updateresultmatch/${params.id}`;
        return axiosClient.put(url, null, {
            params: {
                firstPoint: params.firstPoint,
                secondPoint: params.secondPoint,
            },
        });
    },
    listMatchs: (competitiveTypeId) => {
        const url = `/competitive/headclub/listmatchs/${competitiveTypeId}`;
        return axiosClient.get(url);
    },

    previewMatchsPlayer: (competitiveTypeId) => {
        const url = `/competitive/headclub/previewmatchsplayer/${competitiveTypeId}`;
        return axiosClient.post(url);
    },

    updateListMatchsPlayer: (params) => {
        const url = `/competitive/headclub/updatelistmatchsplayer`;
        return axiosClient.put(url, params);
    },
};
export default adminTournament;
