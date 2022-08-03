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

import adminFunAPi from 'src/api/adminFunAPi';

function ClubFund() {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [isRender, setIsRender] = useState(true);
    const [type, setType] = useState(0); // 0 - rut tien, 1 - nap tien
    const [pageSize, setPageSize] = useState(10);
    const [funClub, setFunClub] = useState('');
    const [clubFundReport, setClubFundReport] = useState([]);

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

    const withdrawFromClubFund = async (amount, note) => {
        try {
            const response = await adminFunAPi.withdrawFromClubFund(amount, note);
            enqueueSnackbar(response.message, { variant: 'success' });
            setIsRender(true);
        } catch (error) {
            console.log('Failed to withdraw from club');
        }
    };

    const depositToClubFund = async (amount, note) => {
        try {
            const response = await adminFunAPi.depositToClubFund(amount, note);
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
            amount: '',
        });
        setOpen(false);
    };

    const handleUpdate = (data) => {
        console.log(type, data, isRender);
        type === 0 ? withdrawFromClubFund(data.amount, data.note) : depositToClubFund(data.amount, data.note);
        //setClubFundReport([]);

        handleClose();
    };

    const validationSchema = Yup.object().shape({
        note: Yup.string().required('Không được để trống trường này'),
        amount: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
    });

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
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
                <Box>
                    <Typography variant="body1" gutterBottom sx={{ marginBottom: 2 }}>
                        <strong>Số dư câu lạc bộ hiện tại: </strong>
                        {funClub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                </Box>
            </GridToolbarContainer>
        );
    }

    return (
        <Box sx={{ m: 1, p: 1 }}>
            <Dialog fullWidth open={open}>
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
                                        defaultValue=""
                                        value={value}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
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
                    <Button onClick={handleClose}>Quay lại</Button>
                    <Button onClick={handleSubmit(handleUpdate)}>Đồng ý</Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                    Quỹ câu lạc bộ
                </Typography>
            </Box>
            <Divider />
            <Container maxWidth="lg">
                <Grid container spacing={12} sx={{ p: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ bgcolor: '#91ff35' }}>
                            <CardActionArea onClick={() => handleOpenDialog(1)}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        <PaidOutlined
                                            fontSize="large"
                                            focusable={false}
                                            sx={{ position: 'absolute', right: 15, color: '#fff' }}
                                        />
                                    </Typography>
                                    <Typography variant="h6">Thêm tiền vào quỹ</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ bgcolor: 'secondary.light' }}>
                            <CardActionArea onClick={() => handleOpenDialog(0)}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        <MoneyOffRounded
                                            fontSize="large"
                                            focusable={false}
                                            sx={{ position: 'absolute', right: 15, color: '#fff' }}
                                        />
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        Rút tiền ra khỏi quỹ
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Paper>
                    </Grid>
                </Grid>

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
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[10, 20, 30]}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}

export default ClubFund;
