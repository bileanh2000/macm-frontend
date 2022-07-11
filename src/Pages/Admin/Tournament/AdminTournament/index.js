import { Box, Button, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import AdminList from './AdminList';

function AdminTournament() {
    let { tournamentId } = useParams();
    const [adminList, setAdminList] = useState([]);
    const [active, setActive] = useState(-1);
    const [total, setTotal] = useState(-1);

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
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid item xs={6}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        Danh sách thành viên ban tổ chức
                    </Typography>
                    {active > 0 && total > 0 && (
                        <Typography variant="body2">
                            Số lượng thành viên trong ban tổ chức: {active}/{total}
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={6} container>
                    <Grid item xs={6}>
                        {' '}
                        <Button
                            variant="outlined"
                            component={Link}
                            to={`/admin/tournament/${tournamentId}/admin/update`}
                            sx={{ mr: 2 }}
                        >
                            Cập nhật vai trò thành viên ban tổ chức
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="outlined"
                            component={Link}
                            to={`/admin/tournament/${tournamentId}/admin/addadmin`}
                            sx={{ mr: 2 }}
                        >
                            Xét duyệt thành viên vào ban tổ chức
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <AdminList data={adminList} />
        </Fragment>
    );
}

export default AdminTournament;
