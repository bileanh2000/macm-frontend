import { RadioButtonChecked, RadioButtonUnchecked, Assessment, ResetTvRounded } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    Snackbar,
    styled,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import { useSnackbar } from 'notistack';

import adminClubFeeAPI from 'src/api/adminClubFeeAPI';
import adminFunAPi from 'src/api/adminFunAPi';

function MembershipFee() {
    const { enqueueSnackbar } = useSnackbar();
    const [userList, setUserList] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [cost, setCost] = useState();
    const [funClub, setFunClub] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [semesterId, setSemesterId] = useState();
    const [semesterName, setSemesterName] = useState();
    const [currentSemester, setCurrentSemester] = useState({});
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [idMember, setIdMember] = useState();
    const [isRender, setIsRender] = useState(true);
    const user = JSON.parse(localStorage.getItem('currentUser'));

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
            console.log('dong tien', response);
            setUserList(response.data);
        } catch (error) {
            console.log('Không thể lấy dữ liệu các thành viên tham gia đóng tiền, error: ', error);
        }
    };

    const getCurrentSemester = async () => {
        try {
            const response = await adminClubFeeAPI.getCurrentSemester();
            getListMemberShip(response.data[0].id);
            getAmount(response.data[0].name);
            setCurrentSemester(response.data[0]);
            setSemesterId(response.data[0].id);
            setSemesterName(response.data[0].name);
        } catch (error) {
            console.log('Không thể lấy dữ liệu kì hiện tại, error: ', error);
        }
    };

    const getSemester = async () => {
        try {
            const response = await adminClubFeeAPI.getSemester();
            // console.log('semester', response.data);
            setSemesterList(response.data);
        } catch (error) {
            console.log('Không thể lấy được dữ liệu các kì, error: ', error);
        }
    };

    const getAmount = async (semesterName) => {
        try {
            const response = await adminClubFeeAPI.getSemesterFee(semesterName);
            response.data.length > 0 ? setCost(response.data[0].amount) : setCost();
        } catch (error) {
            console.log('Không thể lấy được dữ liệu phí thành viên, error: ', error);
        }
    };

    useEffect(() => {
        fetchFunClub();
        getSemester();
        getCurrentSemester();
    }, []);

    // useEffect(() => {
    //     getListMemberShip(currentSemester.id);
    //     getAmount(currentSemester.name);
    // }, [currentSemester, cost]);

    const validationSchema = Yup.object().shape({
        cost: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(1, 'Vui lòng nhập giá trị lớn hơn 0')
            .max(100000000, 'Vui lòng không nhập số quá lớn (dưới 1 trăm triệu)'),
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        // formState,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const handleChangeSemester = (e) => {
        setSemesterId(e.target.value);
        setSemesterName(semesterList.find((semester) => semester.id == e.target.value).name);
        getListMemberShip(e.target.value);
        getAmount(semesterList.find((semester) => semester.id == e.target.value).name);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset({ cost: cost });
    };

    const updateMembershipFee = async (semesterId, totalAmount) => {
        try {
            const res = await adminClubFeeAPI.updateMembershipFee(semesterId, totalAmount);
            console.log(res.message);
            enqueueSnackbar(res.message, { variant: 'success' });
        } catch (error) {
            console.log('Không thể chỉnh sửa tiền phí, error: ', error);
        }
    };

    const onSubmit = (data) => {
        updateMembershipFee(currentSemester.name, data.cost);
        setCost(+data.cost);
        handleClose();
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
            field: 'pay',
            type: 'actions',
            headerName: 'Đã đóng',
            width: 50,
            flex: 0.3,
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
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Đã đóng"
                        onClick={() => toggleStatus(params.row.id)}
                    />,
                ];
            },
            hide: semesterId > 0 && currentSemester.id > 0 && semesterId != currentSemester.id,
        },
        {
            field: 'notpay',
            type: 'actions',
            headerName: 'Chưa đóng',
            width: 50,
            flex: 0.3,
            cellClassName: 'actions',
            getActions: (params) => {
                if (params.row.status == 'Đã đóng') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Chưa đóng"
                            onClick={() => toggleStatus(params.row.id)}
                        />,
                    ];
                }
                return [
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

    const updateMembership = async (id) => {
        try {
            const res = await adminClubFeeAPI.updateMembership(id, user.studentId);
            console.log(res.message);
            enqueueSnackbar(res.message, { variant: 'success' });
        } catch (error) {
            console.log('Không thể chỉnh sửa tiền phí, error: ', error);
        }
    };

    const toggleStatus = (id) => {
        setIdMember(id);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setIdMember(-1);
        setOpenConfirm(false);
    };

    const handleOpenConfirm = () => {
        updateMembership(idMember);
        const newUserList = userList.map((user) => {
            return user.id === idMember ? { ...user, status: !user.status } : user;
        });
        setUserList(newUserList);
        handleCloseConfirm();
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
        <Box sx={{ m: 1, p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                    Danh sách đóng tiền phí duy trì CLB
                </Typography>
                <Box>
                    <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
                        <strong>Số dư câu lạc bộ hiện tại: </strong>
                        {funClub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        {cost && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                                <Typography variant="h6" sx={{ color: 'red' }}>
                                    Số tiền mỗi người phải đóng:{' '}
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'red' }}>
                                    {cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    {semesterId == currentSemester.id && semesterId && currentSemester.id > 0 && (
                                        <Button startIcon={<Edit />} onClick={handleOpen}></Button>
                                    )}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    {/* <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        Số dư câu lạc bộ hiện tại:{' '}
                        {funClub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography> */}
                    <Typography variant="body1" sx={{ float: 'right' }}>
                        Đã đóng: {payment}/{userList.length}
                    </Typography>
                </Grid>
            </Grid>

            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    Chỉnh sửa tiền phí
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{
                            '& .MuiTextField-root': { mb: 2, mt: 2 },
                        }}
                    >
                        <Controller
                            name="cost"
                            variant="outlined"
                            defaultValue={cost}
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                <NumberFormat
                                    name="cost"
                                    customInput={TextField}
                                    label="Nhập số tiền"
                                    thousandSeparator={true}
                                    variant="outlined"
                                    value={value}
                                    onValueChange={(v) => {
                                        onChange(Number(v.value));
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                    }}
                                    error={invalid}
                                    helperText={invalid ? error.message : null}
                                    fullWidth
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSubmit(onSubmit)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

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

            <Box
                sx={{
                    height: '70vh',
                    width: '100%',
                    '& .status-rows': {
                        justifyContent: 'center !important',
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

export default MembershipFee;
