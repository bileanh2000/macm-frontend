import React, { Fragment, useEffect, useState } from 'react';
import { CurrencyExchange, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { Assessment } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    MenuItem,
    Select,
    Snackbar,
    Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import DialogCommon from 'src/Components/Dialog/Dialog';
import { Link, useParams } from 'react-router-dom';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import adminFunAPi from 'src/api/adminFunAPi';
import { styled } from '@mui/system';
import { useSnackbar } from 'notistack';
import TournamentSumUp from './TournamentSumUp';

function TournamentPayment({ tournament, tournamentStatus, value, index, user, isFinish }) {
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [funClub, setFunClub] = useState('');
    const [type, setType] = useState(1);
    const [userPaymentStatus, setUserPaymentStatus] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [paymentStatus, setPaymentStatus] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [idMember, setIdMember] = useState();
    const [openSumUpDialog, setOpenSumUpDialog] = useState(false);
    const [adminList, setAdminList] = useState([]);
    const [userList, setUserList] = useState([]);

    let payment = userPaymentStatus.reduce((pay, user) => {
        return user.paymentStatus ? pay + 1 : pay;
    }, 0);

    const handleCloseConfirm = () => {
        setIdMember();
        setOpenConfirm(false);
    };

    const handleOpenConfirm = () => {
        updateUserPayment(idMember.id);
        const newUserList = userPaymentStatus.map((user) => {
            return user.id === idMember.id ? { ...user, paymentStatus: !user.paymentStatus } : user;
        });
        console.log(newUserList);
        setUserPaymentStatus(newUserList);
        handleCloseConfirm();
    };

    const handleDialogOpen = () => {
        setOpenSumUpDialog(true);
    };

    const fetchFunClub = async () => {
        try {
            const response = await adminFunAPi.getClubFund();
            console.log(response.data[0]);
            setFunClub(response.data[0].fundAmount);
        } catch (error) {
            console.log('Failed to fetch fund club: ', error);
        }
    };

    const handleChangeType = (event) => {
        setType(event.target.value);
        fetchUserPaymentStatus(tournamentId, event.target.value);
    };

    const fetchUserPaymentStatus = async (tournamentId, type) => {
        try {
            if (type === 1) {
                const response = await adminTournamentAPI.getAllTournamentOrganizingCommitteePaymentStatus(
                    tournamentId,
                );
                response.message === 'Giải đấu không yêu cầu ban tổ chức đóng phí tham gia'
                    ? setPaymentStatus(false)
                    : setPaymentStatus(true);
                console.log(response.message === 'Giải đấu không yêu cầu ban tổ chức đóng phí tham gia');
                setUserPaymentStatus(response.data);
            } else {
                const response = await adminTournamentAPI.getAllTournamentPlayerPaymentStatus(tournamentId);
                console.log(response.data);
                response.message === 'Giải đấu không yêu cầu người chơi đóng phí tham gia'
                    ? setPaymentStatus(false)
                    : setPaymentStatus(true);
                console.log(response.message === 'Giải đấu không yêu cầu người chơi đóng phí tham gia');
                setUserPaymentStatus(response.data);
            }
        } catch (error) {
            console.log('Không thể lấy danh sách đóng tiền của ban tổ chức');
        }
    };

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await adminTournamentAPI.getAllTournamentPlayerPaymentStatus(tournamentId);
                setUserList(response.data);
            } catch (error) {
                console.log('Không thể lấy danh sách đóng tiền của ban tổ chức');
            }
        };
        const fetchAdminList = async () => {
            try {
                const response = await adminTournamentAPI.getAllTournamentOrganizingCommitteePaymentStatus(
                    tournamentId,
                );
                setAdminList(response.data);
            } catch (error) {
                console.log('Không thể lấy danh sách đóng tiền của ban tổ chức');
            }
        };
        fetchUserList();
        fetchAdminList();
    }, [tournamentId]);

    useEffect(() => {
        fetchUserPaymentStatus(tournamentId, type);
        fetchFunClub();
    }, [tournamentId, type]);

    const columns = [
        { field: 'userName', headerName: 'Tên', width: 150, flex: 0.8 },
        { field: 'userStudentId', headerName: 'Mã sinh viên', width: 150, flex: 0.5 },
        {
            field: 'paymentStatus',
            headerName: 'Trạng thái',
            width: 150,
            flex: 0.5,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('status-rows', {
                    active: params.value === 'Đã đóng',
                    deactive: params.value === 'Chưa đóng',
                });
            },
        },
        {
            field: 'pay',
            type: 'actions',
            headerName: 'Đã đóng',
            width: 50,
            flex: 0.3,
            cellClassName: 'actions',
            getActions: (params) => {
                if (params.row.paymentStatus == 'Đã đóng') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonChecked />}
                            label="Đã đóng"
                            onClick={() => toggleStatus(params.row, type)}
                            color="primary"
                            aria-details="Đã đóng"
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Đã đóng"
                        onClick={() => toggleStatus(params.row, type)}
                    />,
                ];
            },
        },
        {
            field: 'notpay',
            type: 'actions',
            headerName: 'Chưa đóng',
            width: 50,
            flex: 0.3,
            cellClassName: 'actions',
            getActions: (params) => {
                if (params.row.paymentStatus == 'Đã đóng') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Chưa đóng"
                            onClick={() => toggleStatus(params.row, type)}
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonChecked />}
                        label="Chưa đóng"
                        onClick={() => toggleStatus(params.row, type)}
                        color="primary"
                    />,
                ];
            },
        },
    ];

    const rowsUser = userPaymentStatus.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['userName'] = item.userName;
        container['userStudentId'] = item.userStudentId;
        container['paymentStatus'] = item.paymentStatus ? 'Đã đóng' : 'Chưa đóng';
        return container;
    });

    const updateUserPayment = async (id) => {
        try {
            if (type === 1) {
                const response = await adminTournamentAPI.updateTournamentOrganizingCommitteePaymentStatus(
                    id,
                    user.studentId,
                );
                enqueueSnackbar(response.message, { variant: 'success' });
            } else {
                const response = await adminTournamentAPI.updateTournamentPlayerPaymentStatus(id, user.studentId);
                enqueueSnackbar(response.message, { variant: 'success' });
            }
        } catch (error) {
            console.log('không thể cập nhật trạng thái đóng tiền');
        }
    };

    const toggleStatus = (id, type) => {
        setIdMember(id);
        console.log(id);
        setOpenConfirm(true);
    };

    function CustomToolbar() {
        return (
            <Fragment>
                <GridToolbarContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <GridToolbarQuickFilter />
                        {/* <GridToolbarFilterButton /> */}
                    </Box>
                    {/* <Button
                        startIcon={<Assessment />}
                        size="small"
                        sx={{ marginLeft: 'auto', marginRight: '1rem' }}
                        component={Link}
                        to={`report/${type}`}
                    >
                        Lịch sử đóng tiền sự kiện
                    </Button>*/}
                </GridToolbarContainer>
            </Fragment>
        );
    }

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', m: 2, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }}>
                    <FormControl size="small">
                        <Typography variant="caption">Danh sách đóng tiền</Typography>
                        <Select id="demo-simple-select" value={type} displayEmpty onChange={handleChangeType}>
                            <MenuItem value={1}>Ban tổ chức</MenuItem>
                            <MenuItem value={2}>Người chơi</MenuItem>
                        </Select>
                    </FormControl>
                    {type === 1 ? (
                        paymentStatus ? (
                            <Typography variant="body1" sx={{ color: 'red', ml: 5 }}>
                                Số tiền mỗi người trong ban tổ chức phải đóng:{' '}
                                {tournament.feeOrganizingCommiteePay?.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </Typography>
                        ) : (
                            ''
                        )
                    ) : paymentStatus ? (
                        <Typography variant="body1" sx={{ color: 'red', ml: 5 }}>
                            Số tiền mỗi người chơi phải đóng:{' '}
                            {tournament.feePlayerPay?.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </Typography>
                    ) : (
                        ''
                    )}
                </Box>
                {isFinish && tournament.totalAmount === 0 ? (
                    <Button
                        variant="outlined"
                        startIcon={<CurrencyExchange />}
                        sx={{ ml: 1 }}
                        onClick={handleDialogOpen}
                    >
                        Tổng kết chi phí sau giải đấu
                    </Button>
                ) : tournament && !isFinish ? (
                    ''
                ) : (
                    <Typography variant="subtitle1">Giải đấu đã tổng kết</Typography>
                )}
                <Button variant="outlined" startIcon={<CurrencyExchange />} sx={{ ml: 1 }} onClick={handleDialogOpen}>
                    Tổng kết chi phí sau giải đấu
                </Button>
            </Box>
            {/* <Grid item xs={4}>
                    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        Số dư câu lạc bộ hiện tại:{' '}
                        {funClub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                    <Typography variant="h6" sx={{ float: 'right' }}>
                        Đã đóng: {payment}/{userPaymentStatus.length}
                    </Typography>
                </Grid> */}

            {idMember && (
                <Dialog
                    open={openConfirm}
                    onClose={handleCloseConfirm}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        Xác nhận
                    </DialogTitle>
                    <DialogContent>
                        Bạn có chắc chắn muốn cập nhật trạng thái đóng tiền cho <strong>{idMember.userName}</strong>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={handleCloseConfirm}>
                            Hủy
                        </Button>
                        <Button variant="contained" onClick={handleOpenConfirm} autoFocus>
                            Đồng ý
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {paymentStatus ? (
                <Box
                    sx={{
                        height: '70vh',
                        width: '100%',
                        '& .status-rows': {
                            // justifyContent: 'center !important',
                        },
                        '& .status-rows.active .MuiDataGrid-cellContent': {
                            backgroundColor: '#56f000',
                            color: '#fff',
                            fontWeight: '600',
                            textAlign: 'center',
                            padding: 1,
                            borderRadius: 5,
                        },
                        '& .status-rows.deactive .MuiDataGrid-cellContent': {
                            backgroundColor: '#ff3838',
                            color: '#fff',
                            fontWeight: '600',
                            textAlign: 'center',
                            padding: 1,
                            borderRadius: 5,
                        },
                    }}
                >
                    <DataGrid
                        //loading={!userPaymentStatus.length}
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
            ) : (
                <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    {type == 1
                        ? 'Giải đấu không yêu cầu ban tổ chức đóng phí tham gia'
                        : 'Giải đấu không yêu cầu người chơi đóng phí tham gia'}
                </Typography>
            )}
            {tournament && userList && adminList && (
                <TournamentSumUp
                    title="Tổng kết chi phí sau giải đấu"
                    params={{ tournament, userList, adminList, funClub }}
                    isOpen={openSumUpDialog}
                    handleClose={() => {
                        setOpenSumUpDialog(false);
                    }}
                    onSucess={(newItem) => {
                        setFunClub((prev) => prev + newItem);
                        setOpenSumUpDialog(false);
                    }}
                    user={user}
                />
            )}
        </Box>
    );
}

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
export default TournamentPayment;
