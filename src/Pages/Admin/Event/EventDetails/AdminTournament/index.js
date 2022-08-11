import {
    Box,
    Button,
    FormControl,
    Grid,
    MenuItem,
    Select,
    Tab,
    Tabs,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import AddMemberToAdminEvent from '../../MenberEvent/AddMemberToAdminEvent';
import AddAdminTourament from './AddAdminTourament';
import AdminList from './AdminList';
import UpdateAdminTournament from './UpdateAdminTournament';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function AdminTournament({ isUpdate, user }) {
    let { id } = useParams();
    const [adminList, setAdminList] = useState([]);
    const [active, setActive] = useState(-1);
    const [total, setTotal] = useState(-1);
    const [updateRoleDialog, setUpdateRoleDialog] = useState(false);
    const [addAdminDialog, setAddAdminDialog] = useState(false);
    const [value, setValue] = React.useState(0);
    const [notiStatus, setNotiStatus] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fetchAdminInEvent = async (params, index) => {
        try {
            const response = await eventApi.getAllMemberEvent(params, index);
            console.log(response);
            // const newUser = response.data.filter((user) => user.registerStatus === 'Đã chấp nhận');
            setAdminList(response.data);
            setActive(response.totalActive);
            setTotal(response.totalResult);
        } catch (error) {
            console.log('Failed to fetch admin list: ', error);
        }
    };

    useEffect(() => {
        fetchAdminInEvent(id, 2);
    }, [id, notiStatus]);

    return (
        <Fragment>
            {/* <Box sx={{ width: '100%' }}> */}

            {/* <UpdateAdminTournament value={value} active={active} total={total} index={1} /> */}
            {/* <AddMemberToAdminEvent value={value} active={active} total={total} index={1} /> */}
            {/* </Box> */}

            <Box sx={{ padding: '8px 8px 5px 8px' }}>
                <ToggleButtonGroup
                    color="primary"
                    value={notiStatus}
                    exclusive
                    onChange={(event, newNotiStatus) => {
                        if (newNotiStatus !== null) {
                            setNotiStatus(newNotiStatus);
                            console.log(newNotiStatus);
                        }
                    }}
                >
                    <ToggleButton
                        value={0}
                        sx={{
                            p: 1,
                            borderRadius: '10px !important',
                            border: 'none',
                            textTransform: 'none',
                            mr: 1,
                        }}
                    >
                        DANH SÁCH THÀNH VIÊN BTC
                    </ToggleButton>
                    <ToggleButton
                        value={1}
                        sx={{
                            p: 1,
                            borderRadius: '10px !important',
                            border: 'none',
                            textTransform: 'none',
                        }}
                    >
                        CẬP NHẬT VAI TRÒ
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {notiStatus === 0 ? (
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
                        console.log(newItem);
                        setAdminList([...newItem, ...adminList]);
                    }}
                />
            ) : (
                <AddMemberToAdminEvent />
            )}
        </Fragment>
    );
}

export default AdminTournament;
