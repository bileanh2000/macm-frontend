import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import AdminList from './AdminList';

function AdminTournament() {
    let { tournamentId } = useParams();
    const [adminList, setAdminList] = useState([]);

    const fetchAdminInTournament = async (params) => {
        try {
            const response = await adminTournamentAPI.getAllTournamentOrganizingCommittee(params);
            console.log(response);
            const newUser = response.data.filter((user) => user.registerStatus === 'Đã chấp nhận');
            setAdminList(newUser);
        } catch (error) {
            console.log('Failed to fetch admin list: ', error);
        }
    };

    useEffect(() => {
        fetchAdminInTournament(tournamentId);
    }, []);

    return <AdminList data={adminList} />;
}

export default AdminTournament;
