import React, { Fragment, useEffect, useState } from 'react';
import { RadioButtonChecked, RadioButtonUnchecked, Assessment, CurrencyExchange } from '@mui/icons-material';
import { Alert, Box, Button, Grid, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import DialogCommon from 'src/Components/Dialog/Dialog';
import { Link, useNavigate, useParams } from 'react-router-dom';

import adminClubFeeAPI from 'src/api/adminClubFeeAPI';
import adminFunAPi from 'src/api/adminFunAPi';
import eventApi from 'src/api/eventApi';
import EventSumUp from '../EventSumUp';
import ClubFee from '../..';

function EventFee() {
    const [userList, setUserList] = useState([]);
    const [event, setEvent] = useState();
    // const [view, setView] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [funClub, setFunClub] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const [openSumUpDialog, setOpenSumUpDialog] = useState(false);
    const [status, setStatus] = useState(false);
    const [editDialog, setEditDialog] = useState({
        message: '',
        isLoading: false,
        params: -1,
    });
    const { eventId } = useParams();
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

    const getEventById = async (eventId) => {
        try {
            const response = await eventApi.getAll();
            let selectedEvent = response.data.filter((item) => item.id === parseInt(eventId, 10));
            const response2 = await eventApi.getEventById(eventId);
            const newEvent = response2.data && {
                totalAmountActual: response2.data[0].totalAmountActual,
                ...selectedEvent[0],
            };
            console.log(newEvent);
            setEvent(newEvent);
            // selectedEvent.status === 'Đã kết thúc' ? setView(false) : setView(true);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };

    useEffect(() => {
        getUserJoinEvent(eventId);
        getEventById(eventId);
    }, [eventId]);

    useEffect(() => {
        fetchFunClub();
    }, []);
    const handleDialogOpen = () => {
        setOpenSumUpDialog(true);
    };
    const handleEditDialog = (message, isLoading, params) => {
        setEditDialog({
            message,
            isLoading,
            params,
        });
    };

    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
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

    // const onSubmit = () => {
    //     history({ pathname: '/admin/clubfee/event' });
    // };

    const updateUserPayment = async (id) => {
        try {
            await adminClubFeeAPI.updateUserPayment(id);
        } catch (error) {
            console.log('không thể cập nhật trạng thái đóng tiền');
        }
    };

    const toggleStatus = (id, status) => {
        setStatus(status);
        console.log(id);
        handleEditDialog('Bạn có chắc muốn cập nhật trạng thái đóng tiền', true, id);
    };

    const areUSureEdit = (choose, params) => {
        if (choose) {
            updateUserPayment(editDialog.params);
            const newUserList = userList.map((user) => {
                return user.id === editDialog.params
                    ? { ...user, paymentValue: status ? user.amountPerRegisterEstimate : 0 }
                    : user;
            });
            console.log(newUserList);
            setUserList(newUserList);
            const newFun = status
                ? +funClub + +event.amountPerMemberRegister
                : +funClub - event.amountPerMemberRegister;
            setFunClub(newFun);
            dynamicAlert(true, 'Cập nhật thành công');
            setOpenSnackBar(true);
            handleEditDialog('', false, -1);
        } else {
            handleEditDialog('', false, -1);
        }
    };

    function CustomToolbar() {
        return (
            <Fragment>
                <GridToolbarContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <GridToolbarQuickFilter />
                        {/* <GridToolbarFilterButton /> */}
                    </Box>
                    <Typography variant="subtitle1" sx={{ marginLeft: 'auto', marginRight: '1rem' }}>
                        Đã đóng tiền: {payment}/{userList.length}
                    </Typography>
                    <Button
                        startIcon={<Assessment />}
                        size="small"
                        sx={{ marginLeft: 'auto', marginRight: '1rem' }}
                        component={Link}
                        to={`report`}
                    >
                        Lịch sử đóng tiền sự kiện
                    </Button>
                </GridToolbarContainer>
            </Fragment>
        );
    }

    return (
        <Fragment>
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
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        Quản lý chi phí sự kiện
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    {event && (
                        <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                            Tên sự kiện: {event.name} <Typography variant="subtitle2">{event.status}</Typography>
                            <Box sx={{ display: 'flex' }}>
                                <Typography variant="h6" sx={{ color: 'red', marginRight: 5 }}>
                                    Số tiền :{' '}
                                    {event.amountPerMemberRegister.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Typography>
                            </Box>
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        Số dư câu lạc bộ hiện tại:{' '}
                        {funClub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                    {event && event.status === 'Đã kết thúc' && event.totalAmountActual === 0 ? (
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
                </Grid>
            </Grid>

            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                    '& .status-rows': {
                        justifyContent: 'center !important',
                        minHeight: '0px !important',
                        maxHeight: '35px !important',
                        borderRadius: '100px',
                        position: 'relative',
                        top: '9px',
                    },
                    '& .status-rows.active': {
                        backgroundColor: '#56f000',
                        color: '#fff',
                        fontWeight: '600',
                        textAlign: 'center',
                    },
                    '& .status-rows.deactive': {
                        backgroundColor: '#ff3838',
                        color: '#fff',
                        fontWeight: '600',
                    },
                    '& .status-rows.subActive': {
                        backgroundColor: '#cfb2b2',
                        color: '#fff',
                        fontWeight: '600',
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
                    }}
                />
            </Box>
            {/* <Button onClick={onSubmit}>Đồng ý</Button> */}
            {editDialog.isLoading && (
                <DialogCommon onDialog={areUSureEdit} message={editDialog.message} id={editDialog.params} />
            )}
        </Fragment>
    );
}

export default EventFee;
