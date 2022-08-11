import axiosClient from './axiosClient';

const userTournamentAPI = {
    getAllTournamentByStudentId: (studentId, semester, status) => {
        const url = `/tournament/getalltournamentbystudentid/${studentId}?semester=${semester}&status=${status}`;
        return axiosClient.get(url);
    },

    registerToJoinOrganizingCommittee: (tournamentId, studentId, roleId) => {
        const url = `/tournament/registertojoinorganizingcommittee/${tournamentId}/${studentId}/${roleId}`;
        return axiosClient.post(url);
    },

    registerToJoinTournamentCompetitiveType: (tournamentId, studentId, params) => {
        const url = `/tournament/registertojointournamentcompetitivetype/${tournamentId}/${studentId}`;
        return axiosClient.post(url, null, {
            params: { competitiveTypeId: params.competitiveTypeId, weight: params.weight },
        });
    },
    registerToJoinTournamentExhibitionType: (tournamentId, studentId, params) => {
        const url = `/tournament/registertojointournamentexhibitiontype/${tournamentId}/${studentId}`;
        return axiosClient.post(url, params.teamMember, {
            params: { exhibitionTypeId: params.exhibitionTypeId, teamName: params.teamName },
        });
    },
    getAllOrginizingCommitteeRole: (tournamentId) => {
        const url = `/tournament/headclub/getallorganizingcommitteerole/${tournamentId}`;
        return axiosClient.get(url);
    },
    getAllUserCompetitivePlayer: (tournamentId, studentId) => {
        const url = `tournament/getallusercompetitiveplayer/${tournamentId}/${studentId}`;
        return axiosClient.get(url);
    },
    getAllUserExhibitionPlayer: (tournamentId, studentId) => {
        const url = `tournament/getalluserexhibitionplayer/${tournamentId}/${studentId}`;
        return axiosClient.get(url);
    },
    getAllUserOrganizingCommittee: (tournamentId, studentId) => {
        const url = `tournament/getalluserorganizingcommittee/${tournamentId}/${studentId}`;
        return axiosClient.get(url);
    },
};

export default userTournamentAPI;
