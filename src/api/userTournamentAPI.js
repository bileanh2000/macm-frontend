import axiosClient from './axiosClient';
const userTournamentAPI = {
    registerToJoinOrganizingCommittee: (tournamentId, studentId, roleId) => {
        const url = `/tournament/registertojoinorganizingcommittee/${tournamentId}/${studentId}/${roleId}`;
        return axiosClient.post(url);
    },

    registerToJoinTournamentCompetitveType: (tournamentId, studentId, params) => {
        const url = `/tournament/registertojointournamentcompetitivetype/${tournamentId}/${studentId}`;
        return axiosClient.post(url, null, { params: { studentId: params.studentId, weight: params.weight } });
    },
    registerToJoinTournamentExhibitionType: (tournamentId, studentId, params) => {
        const url = `/tournament/registertojointournamentexhibitiontype/${tournamentId}/${studentId}`;
        return axiosClient.post(url, params.teamMember, {
            params: { exhibitionTypeId: params.exhibitionTypeId, teamName: params.teamName },
        });
    },
    getAllOrginizingCommitteeRole: () => {
        const url = '/tournament/headclub/getallorganizingcommitteerole';
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
