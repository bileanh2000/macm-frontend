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
    styled,
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

function AddAdminTourament({ value, index, total, active }) {
    let { tournamentId } = useParams();
    const [pageSize, setPageSize] = useState(10);
    const [userList, setUserList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [isApprove, setIsApprove] = useState(false);
    const [idUpdate, setIdUpdate] = useState(0);
    const [_active, setActive] = useState(active);

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
        { field: 'studentName', headerName: 'Tên', width: 100, flex: 0.5 },
        {
            field: 'studentId',
            headerName: 'Mã sinh viên',
            width: 100,
            flex: 0.3,
        },
        {
            field: 'roleInTournament',
            headerName: 'Vai trò mong muốn trong ban tổ chức',
            width: 150,
            flex: 0.6,
        },
        // {
        //     field: 'registerStatus',
        //     headerName: 'Trạng thái',
        //     width: 50,
        //     flex: 0.5,
        // },
        {
            field: 'actions',
            type: 'actions',
            width: 150,
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
            hide: _active === 10,
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
        // navigate(-1);
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
                <Typography variant="body1" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Số lượng thành viên trong ban tổ chức: {_active}/{total}
                </Typography>
            </GridToolbarContainer>
        );
    };
    const StyledGridOverlay = styled('div')(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '& .ant-empty-img-1': {
            fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
        },
        '& .ant-empty-img-2': {
            fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
        },
        '& .ant-empty-img-3': {
            fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
        },
        '& .ant-empty-img-4': {
            fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
        },
        '& .ant-empty-img-5': {
            fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
            fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
        },
    }));
    function CustomNoRowsOverlay() {
        return (
            <StyledGridOverlay>
                <svg width="120" height="100" viewBox="0 0 184 152" aria-hidden focusable="false">
                    <g fill="none" fillRule="evenodd">
                        <g transform="translate(24 31.67)">
                            <ellipse className="ant-empty-img-5" cx="67.797" cy="106.89" rx="67.797" ry="12.668" />
                            <path
                                className="ant-empty-img-1"
                                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                            />
                            <path
                                className="ant-empty-img-2"
                                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                            />
                            <path
                                className="ant-empty-img-3"
                                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                            />
                        </g>
                        <path
                            className="ant-empty-img-3"
                            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                        />
                        <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                        </g>
                    </g>
                </svg>
                <Box sx={{ mt: 1 }}>Danh sách trống</Box>
            </StyledGridOverlay>
        );
    }

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
                <DataGrid
                    // loading={!userList.length}
                    disableSelectionOnClick={true}
                    rows={rowsUser}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 30]}
                    components={{
                        Toolbar: CustomToolbar,
                        NoRowsOverlay: CustomNoRowsOverlay,
                    }}
                />
            </Box>
        </div>
    );
}

export default AddAdminTourament;
