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
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import adminTournamentAPI from 'src/api/adminTournamentAPI';

let snackBarStatus;

function UpdateAdminTournament() {
    let { tournamentId } = useParams();
    let navigate = useNavigate();

    const [pageSize, setPageSize] = useState(10);
    const [adminList, setAdminList] = useState([]);
    const [roles, setRoles] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });

    const handleRowEditCommit = React.useCallback(
        (params) => {
            const id = params.id;
            const key = params.field;
            const value = params.value;
            console.log(id, key, value, params);
            const newRole = roles.find((role) => role.name == value);
            console.log(newRole);
            console.log(adminList);
            const newAdminList = adminList.map((member) =>
                member.id === id ? { ...member, roleTournamentDto: newRole } : member,
            );
            setAdminList(newAdminList);
        },
        [adminList, roles],
    );

    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };
    const handleUpdate = () => {
        console.log('submit', adminList);
        adminTournamentAPI.updateTournamentOrganizingCommitteeRole(adminList).then((res) => {
            console.log(res);
            console.log(res.data);
            if (res.message === 'Cập nhật chức vụ cho thành viên trong sự kiện thành công') {
                setOpenSnackBar(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
                setTimeout(navigate(-1), 3000);
            }
        });
        navigate(-1);
    };

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

    const fetchRolesInTournament = async () => {
        try {
            const response = await adminTournamentAPI.getAllOrginizingCommitteeRole();
            console.log(response.data);
            setRoles(response.data);
        } catch (error) {
            console.log('Không thể lấy danh sách vai trò  trong giải đấu, error: ', error);
        }
    };

    useEffect(() => {
        fetchAdminInTournament(tournamentId);
        fetchRolesInTournament();
    }, [tournamentId]);

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

    const columns = [
        { field: 'studentName', headerName: 'Tên', flex: 0.8 },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.6,
        },
        {
            field: 'role',
            headerName: `Vai trò trong giải đấu`,
            width: 150,
            flex: 0.6,
            editable: true,
            type: 'singleSelect',
            valueOptions: roles.map((role) => {
                return { label: role.name, value: role.name };
            }),
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('role-edit');
            },
        },
    ];

    const rowsUser = adminList.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['studentName'] = item.userName;
        container['studentId'] = item.userStudentId;
        container['role'] = item.roleTournamentDto.name;
        return container;
    });

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
                {adminList.length > 0 && roles ? (
                    <DataGrid
                        loading={!adminList.length}
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
                ) : (
                    <Typography variant="h4" sx={{ mb: 3, margin: 'auto' }}>
                        Chưa có thành viên trong ban tổ chức
                    </Typography>
                )}
            </Box>
            {adminList.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={handleOpenDialog} sx={{ mt: 3 }}>
                        Lưu lại
                    </Button>
                </Box>
            )}
        </div>
    );
}

export default UpdateAdminTournament;
