import React, { Fragment, useEffect, useState } from 'react';
import { RadioButtonChecked, RadioButtonUnchecked, Assessment, CurrencyExchange } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Snackbar,
    styled,
    Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import DialogCommon from 'src/Components/Dialog/Dialog';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import adminClubFeeAPI from 'src/api/adminClubFeeAPI';
import adminFunAPi from 'src/api/adminFunAPi';
import eventApi from 'src/api/eventApi';
import EventSumUp from './EventSumUp';

function EventFeePayment({ event, value, index }) {
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [funClub, setFunClub] = useState('');
    const [openSumUpDialog, setOpenSumUpDialog] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [status, setStatus] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();
    const [idMember, setIdMember] = useState();
    const [isRender, setIsRender] = useState(true);
    const history = useNavigate();

    let payment = userList.reduce((paymentCount, user) => {
        return user.paymentStatus ? paymentCount + 1 : paymentCount;
    }, 0);

    const fetchFunClub = async () => {
        try {
            const response = await adminFunAPi.getClubFund();
            console.log(response.data[0].fundAmount);
            setFunClub(response.data[0].fundAmount);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const getUserJoinEvent = async (eventId) => {
        try {
            const response = await adminClubFeeAPI.getUserJoinEvent(eventId);
            console.log(response.data);
            setUserList(response.data);
        } catch (error) {}
    };

    const updateUserPayment = async (id) => {
        try {
            const response = await adminClubFeeAPI.updateUserPayment(id);
            enqueueSnackbar(response.message, { variant: 'success' });
            setIsRender(true);
        } catch (error) {
            console.log('không thể cập nhật trạng thái đóng tiền');
        }
    };

    useEffect(() => {
        isRender && getUserJoinEvent(id);
        setIsRender(false);
    }, [id, userList, isRender]);

    useEffect(() => {
        fetchFunClub();
    }, []);

    const handleDialogOpen = () => {
        setOpenSumUpDialog(true);
    };
    const handleCloseConfirm = () => {
        setIdMember(-1);
        setOpenConfirm(false);
    };

    const handleOpenConfirm = () => {
        updateUserPayment(idMember);
        handleCloseConfirm();
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'userName', headerName: 'Tên', flex: 0.8 },
        { field: 'userStudentId', headerName: 'Mã sinh viên', width: 150, flex: 0.6 },
        {
            field: 'paymentStatus',
            headerName: 'Trạng thái',
            flex: 0.5,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('status-rows', {
                    active: params.value === 'Đã đóng',
                    deactive: params.value === 'Chưa đóng',
                    subActive: params.value === 'Chưa đóng đủ',
                });
            },
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Đã đóng - Chưa đóng',
            width: 100,
            flex: 0.5,
            cellClassName: 'actions',
            getActions: (params) => {
                if (params.row.paymentStatus == 'Đã đóng') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonChecked />}
                            label="Đã đóng"
                            onClick={() => toggleStatus(params.row.id, true)}
                            color="primary"
                            aria-details="Đã đóng"
                        />,
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Chưa đóng"
                            onClick={() => toggleStatus(params.row.id, false)}
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Đã đóng"
                        onClick={() => toggleStatus(params.row.id, true)}
                    />,
                    <GridActionsCellItem
                        icon={<RadioButtonChecked />}
                        label="Chưa đóng"
                        onClick={() => toggleStatus(params.row.id, false)}
                        color="primary"
                    />,
                ];
            },
            // hide: view,
        },
    ];

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['userName'] = item.userName;
        container['userStudentId'] = item.userStudentId;

        //check status of payment
        let paymentStatus;
        if (item.amountPerRegisterActual == 0) {
            paymentStatus = item.paymentValue == 0 ? 'Chưa đóng' : 'Đã đóng';
        } else {
            if (item.paymentValue == 0) {
                paymentStatus = 'Chưa đóng';
            } else if (
                item.paymentValue == item.amountPerRegisterEstimate &&
                item.paymentValue < item.amountPerRegisterActual
            ) {
                paymentStatus = 'Chưa đóng đủ';
            } else if (item.paymentValue == item.amountPerRegisterActual) {
                paymentStatus = 'Đã đóng';
            }
        }
        container['paymentStatus'] = paymentStatus;
        return container;
    });

    const toggleStatus = (id, status) => {
        setIdMember(id);
        setStatus(status);
        setOpenConfirm(true);
    };

    function CustomToolbar() {
        return (
            <Fragment>
                <GridToolbarContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <GridToolbarQuickFilter />
                    </Box>
                    <Typography variant="subtitle1" sx={{ marginLeft: 'auto', marginRight: '1rem' }}>
                        Đã đóng tiền: {payment}/{userList.length}
                    </Typography>
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
            {event && userList && (
                <EventSumUp
                    title="Tổng kết chi phí sau sự kiện"
                    params={{ event, userList, funClub }}
                    isOpen={openSumUpDialog}
                    handleClose={() => {
                        setOpenSumUpDialog(false);
                    }}
                    onSucess={(newItem) => {
                        setFunClub((prev) => prev + newItem);
                        setOpenSumUpDialog(false);
                    }}
                />
            )}

            <Dialog
                fullWidth
                maxWidth="md"
                open={openConfirm}
                onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    Xác nhận
                </DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn cập nhật trạng thái đóng tiền</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm}>Hủy</Button>
                    <Button onClick={handleOpenConfirm} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>

            {event && (
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h6" sx={{ color: 'red', marginRight: 5 }}>
                        Số tiền :{' '}
                        {event.amountPerRegisterEstimated.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                        {event.status === 'Đã kết thúc' && event.totalAmountActual === 0 ? (
                            <Button
                                variant="outlined"
                                startIcon={<CurrencyExchange />}
                                sx={{ ml: 1 }}
                                onClick={handleDialogOpen}
                            >
                                Tổng kết chi phí sau sự kiện
                            </Button>
                        ) : event && event.status !== 'Đã kết thúc' ? (
                            ''
                        ) : (
                            <Typography variant="subtitle1">Sự kiện đã tổng kết</Typography>
                        )}
                    </Typography>
                </Box>
            )}
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

export default EventFeePayment;
