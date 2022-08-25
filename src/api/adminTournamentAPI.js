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

    // getAllSuggestionRole: () => {
    //     const url = '/tournament/headclub/getallsuggestrole';
    //     return axiosClient.get(url);
    // },

    //================================Role Tournament===========================//

    addNewRoleTournament: (newRole) => {
        const url = '/tournament/addnewroletournament';
        return axiosClient.post(url, newRole);
    },

    getAllRoleTournament: () => {
        const url = '/tournament/getallroletournament';
        return axiosClient.get(url);
    },

    updateRoleEventName: (roleTournamentId, newRole) => {
        const url = `/tournament/updateroletournamentname/${roleTournamentId}`;
        return axiosClient.put(url, newRole);
    },

    updateStatusRoleTournament: (roleTournamentId) => {
        const url = `/tournament/updatestatusroletournament/${roleTournamentId}`;
        return axiosClient.put(url);
    },

    deleteRoleTournament: (roleTournamentId) => {
        const url = `/tournament/deleteroletournament/${roleTournamentId}`;
        return axiosClient.delete(url);
    },

    //================================Member Tournament =========================//

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
        return axiosClient.put(url);
    },

    declineRequestToJoinOrganizingCommittee: (organizingCommitteeId) => {
        const url = `/tournament/declinerequesttojointournamentorganizingcommittee/${organizingCommitteeId}`;
        return axiosClient.put(url);
    },

    acceptRequestToJoinOrganizingCommittee: (organizingCommitteeId) => {
        const url = `/tournament/acceptrequesttojointournamentorganizingcommittee/${organizingCommitteeId}`;
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

    getAllRequestToJoinTournamentCompetitiveType: (tournamentId) => {
        const url = `/tournament/getallrequesttojointournamentcompetitivetype/${tournamentId}`;
        return axiosClient.get(url);
    },

    declineRequestToJoinTournamentCompetitiveType: (competitiveTypeRegistrationId) => {
        const url = `/tournament/declinerequesttojointournamentcompetitivetype/${competitiveTypeRegistrationId}`;
        return axiosClient.put(url);
    },

    acceptRequestToJoinTournamentCompetitiveType: (competitiveTypeRegistrationId) => {
        const url = `/tournament/acceptrequesttojointournamentcompetitivetype/${competitiveTypeRegistrationId}`;
        return axiosClient.put(url);
    },

    getAllRequestToJoinTournamentExhibitionType: (tournamentId) => {
        const url = `/tournament/getallrequesttojointournamentexhibitiontype/${tournamentId}`;
        return axiosClient.get(url);
    },

    declineRequestToJoinTournamentExhibitionType: (exhibitionTypeRegistrationId) => {
        const url = `/tournament/declinerequesttojointournamentexhibitiontype/${exhibitionTypeRegistrationId}`;
        return axiosClient.delete(url);
    },

    acceptRequestToJoinTournamentExhibitionType: (exhibitionTypeRegistrationId) => {
        const url = `/tournament/acceptrequesttojointournamentexhibitiontype/${exhibitionTypeRegistrationId}`;
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

    getExhibitionResult: (exhibitionTypeId) => {
        const url = `/exhibition/getlistexhibitionresult/${exhibitionTypeId}`;
        return axiosClient.get(url);
    },

    // getTeamByType: (tournamentId) => {
    //     const url = `/exhibition/headclub/getteambytype/${tournamentId}`;
    //     return axiosClient.get(url);
    // },

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

    //==================================== Suggest Type ================================//

    getAllSuggestType: () => {
        const url = `/tournament/headclub/getallsuggesttype`;
        return axiosClient.get(url);
    },

    addCompetitiveTypeSample: (competitiveTypeSample) => {
        const url = '/tournament/headclub/addcompetitivetypesample';
        return axiosClient.post(url, competitiveTypeSample);
    },

    updateCompetitiveTypeSample: (competitiveTypeSample) => {
        const url = `/tournament/headclub/updatecompetitivetypesample/${competitiveTypeSample.id}`;
        return axiosClient.put(url, competitiveTypeSample);
    },

    deleteCompetitiveTypeSample: (competitiveTypeSampleId) => {
        const url = `/tournament/headclub/deletecompetitivetypesample/${competitiveTypeSampleId}`;
        return axiosClient.delete(url);
    },

    addExhibitionTypeSample: (exhibitionTypeSample) => {
        const url = '/tournament/headclub/addexhibitiontypesample';
        return axiosClient.post(url, exhibitionTypeSample);
    },

    updateExhibitionTypeSample: (exhibitionTypeSample) => {
        const url = `/tournament/headclub/updateexhibitiontypesample/${exhibitionTypeSample.id}`;
        return axiosClient.put(url, exhibitionTypeSample);
    },

    deleteExhibitionTypeSample: (exhibitionTypeSampleId) => {
        const url = `/tournament/headclub/deleteexhibitiontypesample/${exhibitionTypeSampleId}`;
        return axiosClient.delete(url);
    },

    //============================ Area ================================//

    getAllArea: () => {
        const url = `/area/headclub/getallarea`;
        return axiosClient.get(url);
    },

    addNewArea: (area) => {
        const url = '/area/headclub/addnewarea';
        return axiosClient.post(url, area);
    },

    updateListArea: (area) => {
        const url = '/area/headclub/updatelistarea';
        return axiosClient.post(url, area);
    },
};
export default adminTournament;
