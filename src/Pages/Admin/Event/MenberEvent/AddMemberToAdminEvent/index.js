import React, { useState } from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import clsx from 'clsx';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { renderSelectEditCell } from './RenderSelectEditCell';
import { useForm } from 'react-hook-form';
import eventApi from 'src/api/eventApi';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function AddMemberToAdminEvent({ adminList, value, index, active, total, isUpdate, user, Success }) {
    const [pageSize, setPageSize] = useState(30);
    const [userList, setUserList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    let { id } = useParams();

    const fetchUserInEvent = async (params) => {
        try {
            const response = await eventApi.getListMemberToUpdate(params);
            console.log(response);
            setUserList(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    const fetchRoleInEvent = async (params) => {
        try {
            const response = await eventApi.getAllOrganizingCommitteeRoleByEventId(params);
            console.log(response);
            setRoleList(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    const roles = roleList.map((role) => {
        return { roleId: role.id, roleName: role.name };
    });
    const formatRoles = [{ id: 0, roleId: 1, roleName: 'Thành viên tham gia' }, ...roles];
    // const roles = [
    //     { roleId: 1, roleName: 'Thành viên tham gia' },
    //     { roleId: 2, roleName: 'Thành viên ban truyền thông' },
    //     { roleId: 3, roleName: 'Thành viên ban văn hóa' },
    //     { roleId: 4, roleName: 'Thành viên ban hậu cần' },
    // ];
    useEffect(() => {
        fetchUserInEvent(id);
        fetchRoleInEvent(id);
        // console.log('role', formatRoles);
    }, [index, id, value]);

    const columns = [
        { field: 'studentName', headerName: 'Tên', flex: 1 },
        // {
        //     field: 'userMail',
        //     headerName: 'Email',
        //     flex: 1,
        // },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            flex: 1,
        },
        {
            field: 'roleInClub',
            headerName: 'Vai trò trong CLB',
            flex: 1,
        },

        // <MenuItem value={1}>Thành viên tham gia</MenuItem>
        //         <MenuItem value={2}>Thành viên ban truyền thông</MenuItem>
        //         <MenuItem value={3}>Thành viên ban hậu cần</MenuItem>
        //         <MenuItem value={4}>Thành viên ban văn hóa</MenuItem>
        {
            field: 'role',
            headerName: `Vai trò trong sự kiện`,
            flex: 1,
            editable: true,
            type: 'singleSelect',
            valueOptions: formatRoles.map((role) => role.roleName),
            // valueOptions: roleValueOptions,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('role-edit');
            },
        },
    ];

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['studentName'] = item.userName;
        container['studentId'] = item.userStudentId;
        container['userMail'] = item.userMail;
        container['attendanceStatus'] = item.attendanceStatus ? 'Đã đăng kí' : 'Đã hủy';
        container['role'] = item.roleEventDto.name;
        container['roleInClub'] = item.roleInClub;
        container['paymentStatus'] = item.paymentStatus ? 'Đã đóng' : 'Chưa đóng';
        return container;
    });

    const handleRowEditCommit = React.useCallback(
        (params) => {
            const id = params.id;
            const key = params.field;
            const value = params.value;
            console.log(id, key, value, params);
            console.log(roles);

            const newRole = formatRoles && formatRoles.find((role) => role.roleName === value);
            console.log('new role', newRole);
            console.log(userList);
            const newMemberList =
                userList &&
                userList.map((member) =>
                    member.id == id
                        ? { ...member, roleEventDto: { id: newRole.roleId, name: newRole.roleName } }
                        : member,
                );
            setUserList(newMemberList);
        },
        [userList],
    );
    const handleUpdate = () => {
        console.log('submit', userList);
        eventApi.updateMemberRole(userList).then((res) => {
            console.log(res);
            console.log(res.data);
            enqueueSnackbar(res.message, { variant: 'success' });
            handleCloseDialog();
            // navigate(-1);
            // if (res.message === 'Cập nhật chức vụ cho thành viên trong sự kiện thành công') {

            // }
        });
    };
    const CustomToolbar = () => {
        return (
            <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
                <Box
                    sx={{
                        p: 0.5,
                        pb: 0,
                    }}
                >
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
        );
    };
    // if (index === 1) {
    //     return null;
    // } else
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xác nhận</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Bạn có muốn lưu các thay đổi ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Từ chối</Button>
                    <Button onClick={handleUpdate} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>

            <Typography variant="caption" sx={{ mb: 3 }}>
                Bấm vào vai trò của từng người để chỉnh sửa
            </Typography>
            <p></p>
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                    '& .role-edit::before': {
                        // backgroundColor: 'red !important',
                        content: "'\\270E'",
                        // color: 'red',
                        fontSize: '1.2rem',
                    },
                }}
            >
                <DataGrid
                    // loading={!userList.length}
                    disableSelectionOnClick={true}
                    rows={rowsUser}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[30, 40, 50]}
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                    onCellEditCommit={handleRowEditCommit}
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleOpenDialog} sx={{ mt: 3 }}>
                    Lưu lại
                </Button>
            </Box>
        </div>
    );
}

export default AddMemberToAdminEvent;
