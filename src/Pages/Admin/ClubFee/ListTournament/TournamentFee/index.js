import React, { Fragment, useEffect, useState } from 'react';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import { Alert, Box, Button, FormControl, Grid, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import DialogCommon from 'src/Components/Dialog/Dialog';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import adminClubFeeAPI from 'src/api/adminClubFeeAPI';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import adminFunAPi from 'src/api/adminFunAPi';

function TournamentFee() {
    let { tournamentId } = useParams();
    const [funClub, setFunClub] = useState('');
    const [type, setType] = useState(1);
    const [userPaymentStatus, setUserPaymentStatus] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [tournament, setTournament] = useState([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const [editDialog, setEditDialog] = useState({
        message: '',
        isLoading: false,
        params: -1,
    });
    // const location = useLocation();
    // const history = useNavigate();
    // const _event = location.state?.event;
    // const view = location.state?.view;
    // const [event, setEvent] = useState(_event);
    // console.log(event, view);

    let payment = userPaymentStatus.reduce((pay, user) => {
        return user.paymentStatus ? pay + 1 : pay;
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

    const handleChangeType = (event) => {
        setType(event.target.value);
        fetchUserPaymentStatus(tournamentId, event.target.value);
    };

    const getTournamentById = async (tournamentId) => {
        try {
            const response = await adminTournamentAPI.getTournamentById(tournamentId);
            console.log(response.data[0]);
            setTournament(response.data[0]);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };

    const fetchUserPaymentStatus = async (tournamentId, type) => {
        try {
            if (type === 1) {
                const response = await adminTournamentAPI.getAllTournamentOrganizingCommitteePaymentStatus(
                    tournamentId,
                );
                console.log(response.data);
                setUserPaymentStatus(response.data);
            } else {
                const response = await adminTournamentAPI.getAllTournamentPlayerPaymentStatus(tournamentId);
                console.log(response.data);
                setUserPaymentStatus(response.data);
            }
        } catch (error) {
            console.log('Không thể lấy danh sách đóng tiền của ban tổ chức');
        }
    };

    console.log(type);

    useEffect(() => {
        fetchUserPaymentStatus(tournamentId, type);
        getTournamentById(tournamentId);
        fetchFunClub();
    }, [tournamentId]);

    const handleEditDialog = (message, isLoading, params) => {
        setEditDialog({
            message,
            isLoading,
            params,
        });
    };

    let snackBarStatus;

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
        { field: 'id', headerName: 'ID', flex: 0.5, hide: true },
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
                            onClick={() => toggleStatus(params.row.id, type)}
                            color="primary"
                            aria-details="Đã đóng"
                        />,
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Chưa đóng"
                            onClick={() => toggleStatus(params.row.id, type)}
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Đã đóng"
                        onClick={() => toggleStatus(params.row.id, type)}
                    />,
                    <GridActionsCellItem
                        icon={<RadioButtonChecked />}
                        label="Chưa đóng"
                        onClick={() => toggleStatus(params.row.id, type)}
                        color="primary"
                    />,
                ];
            },
            // hide: tournament.status !== 'Chưa diễn ra',
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
                await adminTournamentAPI.updateTournamentOrganizingCommitteePaymentStatus(id);
            } else {
                await adminTournamentAPI.updateTournamentPlayerPaymentStatus(id);
            }
        } catch (error) {
            console.log('không thể cập nhật trạng thái đóng tiền');
        }
    };

    const toggleStatus = (id, type) => {
        console.log(id, type);
        handleEditDialog('Bạn có chắc muốn cập nhật trạng thái đóng tiền', true, id);
    };

    const areUSureEdit = (choose, params) => {
        if (choose) {
            updateUserPayment(editDialog.params);
            const newUserList = userPaymentStatus.map((user) => {
                return user.id === editDialog.params ? { ...user, paymentStatus: !user.paymentStatus } : user;
            });
            console.log(newUserList);
            setUserPaymentStatus(newUserList);
            dynamicAlert(true, 'Cập nhật thành công');
            setOpenSnackBar(true);
            handleEditDialog('', false, -1);
        } else {
            handleEditDialog('', false, -1);
        }
    };

    function CustomToolbar() {
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

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        Quản lý chi phí giải đấu
                    </Typography>
                    <FormControl size="small">
                        <Typography variant="caption">Danh sách đóng tiền</Typography>
                        <Select id="demo-simple-select" value={type} displayEmpty onChange={handleChangeType}>
                            <MenuItem value={1}>Ban tổ chức</MenuItem>
                            <MenuItem value={2}>Người chơi</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    {tournament && (
                        <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                            Tên sự kiện: {tournament.name}{' '}
                            <Typography variant="subtitle2">{tournament.status}</Typography>
                            <Box sx={{ display: 'flex' }}>
                                <Typography variant="h6" sx={{ color: 'red', marginRight: 5 }}>
                                    Số tiền mỗi người phải đóng:{' '}
                                    {tournament.amount_per_register?.toLocaleString('vi-VN', {
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
                    <Button variant="contained" color="success">
                        <Link to={`./report/${type}`} state={{ event: tournament }} style={{ color: 'white' }}>
                            Lịch sử chỉnh sửa
                        </Link>
                    </Button>
                    <Typography variant="h6" sx={{ float: 'right' }}>
                        Đã đóng: {payment}/{userPaymentStatus.length}
                    </Typography>
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
                        //minWidth: '104.143px !important',
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
                }}
            >
                <DataGrid
                    loading={!userPaymentStatus.length}
                    disableSelectionOnClick={true}
                    rows={rowsUser}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 30]}
                    // onCellDoubleClick={(param) => {
                    //     handleOnClick(param.row);
                    // }}
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

export default TournamentFee;
