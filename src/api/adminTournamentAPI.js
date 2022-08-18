// https://fakestoreapi.com/docs

import axiosClient from './axiosClient';

const adminTournament = {
    createTournament: (params, studentId) => {
        const url = `/tournament/headclub/createtournament/${studentId}?isOverwritten=true`;
        return axiosClient.post(url, params);
    },

    deleteTournament: (tournamentId, studentId) => {
        const url = `tournament/headclub/delete/${tournamentId}/${studentId}`;
        return axiosClient.put(url);
    },

    updateTournament: (params, tournamentId) => {
        const url = `/tournament/headclub/update/${tournamentId}`;
        return axiosClient.put(url, params);
    },

    getAllTournament: (params, status) => {
        const url = `/tournament/headclub/tournament/getall?semester=${params}&status=${status}`;
        return axiosClient.get(url);
    },
    getTournamentById: (params) => {
        const url = `tournament/headclub/tournament/${params}`;
        return axiosClient.get(url);
    },

    getTournamentResult: (tournamentId) => {
        const url = `tournament/gettournamentresult/${tournamentId}`;
        return axiosClient.get(url);
    },

    //schedule

    getAllTournamentSchedule: () => {
        const url = `tournamentschedule/getalltournamentschedule`;
        return axiosClient.get(url);
    },

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

    getAllSuggestionRole: () => {
        const url = '/event/headculture/getallsuggestionrole';
        return axiosClient.get(url);
    },

    //Member

    addListOrganizingCommittee: (studentId, tournamentId, params) => {
        const url = `/tournament/headclub/addlistorganizingcommittee/${studentId}/${tournamentId}`;
        return axiosClient.post(url, params);
    },

    getAllCompetitivePlayer: (tournamentId, params) => {
        const url = `/tournament/headclub/getallcompetitiveplayer/${tournamentId}`;
        return axiosClient.get(url, {
            params: {
                weightMax: params.weightMax,
                weightMin: params.weightMin,
            },
        });
    },

    getAllCompetitivePlayerByType: (tournamentId, competitiveTypeId) => {
        const url = `/tournament/headclub/getallcompetitiveplayerbytype/${tournamentId}`;
        return axiosClient.get(url, {
            params: {
                competitiveTypeId: competitiveTypeId,
            },
        });
    },

    getAllExhibitionTeam: (tournamentId, params) => {
        const url = `/tournament/headclub/getallexhibitionteam/${tournamentId}`;
        return axiosClient.get(url, {
            params: {
                exhibitionType: params,
            },
        });
    },

    getTeamByType: (exhibitionTypeId) => {
        const url = `/exhibition/headclub/getteambytype/${exhibitionTypeId}`;
        return axiosClient.get(url);
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

    // getAllOrginizingCommitteeRole: () => {
    //     const url = `/tournament/headclub/getallorganizingcommitteerole`;
    //     return axiosClient.get(url);
    // },

    getAllOrginizingCommitteeRole: (tournamentId) => {
        const url = `/tournament/headclub/getallorganizingcommitteerole/${tournamentId}`;
        return axiosClient.get(url);
    },

    editRoleTournament: (tournamentId, params) => {
        const url = `/tournament/headclub/editroletournament/${tournamentId}`;
        return axiosClient.put(url, params);
    },

    deleteTournamentOrganizingCommittee: (tournamentOrganizingCommitteeId) => {
        const url = `/tournament/headclub/deletetournamentorganizingcommittee/${tournamentOrganizingCommitteeId}`;
        return axiosClient.delete(url);
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
        const url = `/competitive/treasurer/getallcompetitivetype/${tournamentId}`;
        return axiosClient.get(url);
    },

    updateWeightForCompetitivePlayer: (competitivePlayerId, weight) => {
        const url = `/competitive/headclub/updateweightplayer/${competitivePlayerId}`;
        return axiosClient.put(url, null, { params: { weight: weight } });
    },

    deleteCompetitivePlayer: (competitivePlayerId) => {
        const url = `/competitive/headclub/deletecompetitiveplayer/${competitivePlayerId}`;
        return axiosClient.put(url);
    },

    //Fee

    getAllTournamentOrganizingCommitteePaymentStatus: (tournamentId) => {
        const url = `/tournament/treasurer/getalltournamentorganizingcommitteepaymentstatus/${tournamentId}`;
        return axiosClient.get(url);
    },

    updateTournamentOrganizingCommitteePaymentStatus: (id, studentId) => {
        const url = `/tournament/treasurer/updatetournamentorganizingcommitteepaymentstatus/${id}/${studentId}`;
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

    updateTournamentPlayerPaymentStatus: (tournamentId, studentId) => {
        const url = `/tournament/treasurer/updatetournamentplayerpaymentstatus/${tournamentId}/${studentId}`;
        return axiosClient.put(url);
    },

    getAllTournamentPlayerPaymentStatusReport: (tournamentId) => {
        const url = `/tournament/treasurer/getalltournamentplayerpaymentstatusreport/${tournamentId}`;
        return axiosClient.get(url);
    },

    updateAfterTournament: (tournamentId, studentId, totalAmountActual) => {
        const url = `/tournament/headclub/updateaftertournament/${tournamentId}/${studentId}`;
        return axiosClient.put(url, null, { params: { totalAmountActual: totalAmountActual } });
    },

    ///////////////////////////

    spawnTimeAndArea: (tournamentId) => {
        const url = `/tournament/headclub/spawntimeandarea/${tournamentId}`;
        return axiosClient.post(url);
    },

    ///////

    listUserNotJoinCompetitive: (tournamentId) => {
        const url = `competitive/headclub/listusernotjoincompetitive/${tournamentId}`;
        return axiosClient.get(url);
    },

    getAllUserNotJoinTournament: (tournamentId) => {
        const url = `tournament/headclub/getallusernotjointournament/${tournamentId}`;
        return axiosClient.get(url);
    },

    confirmListMatchsPlayer: (tournamentId) => {
        const url = `/competitive/headclub/confirmlistmatchsplayer/${tournamentId}`;
        return axiosClient.put(url);
    },

    addNewCompetitivePlayer: (competitiveTypeId, users) => {
        const url = `/competitive/headclub/addnewcompetitiveplayer/${competitiveTypeId}`;
        return axiosClient.post(url, users);
    },

    getListPlayerBracket: (competitiveTypeId) => {
        const url = `/competitive/headclub/getlistplayerbracket/${competitiveTypeId}`;
        return axiosClient.get(url);
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
                firstPoint: params.firstPlayer.point,
                secondPoint: params.secondPlayer.point,
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

    // spawnTimeAndArea: (tournamentId) => {
    //     const url = `/competitive/headclub/spawntimeandarea/${tournamentId}`;
    //     return axiosClient.post(url);
    // },

    getAllArea: () => {
        const url = `/area/headclub/getallarea`;
        return axiosClient.get(url);
    },
    updateTimeAndPlaceMatch: (matchId, params) => {
        const url = `/tournament/headclub/updatetimeandplacematch/${matchId}`;
        return axiosClient.put(url, params);
    },

    updateTimeAndPlaceTeam: (teamId, params) => {
        const url = `/tournament/headclub/updatetimeandplaceteam/${teamId}`;
        return axiosClient.put(url, params);
    },

    getResultByType: (competitiveTypeId) => {
        const url = `/competitive/getResult/${competitiveTypeId}`;
        return axiosClient.post(url);
    },

    //////////// Exhibition
    getListExhibitionType: (tournamentId) => {
        const url = `/exhibition/getlistexhibitiontype/${tournamentId}`;
        return axiosClient.get(url);
    },

    getExhibitionResult: (data) => {
        const url = '/exhibition/getlistexhibitionresult';
        return axiosClient.get(url, { params: { date: '', exhibitionTypeId: data.exhibitionType } });
    },

    getTeamByType: (tournamentId) => {
        const url = `/exhibition/headclub/getteambytype/${tournamentId}`;
        return axiosClient.get(url);
    },

    getTop3TeamByType: (exhibitionTypeId) => {
        const url = `/exhibition/headclub/gettop3teambytype/${exhibitionTypeId}`;
        return axiosClient.get(url);
    },

    registerTeam: (exhibitionTypeId, params) => {
        const url = `/exhibition/headclub/registerexhibitionteam/${exhibitionTypeId}`;
        return axiosClient.post(url, params.listStudentId, { params: { name: params.teamName } });
    },
    listUserNotJoinExhibition: (exhibitionTypeId) => {
        const url = `/exhibition/headclub/listusernotjoinexhibition/${exhibitionTypeId}`;
        return axiosClient.get(url);
    },
    // spawnTimeAndAreaEx: (tournamentId) => {
    //     const url = `/exhibition/headclub/spawntimeandarea/${tournamentId}`;
    //     return axiosClient.post(url);
    // },

    updateExhibitionTeam: (exhibitionTeamId, params) => {
        const url = `/exhibition/headclub/updateteam/${exhibitionTeamId}`;
        return axiosClient.put(url, params);
    },
    updateExhibitionResult: (exhibitionTeamId, score) => {
        const url = `/exhibition/headclub/updateexhibitionresult/${exhibitionTeamId}`;
        return axiosClient.put(url, null, { params: { score: score } });
    },

    getAllSuggestType: () => {
        const url = `/tournament/headclub/getallsuggesttype`;
        return axiosClient.get(url);
    },
};
export default adminTournament;
