import React, { useState, useEffect } from 'react';
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
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import adminTournamentAPI from 'src/api/adminTournamentAPI';

let snackBarStatus;

function AddAdminTourament() {
    let { tournamentId } = useParams();
    const [pageSize, setPageSize] = useState(10);
    const [userList, setUserList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [isApprove, setIsApprove] = useState(false);
    const [idUpdate, setIdUpdate] = useState(0);
    const [active, setActive] = useState(-1);
    const [total, setTotal] = useState(-1);

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
    const handleOpenDialog = (id, isApprove) => {
        setIsApprove(isApprove);
        setIdUpdate(id);
        setOpenDialog(true);
    };

    const fetchAdminInTournament = async (params) => {
        try {
            const response = await adminTournamentAPI.getAllTournamentOrganizingCommittee(params);
            console.log(response);
            setActive(response.totalActive);
            setTotal(response.totalResult);
            const newUser = response.data.filter((user) => user.registerStatus === 'Đang chờ duyệt');
            console.log(newUser);
            setUserList(newUser);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        fetchAdminInTournament(tournamentId);
    }, [tournamentId]);

    const columns = [
        { field: 'studentName', headerName: 'Tên', flex: 0.5 },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 150,
            flex: 0.5,
        },
        {
            field: 'roleInTournament',
            headerName: 'Vai trò mong muốn trong ban tổ chức',
            width: 150,
            flex: 0.8,
        },

        {
            field: 'registerStatus',
            headerName: `Trạng thái`,
            width: 150,
            flex: 0.5,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
            flex: 0.5,
            cellClassName: 'actions',
            getActions: (params) => {
                return [
                    <Button
                        component="button"
                        label="Đã đóng"
                        onClick={() => handleOpenDialog(params.row.id, true)}
                        style={{ backgroundColor: 'aquamarine' }}
                    >
                        Chấp nhận
                    </Button>,
                    <Button
                        component="button"
                        label="Đã đóng"
                        onClick={() => handleOpenDialog(params.row.id, false)}
                        style={{ backgroundColor: 'lightcoral' }}
                    >
                        Từ chối
                    </Button>,
                ];
            },
            hide: active === 10,
        },
    ];

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['studentName'] = item.userName;
        container['studentId'] = item.userStudentId;
        container['roleInTournament'] = item.roleTournamentDto.name;
        container['registerStatus'] = item.registerStatus;
        return container;
    });

    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });

    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    const acceptRequestToJoinOrganizingCommittee = async (organizingCommitteeId) => {
        try {
            const response = await adminTournamentAPI.acceptRequestToJoinOrganizingCommittee(organizingCommitteeId);
            setOpenSnackBar(true);
            snackBarStatus = true;
            dynamicAlert(snackBarStatus, response.message);
        } catch (error) {
            console.log('Khong the chap thuan yeu cau nay, loi:', error);
            setOpenSnackBar(true);
            snackBarStatus = true;
            dynamicAlert(snackBarStatus, 'Khong the chap thuan yeu cau nay');
        }
    };

    const declineRequestToJoinOrganizingCommittee = async (organizingCommitteeId) => {
        try {
            const response = await adminTournamentAPI.declineRequestToJoinOrganizingCommittee(organizingCommitteeId);
            setOpenSnackBar(true);
            snackBarStatus = true;
            dynamicAlert(snackBarStatus, response.message);
        } catch (error) {
            console.log('Khong the chap thuan yeu cau nay, loi:', error);
            setOpenSnackBar(true);
            snackBarStatus = true;
            dynamicAlert(snackBarStatus, 'Khong the chap thuan yeu cau nay');
        }
    };
    const handleUpdate = () => {
        console.log(idUpdate, isApprove);
        if (isApprove) {
            acceptRequestToJoinOrganizingCommittee(idUpdate);
            setActive((prev) => prev + 1);
        } else {
            declineRequestToJoinOrganizingCommittee(idUpdate);
        }

        const newUser = userList.filter((user) => user.id !== idUpdate);
        setUserList(newUser);

        handleCloseDialog();
        navigate(-1);
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
                Xét duyệt thành viên vào ban tổ chức giải đấu
            </Typography>
            {active > 0 && total > 0 && (
                <Typography variant="body1" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Số lượng thành viên trong ban tổ chức: {active}/{total}
                </Typography>
            )}
            <p></p>
            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                    '& .role-edit::before': {
                        content: "'\\270E'",
                        fontSize: '1.2rem',
                    },
                }}
            >
                {userList.length > 0 ? (
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
                    />
                ) : (
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Không có yêu cầu đăng kí vào btc nào
                    </Typography>
                )}
            </Box>
        </div>
    );
}

export default AddAdminTourament;
