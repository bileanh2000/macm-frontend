import { RadioButtonChecked, RadioButtonUnchecked, Assessment } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import { Alert, Box, Button, FormControl, Grid, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminClubFeeAPI from 'src/api/adminClubFeeAPI';
import adminFunAPi from 'src/api/adminFunAPi';
import EditFee from '../EditFee/EditFee';
import { IfAllGranted, IfAuthorized } from 'react-authorization';
import ForbiddenPage from 'src/Pages/ForbiddenPage';

function MembershipFee() {
    const [userList, setUserList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [cost, setCost] = useState(0);
    const [funClub, setFunClub] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [semesterId, setSemesterId] = useState();
    const [semesterName, setSemesterName] = useState();
    const [currentSemester, setCurrentSemester] = useState({});
    const history = useNavigate();
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const [editDialog, setEditDialog] = useState({
        message: '',
        isLoading: false,
        params: -1,
    });

    let payment = userList.reduce((paymentCount, user) => {
        return user.status ? paymentCount + 1 : paymentCount;
    }, 0);

    const fetchFunClub = async () => {
        try {
            const response = await adminFunAPi.getClubFund();
            setFunClub(response.data[0].fundAmount);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const getListMemberShip = async (data) => {
        try {
            const response = await adminClubFeeAPI.getListMembership(data);
            setUserList(response.data);
        } catch (error) {
            console.log('Không thể lấy dữ liệu các thành viên tham gia đóng tiền, error: ', error);
        }
    };

    const getCurrentSemester = async () => {
        try {
            const response = await adminClubFeeAPI.getCurrentSemester();
            setCurrentSemester(response.data[0]);
        } catch (error) {
            console.log('Không thể lấy dữ liệu kì hiện tại, error: ', error);
        }
    };

    const getSemester = async () => {
        try {
            const response = await adminClubFeeAPI.getSemester();
            const array = response.data;
            setSemesterId(Math.max(...array.map((o) => o.id)));
            setSemesterName(array.find((semester) => semester.id == Math.max(...array.map((o) => o.id))).name);
            setSemesterList(response.data);
        } catch (error) {
            console.log('Không thể lấy được dữ liệu các kì, error: ', error);
        }
    };

    const getAmount = async (semesterName) => {
        try {
            const response = await adminClubFeeAPI.getSemesterFee(semesterName);
            console.log(response.data);
            setCost(response.data[0].amount);
        } catch (error) {
            console.log('Không thể lấy được dữ liệu phí thành viên, error: ', error);
        }
    };

    useEffect(() => {
        fetchFunClub();
        getSemester();
        getCurrentSemester();
        if (JSON.stringify(currentSemester) !== '{}') {
            getListMemberShip(currentSemester.id);
        }
    }, []);

    useEffect(() => {
        if (JSON.stringify(currentSemester) !== '{}') {
            getListMemberShip(currentSemester.id);
            getAmount(currentSemester.name);
        }
    }, [currentSemester]);

    const handleChangeSemester = (e) => {
        setSemesterId(e.target.value);
        setSemesterName(semesterList.find((semester) => semester.id == e.target.value).name);
        getListMemberShip(e.target.value);
        getAmount(semesterList.find((semester) => semester.id == e.target.value).name);
    };

    const handleEditDialog = (message, isLoading, params) => {
        setEditDialog({
            message,
            isLoading,
            params,
        });
    };

    const handleEdit = (params) => {
        handleEditDialog('Chỉnh sửa tiền phí', true, params);
    };

    const updateMembershipFee = async (semesterId, totalAmount) => {
        try {
            await adminClubFeeAPI.updateMembershipFee(semesterId, totalAmount);
        } catch (error) {
            console.log('Không thể chỉnh sửa tiền phí, error: ', error);
        }
    };

    const areUSureEdit = (choose, params) => {
        if (choose) {
            console.log('get', params);
            updateMembershipFee(currentSemester.name, params);
            setCost(+params);
            dynamicAlert(true, 'Cập nhật thành công');
            setOpenSnackBar(true);
            handleEditDialog('', false, -1);
        } else {
            handleEditDialog('', false, -1);
        }
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
        //{ field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'studentName', headerName: 'Tên', flex: 0.8 },
        { field: 'studentId', headerName: 'Mã sinh viên', width: 150, flex: 0.6 },
        { field: 'role', headerName: 'Vai trò', width: 150, flex: 0.6 },
        {
            field: 'status',
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
                if (params.row.status == 'Đã đóng') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonChecked />}
                            label="Đã đóng"
                            onClick={() => toggleStatus(params.row.id)}
                            color="primary"
                            aria-details="Đã đóng"
                        />,
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Chưa đóng"
                            onClick={() => toggleStatus(params.row.id)}
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Đã đóng"
                        onClick={() => toggleStatus(params.row.id)}
                    />,
                    <GridActionsCellItem
                        icon={<RadioButtonChecked />}
                        label="Chưa đóng"
                        onClick={() => toggleStatus(params.row.id)}
                        color="primary"
                    />,
                ];
            },
            hide: semesterId > 0 && currentSemester.id > 0 && semesterId != currentSemester.id,
        },
    ];

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['studentName'] = item.studentName;
        container['studentId'] = item.studentId;
        container['role'] = item.role;
        container['status'] = item.status ? 'Đã đóng' : 'Chưa đóng';
        return container;
    });

    const onSubmit = () => {
        history({ pathname: '/admin/clubfee' });
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    };

    const updateMembership = async (id) => {
        await adminClubFeeAPI.updateMembership(id);
    };

    const toggleStatus = (id) => {
        console.log(id);
        updateMembership(id);
        const newUserList = userList.map((user) => {
            return user.id === id ? { ...user, status: !user.status } : user;
        });
        console.log(newUserList);
        setUserList(newUserList);
    };

    function CustomToolbar() {
        return (
            <Fragment>
                <GridToolbarContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <GridToolbarQuickFilter />
                        {/* <GridToolbarFilterButton /> */}
                    </Box>
                    <Button
                        startIcon={<Assessment />}
                        size="small"
                        sx={{ marginLeft: 'auto', marginRight: '1rem' }}
                        component={Link}
                        to={`report`}
                        state={{
                            semester: {
                                id: semesterId,
                                name: semesterName,
                            },
                        }}
                    >
                        Lịch sử đóng tiền phí câu lạc bộ
                    </Button>
                </GridToolbarContainer>
            </Fragment>
        );
    }

    return (
        <IfAllGranted
            expected={['ROLE_HeadClub', 'ROLE_Treasurer']}
            actual={JSON.parse(localStorage.getItem('currentUser')).role.name}
            unauthorized={<ForbiddenPage />}
        >
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
                            Quản lý chi phí câu lạc bộ
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                            {semesterId > 0 && (
                                <FormControl medium="true">
                                    <Select id="demo-simple-select" value={semesterId} onChange={handleChangeSemester}>
                                        {semesterList.map((semester) => (
                                            <MenuItem value={semester.id} key={semester.id}>
                                                {semester.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            <Box sx={{ display: 'flex' }}>
                                <Typography variant="h6" sx={{ color: 'red', marginRight: 5 }}>
                                    Số tiền : {cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </Typography>

                                {semesterId == currentSemester.id && semesterId && currentSemester.id > 0 && (
                                    <Button startIcon={<Edit />} onClick={() => handleEdit(cost)}>
                                        Chỉnh sửa phí
                                    </Button>
                                )}
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                            Số dư câu lạc bộ hiện tại:{' '}
                            {funClub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Typography>
                        <Typography variant="h6" sx={{ float: 'right' }}>
                            Đã đóng: {payment}/{userList.length}
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
                </Box>
                {/* <Button onClick={onSubmit}>Đồng ý</Button> */}
                {editDialog.isLoading && (
                    <EditFee onDialog={areUSureEdit} message={editDialog.message} id={editDialog.params} />
                )}
            </Fragment>
        </IfAllGranted>
    );
}

export default MembershipFee;
