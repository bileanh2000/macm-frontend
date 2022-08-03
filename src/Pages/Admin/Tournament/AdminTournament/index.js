import { Box, Button, FormControl, Grid, MenuItem, Select, Tab, Tabs, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import AddAdminTourament from './AddAdminTourament';
import AdminList from './AdminList';
import UpdateAdminTournament from './UpdateAdminTournament';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function AdminTournament() {
    let { tournamentId } = useParams();
    const [adminList, setAdminList] = useState([]);
    const [active, setActive] = useState(-1);
    const [total, setTotal] = useState(-1);
    const [updateRoleDialog, setUpdateRoleDialog] = useState(false);
    const [addAdminDialog, setAddAdminDialog] = useState(false);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fetchAdminInTournament = async (params) => {
        try {
            const response = await adminTournamentAPI.getAllTournamentOrganizingCommittee(params);
            console.log(response);
            const newUser = response.data.filter((user) => user.registerStatus === 'Đã chấp nhận');
            setAdminList(newUser);
            setActive(response.totalActive);
            setTotal(response.totalResult);
        } catch (error) {
            console.log('Failed to fetch admin list: ', error);
        }
    };

    useEffect(() => {
        fetchAdminInTournament(tournamentId);
    }, []);

    return (
        <Fragment>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Danh sách ban tổ chức" {...a11yProps(0)} />
                        <Tab label="Cập nhật vai trò" {...a11yProps(1)} />
                        <Tab label="Xét duyệt yêu cầu tham gia" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <AdminList data={adminList} active={active} total={total} value={value} index={0} />
                <UpdateAdminTournament value={value} active={active} total={total} index={1} />
                <AddAdminTourament value={value} active={active} total={total} index={2} />
            </Box>
        </Fragment>
    );
}

export default AdminTournament;
