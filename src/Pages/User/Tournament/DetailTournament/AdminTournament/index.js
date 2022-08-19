import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import AdminList from './AdminList';

function AdminTournament() {
    let { tournamentId } = useParams();
    const [adminList, setAdminList] = useState([]);
    const [isRender, SetIsRender] = useState(true);

    const fetchAdminInTournament = async (params) => {
        try {
            const response = await adminTournamentAPI.getAllTournamentOrganizingCommittee(params);
            console.log(response);
            setAdminList(response.data);
        } catch (error) {
            console.log('Failed to fetch admin list: ', error);
        }
    };

    useEffect(() => {
        isRender && fetchAdminInTournament(tournamentId);
        SetIsRender(false);
    }, [tournamentId, adminList, isRender]);

    return <AdminList data={adminList} />;
}

export default AdminTournament;
