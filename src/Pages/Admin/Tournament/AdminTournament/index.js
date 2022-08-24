import { Box, Button, FormControl, Grid, MenuItem, Select, Tab, Tabs, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import AddAdminTourament from './AddAdminTourament';
import AdminList from './AdminList';
import UpdateAdminTournament from './UpdateAdminTournament';
import UpdateRole from './AdminList/UpdateRole';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function AdminTournament({ isUpdate, user, onChange }) {
    let { tournamentId } = useParams();
    const [adminList, setAdminList] = useState([]);
    const [active, setActive] = useState(-1);
    const [total, setTotal] = useState(0);
    const [isRender, SetIsRender] = useState(true);
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
        isRender && fetchAdminInTournament(tournamentId);
        SetIsRender(false);
    }, [tournamentId, adminList, isRender]);

    return (
        <Fragment>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="basic tabs example"
                    >
                        <Tab label="Danh sách ban tổ chức" {...a11yProps(0)} value={0} />
                        {/* <Tab label="Cập nhật vai trò" {...a11yProps(1)} /> */}
                        <Tab label="Xét duyệt yêu cầu tham gia" {...a11yProps(1)} value={1} />
                    </Tabs>
                    {/* {!isUpdate && (
                        <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleOpenDialogExhibition(true)}>
                            Thêm vận động viên thi đấu biểu diễn
                        </Button>
                    )} */}
                </Box>

                <AdminList
                    adminList={adminList}
                    isUpdate={isUpdate}
                    user={user}
                    active={active}
                    total={total}
                    value={value}
                    index={0}
                    Success={(newItem) => {
                        // if (competitivePlayer.find((player) => player.playerStudentId == newItem.playerStudentId)) {
                        //     return;
                        // }
                        // setAdminList([...newItem, ...adminList]);
                        SetIsRender(true);
                    }}
                    tournamentId={tournamentId}
                    onChange={() => {
                        SetIsRender(true);
                        onChange && onChange();
                    }}
                />
                {/* <UpdateAdminTournament
                    value={value}
                    active={active}
                    total={total}
                    index={1}
                    onChange={() => SetIsRender(true)}
                /> */}
                {value == 1 && (
                    <AddAdminTourament
                        value={value}
                        active={active}
                        total={total}
                        index={1}
                        onChange={() => {
                            SetIsRender(true);
                            // onChange && onChange();
                        }}
                    />
                )}
            </Box>
        </Fragment>
    );
}

export default AdminTournament;
