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
import UpdateRole from './UpdateRole';

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
    const [isRender, SetIsRender] = useState(true);
    const [updateRoleDialog, setUpdateRoleDialog] = useState(false);
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [value, setValue] = React.useState(0);
    const [notiStatus, setNotiStatus] = useState(0);
    const [roleList, setRoleList] = useState([]);
    const [allRoles, setAllRoles] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getAllRoleEvent = async () => {
        try {
            const response = await eventApi.getAllRoleEvent();
            console.log('getAllRoleEvent', response);
            const newRole = response.data.map((role) => {
                return { ...role, selected: false, maxQuantity: 5, availableQuantity: 5 };
            });
            setAllRoles(newRole);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        const fetchRoleInEvent = async (params) => {
            try {
                const response = await eventApi.getAllOrganizingCommitteeRoleByEventId(params);
                console.log('fetchRoleInEvent', response);
                const newRole = response.data.map((role) => {
                    return { ...role, selected: true };
                });
                setRoleList(newRole);
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        isRender && fetchRoleInEvent(id);
    }, [id, roleList, isRender]);

    const fetchAdminInEvent = async (params, index) => {
        try {
            const response = await eventApi.getAllMemberEvent(params, index);
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
        isRender && fetchAdminInEvent(id, 2);
        isRender && getAllRoleEvent();
        SetIsRender(false);
    }, [id, notiStatus, adminList, isRender, allRoles]);

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
                    <ToggleButton
                        value={2}
                        sx={{
                            p: 1,
                            borderRadius: '10px !important',
                            border: 'none',
                            textTransform: 'none',
                        }}
                    >
                        XÉT DUYỆT THAM GIA
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <Button variant="outlined" sx={{ m: 1, mt: 0 }} onClick={() => setOpenDialogEdit(true)}>
                Chỉnh sửa vai trò của giải đấu
            </Button>
            {notiStatus === 0 && (
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
            )}
            {notiStatus === 1 && <AddMemberToAdminEvent roleList={roleList} roles={allRoles} />}
            {notiStatus === 2 && (
                <AddAdminTourament
                    onChange={() => {
                        SetIsRender(true);
                        // onChange && onChange();
                    }}
                />
            )}
            {allRoles.length > 0 && roleList.length > 0 && (
                <UpdateRole
                    title="Chỉnh sửa vai trò ban tổ chức"
                    isOpen={openDialogEdit}
                    handleClose={() => {
                        setOpenDialogEdit(false);
                    }}
                    id={id}
                    user={user}
                    roleInTournament={roleList}
                    roles={allRoles}
                    onSuccess={() => {
                        // if (competitivePlayer.find((player) => player.playerStudentId == newItem.playerStudentId)) {
                        //     return;
                        // }
                        // setCompetitivePlayer([...newItem, ...competitivePlayer]);
                        // Success && Success(newItem);
                        setOpenDialogEdit(false);
                    }}
                    onChange={() => {
                        // onChange && onChange();
                        SetIsRender(true);
                    }}
                />
            )}
        </Fragment>
    );
}

export default AdminTournament;
