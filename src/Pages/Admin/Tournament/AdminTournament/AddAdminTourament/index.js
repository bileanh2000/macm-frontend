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
// import { renderSelectEditCell } from './RenderSelectEditCell';
import { useForm } from 'react-hook-form';
import eventApi from 'src/api/eventApi';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
let snackBarStatus;

// const _memberList = [
//     {
//         id: 10,
//         studentName: 'Duong Thanh Tung',
//         studentId: 'HE123456',
//         attendanceStatus: true,
//         role: { roleId: 2, roleName: 'Thành viên ban văn hóa' },
//         paymentStatus: true,
//     },
//     {
//         id: 20,
//         studentName: 'Pham Minh Duc',
//         studentId: 'HE456789',
//         attendanceStatus: true,
//         role: { roleId: 1, roleName: 'Thành viên ban truyền thông' },
//         paymentStatus: true,
//     },
//     {
//         id: 30,
//         studentName: 'Dam Van Toan',
//         studentId: 'HE987654',
//         attendanceStatus: true,
//         role: { roleId: 3, roleName: 'Thành viên ban hậu cần' },
//         paymentStatus: true,
//     },
// ];

const roles = [
    {
        roleId: 1,
        roleName: 'Thành viên ban truyền thông',
    },
    { roleId: 2, roleName: 'Thành viên ban văn hóa' },
    { roleId: 3, roleName: 'Thành viên ban hậu cần' },
];

function AddAdminTourament() {
    const [pageSize, setPageSize] = useState(10);
    const [newList, setNewList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);

    let navigate = useNavigate();
    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    let { id } = useParams();

    const fetchUserInEvent = async (params) => {
        // try {
        //     const response = await eventApi.getListMemberToUpdate(params);
        //     console.log(response);
        //     setUserList(response.data);
        // } catch (error) {
        //     console.log('Failed to fetch user list: ', error);
        // }
    };

    useEffect(() => {
        fetchUserInEvent(id);
    }, [id]);

    const columns = [
        { field: 'studentName', headerName: 'Tên', flex: 0.8 },
        {
            field: 'userMail',
            headerName: 'Email',
            width: 150,
            flex: 0.6,
        },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.6,
        },
        {
            field: 'roleInClub',
            headerName: 'Vai trò trong CLB',
            width: 150,
            flex: 0.6,
        },

        // <MenuItem value={1}>Thành viên tham gia</MenuItem>
        //         <MenuItem value={2}>Thành viên ban truyền thông</MenuItem>
        //         <MenuItem value={3}>Thành viên ban hậu cần</MenuItem>
        //         <MenuItem value={4}>Thành viên ban văn hóa</MenuItem>
        {
            field: 'role',
            headerName: `Vai trò trong sự kiện ${1 + 1 + 2}`,
            width: 150,
            flex: 0.6,
            editable: true,
            type: 'singleSelect',
            // valueOptions: roles.map((role) => role.roleName),
            valueOptions: [
                { label: 'Thành viên tham gia', value: 1 },
                { label: 'Thành viên ban truyền thông', value: 2 },
                { label: 'Thành viên ban hậu cần', value: 3 },
                { label: 'Thành viên ban văn hóa', value: 4 },
            ],
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

    const { handleSubmit } = useForm({});

    const handleRowEditCommit = React.useCallback((params) => {
        const id = params.id;
        const key = params.field;
        const value = params.value;
        console.log(id, key, value, params);
        const newRole = roles.find((role) => role.roleName == value);
        console.log(newRole);
        console.log(userList);
        const newMemberList = userList.map((member) => (member.id === id ? { ...member, role: newRole } : member));
        setNewList(newMemberList);
    }, []);

    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });

    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };
    const handleUpdate = () => {
        console.log('submit', newList);
        eventApi.updateMemberRole(newList).then((res) => {
            console.log(res);
            console.log(res.data);
            if (res.message === 'Cập nhật chức vụ cho thành viên trong sự kiện thành công') {
                setOpenSnackBar(true);
                // setSnackBarStatus(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
                setTimeout(navigate(-1), 3000);
            }
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

    return (
        <div>
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
            <Snackbar
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleCloseSnackBar}
                    variant="filled"
                    severity={customAlert.severity || 'success'}
                    sx={{ width: '100%' }}
                >
                    {customAlert.message}
                </Alert>
            </Snackbar>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Cập nhật vai trò thành viên trong sự kiện
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
                    loading={!userList.length}
                    disableSelectionOnClick={true}
                    rows={rowsUser}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 30]}
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

export default AddAdminTourament;
