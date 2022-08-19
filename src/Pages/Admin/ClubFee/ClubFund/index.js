import React, { Fragment, useEffect, useState } from 'react';
import {
    Box,
    Button,
    CardActionArea,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    styled,
    TextField,
    Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import moment from 'moment';
import { PaidOutlined, MoneyOffRounded } from '@mui/icons-material';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import { useSnackbar } from 'notistack';
import { IfAllGranted, IfAnyGranted, IfAuthorized } from 'react-authorization';
import ForbiddenPage from 'src/Pages/ForbiddenPage';

import adminFunAPi from 'src/api/adminFunAPi';
import { Navigate } from 'react-router-dom';

function ClubFund() {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [isRender, setIsRender] = useState(true);
    const [type, setType] = useState(0); // 0 - rut tien, 1 - nap tien
    const [pageSize, setPageSize] = useState(10);
    const [funClub, setFunClub] = useState('');
    const [clubFundReport, setClubFundReport] = useState([]);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const fetchFunClub = async () => {
        try {
            const response = await adminFunAPi.getClubFund();
            setFunClub(response.data[0].fundAmount);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const fetchClubFundReport = async () => {
        try {
            const response = await adminFunAPi.getClubFundReport();
            console.log(response);
            setClubFundReport(response.data);
        } catch (error) {
            console.log('Failed to fetch club fund report');
        }
    };

    const withdrawFromClubFund = async (amount, note, studentId) => {
        try {
            const response = await adminFunAPi.withdrawFromClubFund(amount, note, studentId);
            enqueueSnackbar(response.message, { variant: 'success' });
            setIsRender(true);
        } catch (error) {
            console.log('Failed to withdraw from club');
        }
    };

    const depositToClubFund = async (amount, note, studentId) => {
        try {
            const response = await adminFunAPi.depositToClubFund(amount, note, studentId);
            enqueueSnackbar(response.message, { variant: 'success' });
            setIsRender(true);
        } catch (error) {
            console.log('Failed to withdraw from club');
        }
    };

    useEffect(() => {
        fetchFunClub();
        fetchClubFundReport();
    }, []);

    useEffect(() => {
        isRender && fetchClubFundReport() && fetchFunClub();
        console.log('re-render');
        setIsRender(false);
    }, [isRender, clubFundReport]);

    const handleOpenDialog = (type) => {
        setType(type);
        setOpen(true);
    };

    const handleClose = () => {
        reset({
            note: '',
            amount: 1000,
        });
        setOpen(false);
    };

    const handleUpdate = (data) => {
        console.log(type, data, isRender);
        type === 0
            ? withdrawFromClubFund(data.amount, data.note, user.studentId)
            : depositToClubFund(data.amount, data.note, user.studentId);
        //setClubFundReport([]);

        handleClose();
    };

    const validationSchema = Yup.object().shape({
        note: Yup.string().trim().required('Không được để trống trường này'),
        amount: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(1000, 'Vui không nhập giá trị nhỏ hơn 1000 đồng')
            .max(
                type === 1 ? 999999999 : funClub,
                type === 1
                    ? 'Vui lòng không nhập số quá lớn (lớn hơn 1 tỷ đồng)'
                    : 'Vui lòng không nhập số lớn hơn số dư CLB hiện tại',
            ),
    });

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const columns = [
        { field: 'date', type: 'date', headerName: 'Ngày chỉnh sửa', flex: 0.5 },
        { field: 'time', headerName: 'Thời gian chỉnh sửa', flex: 0.8 },
        { field: 'note', headerName: 'Nội dung chỉnh sửa', flex: 1.5 },
        {
            field: 'fundChange',
            headerName: 'Số tiền',
            flex: 0.5,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }
                return clsx('status-rows', {
                    active: params.value.includes('+'),
                    deactive: params.value.includes('-'),
                });
            },
        },
        {
            field: 'updatedBy',
            headerName: 'Chỉnh sửa bởi',
            width: 150,
            flex: 0.5,
        },
        { field: 'fundBalance', headerName: 'Số dư', flex: 0.5 },
    ];
    const rowsUser = clubFundReport.map((item, index) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = moment(new Date(item.createdOn)).format('DD-MM-yyyy');
        container['time'] = moment(new Date(item.createdOn)).format('HH:mm:ss');
        container['note'] = item.note;
        container['fundChange'] =
            item.fundChange > 0
                ? '+' + item.fundChange.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                : item.fundChange.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        container['fundBalance'] = item.fundBalance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        container['updatedBy'] = item.createdBy;
        return container;
    });

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <GridToolbarQuickFilter />
                </Box>
            </GridToolbarContainer>
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
        <IfAnyGranted
            expected={['ROLE_Treasurer', 'ROLE_HeadClub']}
            actual={JSON.parse(localStorage.getItem('currentUser')).role.name}
            unauthorized={<Navigate to="/forbidden" />}
        >
            <Box sx={{ m: 1, p: 1 }}>
                <Dialog fullWidth open={open} onClose={handleClose}>
                    <DialogTitle>
                        {type === 1 ? 'Thêm tiền vào quỹ câu lạc bộ' : 'Rút tiền khỏi quỹ câu lạc bộ'}
                    </DialogTitle>
                    <DialogContent sx={{ paddingTop: '20px !important' }}>
                        <Grid container spacing={1} columns={12}>
                            <Grid item sm={6} xs={12}>
                                <Controller
                                    name="amount"
                                    variant="outlined"
                                    defaultValue=""
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <NumberFormat
                                            name="amount"
                                            customInput={TextField}
                                            label="Số tiền"
                                            thousandSeparator={true}
                                            onValueChange={(v) => {
                                                onChange(Number(v.value));
                                            }}
                                            variant="outlined"
                                            defaultValue={1000}
                                            value={value}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                            }}
                                            error={invalid}
                                            helperText={invalid ? error.message : null}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <TextField
                                    name="note"
                                    // control={control}
                                    label="Nội dung"
                                    multiline
                                    maxRows={4}
                                    {...register('note')}
                                    error={errors.note ? true : false}
                                    helperText={errors.note?.message}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button onClick={handleSubmit(handleUpdate)}>Xác nhận</Button>
                    </DialogActions>
                </Dialog>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                        Quỹ câu lạc bộ
                    </Typography>
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
                            <strong>Số dư câu lạc bộ hiện tại: </strong>
                            {funClub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', p: 2, m: 2, justifyContent: 'space-around' }}>
                        <Paper elevation={2} sx={{ bgcolor: '#91ff35' }}>
                            <CardActionArea onClick={() => handleOpenDialog(1)}>
                                <CardContent>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography variant="h6">Thêm tiền vào quỹ</Typography>
                                        <Typography variant="h6" component="div">
                                            <PaidOutlined fontSize="large" focusable={false} sx={{ color: '#fff' }} />
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Paper>
                        <Paper elevation={2} sx={{ bgcolor: 'secondary.light' }}>
                            <CardActionArea onClick={() => handleOpenDialog(0)}>
                                <CardContent>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography variant="h6" component="div">
                                            Rút tiền ra khỏi quỹ
                                        </Typography>
                                        <Typography variant="h6" component="div">
                                            <MoneyOffRounded
                                                fontSize="large"
                                                focusable={false}
                                                sx={{ color: '#fff' }}
                                            />
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Paper>
                    </Box>

                    <Box
                        sx={{
                            height: '70vh',
                            width: '100%',
                            '& .status-rows': {},
                            '& .status-rows.active': {
                                color: '#56f000',
                                fontWeight: '600',
                                textAlign: 'center',
                            },
                            '& .status-rows.deactive': {
                                color: '#ff3838',
                                fontWeight: '600',
                            },
                        }}
                    >
                        <DataGrid
                            // loading={!userList.length}
                            disableSelectionOnClick={true}
                            rows={rowsUser}
                            getRowHeight={() => 'auto'}
                            getEstimatedRowHeight={() => 200}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowsPerPageOptions={[10, 20, 30]}
                            components={{
                                Toolbar: CustomToolbar,
                                NoRowsOverlay: CustomNoRowsOverlay,
                            }}
                            sx={{
                                '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                                '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                                '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
                            }}
                        />
                        {/* <Box>
                            sx=
                            {{
                                height: '70vh',
                                width: '100%',
                                '& .status-rows': {},
                                '& .status-rows.active': {
                                    color: '#56f000',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                },
                                '& .status-rows.deactive': {
                                    color: '#ff3838',
                                    fontWeight: '600',
                                },
                            }}
                            >
                            <DataGrid
                                // loading={!userList.length}
                                disableSelectionOnClick={true}
                                rows={rowsUser}
                                getRowHeight={() => 'auto'}
                                getEstimatedRowHeight={() => 200}
                                columns={columns}
                                pageSize={pageSize}
                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                rowsPerPageOptions={[10, 20, 30]}
                                components={{
                                    Toolbar: CustomToolbar,
                                }}
                                sx={{
                                    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                                    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
                                }}
                            />
                        </Box> */}
                    </Box>
                </Container>
            </Box>
        </IfAnyGranted>
    );
}

export default ClubFund;
