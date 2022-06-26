import React, { Fragment, useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    InputAdornment,
    Snackbar,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import { Controller, useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import classNames from 'classnames/bind';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';

import styles from '../CreateTournament/CreateTournament.module.scss';
import UpdatePerformanceCompetition from './UpdatePerformanceCompetition';
import adminTournament from 'src/api/adminTournamentAPI';
import UpdateFightingCompetition from './UpdateFightingCompetition';

const cx = classNames.bind(styles);

function UpdateTournament() {
    const [tournament, setTournament] = useState([]);
    const [datasFightingCompetition, setDataFightingCompetition] = useState([]);
    const [datasPerformanceCompetition, setDataPerformanceCompetition] = useState([]);
    const [open, setOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [description, setDescription] = useState('');
    const [previewTournament, setPreviewTournament] = useState([]);
    const { tournamentId } = useParams();
    const [openSnackBar, setOpenSnackBar] = useState(false);
    let snackBarStatus;

    const getListTournamentsBySemester = async () => {
        try {
            const response = await adminTournament.getTournamentById(tournamentId);
            setTournament(response.data);
            setDataFightingCompetition(response.data[0].competitiveTypes);
            setDataPerformanceCompetition(response.data[0].exhibitionTypes);
            console.log(response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    useEffect(() => {
        getListTournamentsBySemester();
    }, []);

    const AddFightingCompetitionHandler = (FightingCompetition) => {
        setDataFightingCompetition(FightingCompetition);
    };
    const PerformanceCompetitionHandler = (PerformanceCompetition) => {
        setDataPerformanceCompetition(PerformanceCompetition);
    };

    const validationSchema = Yup.object().shape({
        tournamentName: Yup.string().required('Không được để trống trường này'),
        description: Yup.string().required('Không được để trống trường này'),
        maxQuantityComitee: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        cost: Yup.string().required('Không được để trống trường này'),
        ...(isChecked && {
            cash: Yup.string().required('Không được để trống trường này'),
        }),
        amountPerRegister: Yup.number().required('Không được để trống trường này').typeError('Vui lòng nhập số'),
        //amountPerAdmin: Yup.number().required('Không được để trống trường này').typeError('Vui lòng nhập số'),
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        console.log('create');
    };

    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    const onUpdateTournament = (data) => {
        // let dataSubmit = {
        //     description: data.description,
        //     // totalAmount: data.totalAmount,
        //     amount_per_register: data.amountPerRegister,
        //     competitiveTypes: datasFightingCompetition,
        //     description: data.description,
        //     exhibitionTypes: datasPerformanceCompetition,
        //     maxQuantityComitee: data.numOfParticipants,
        //     totalAmount: data.cost,
        //     name: data.tournamentName,
        // };
        console.log('loz');
        console.log(data);

        // adminTournament.updateTournament(dataSubmit, tournamentId).then((res) => {
        //     console.log('1', res);
        //     console.log('2', res.data);
        //     if (res.data.length !== 0) {
        //         setOpenSnackBar(true);
        //         // setSnackBarStatus(true);
        //         snackBarStatus = true;
        //         dynamicAlert(snackBarStatus, res.message);
        //     } else {
        //         console.log('huhu');
        //         setOpenSnackBar(true);
        //         // setSnackBarStatus(false);
        //         snackBarStatus = false;
        //         dynamicAlert(snackBarStatus, res.message);
        //     }
        // });
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    return (
        <Fragment>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
                    Chỉnh sửa thông tin giải đấu
                </Typography>
                <Button
                    variant="contained"
                    size="medium"
                    component={Link}
                    to={`../admin/events/${tournamentId}/eventschedule`}
                >
                    Chỉnh sửa lịch giải đấu
                </Button>
            </Box>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { mb: 2 },
                    display: 'flex',
                    justifyContent: 'center',
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                {tournament.map((item, index) => {
                    return (
                        <Box sx={{ width: '50%' }} key={index}>
                            <TextField
                                id="outlined-basic"
                                label="Tên giải đấu"
                                variant="outlined"
                                defaultValue={item.name}
                                fullWidth
                                {...register('tournamentName')}
                                error={errors.tournamentName ? true : false}
                                helperText={errors.tournamentName?.message}
                            />
                            <Grid container columns={12} spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        type="number"
                                        id="outlined-basic"
                                        label="Số người ban tổ chức"
                                        defaultValue={item.maxQuantityComitee}
                                        variant="outlined"
                                        fullWidth
                                        {...register('maxQuantityComitee')}
                                        error={errors.maxQuantityComitee ? true : false}
                                        helperText={errors.maxQuantityComitee?.message}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    {/* <TextField
                                        type="number"
                                        id="outlined-basic"
                                        label="Số người ban tổ chức"
                                        defaultValue={item.maxQuantityComitee}
                                        variant="outlined"
                                        fullWidth
                                        {...register('maxQuantityComitee')}
                                        error={errors.maxQuantityComitee ? true : false}
                                        helperText={errors.maxQuantityComitee?.message}
                                    /> */}
                                </Grid>
                            </Grid>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                <Grid container columns={12} spacing={2}>
                                    <Grid item xs={6}></Grid>
                                    <Grid item xs={6}></Grid>
                                </Grid>
                            </LocalizationProvider>

                            <Controller
                                name="cost"
                                variant="outlined"
                                defaultValue={item.totalAmount}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <NumberFormat
                                        name="totalAmount"
                                        customInput={TextField}
                                        label="Tổng chi phí tổ chức"
                                        thousandSeparator={true}
                                        variant="outlined"
                                        defaultValue={item.totalAmount}
                                        value={value}
                                        onValueChange={(v) => {
                                            onChange(Number(v.value));
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
                                        }}
                                        error={invalid}
                                        helperText={invalid ? error.message : null}
                                        fullWidth
                                    />
                                )}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <FormControlLabel
                                    sx={{ marginLeft: '1px' }}
                                    control={<Switch checked={isChecked} onChange={() => setIsChecked(!isChecked)} />}
                                    label="Sử dụng tiền quỹ"
                                />
                                <Typography>Tổng tiền quỹ: 2.000.000 vnđ</Typography>
                            </Box>
                            <Collapse in={isChecked}>
                                <Controller
                                    name="cash"
                                    variant="outlined"
                                    defaultValue=""
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <NumberFormat
                                            name="cost"
                                            customInput={TextField}
                                            label="Dùng quỹ CLB"
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
                            </Collapse>
                            <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                Dự kiến mỗi người phải đóng: 160k
                            </Typography>
                            <Controller
                                name="amountPerRegister"
                                variant="outlined"
                                defaultValue={item.amount_per_register}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <NumberFormat
                                        name="amountPerRegister"
                                        customInput={TextField}
                                        label="Số tiền mỗi người cần phải đóng"
                                        thousandSeparator={true}
                                        variant="outlined"
                                        defaultValue={item.amount_per_register}
                                        value={value}
                                        onValueChange={(v) => {
                                            onChange(Number(v.value));
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
                                        }}
                                        error={invalid}
                                        helperText={invalid ? error.message : null}
                                        fullWidth
                                    />
                                )}
                            />
                            <TextField
                                id="outlined-multiline-flexible"
                                name="description"
                                control={control}
                                label="Nội dung"
                                defaultValue={item.description}
                                multiline
                                rows={4}
                                // value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                {...register('description')}
                                error={errors.description ? true : false}
                                helperText={errors.description?.message}
                            />
                            <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                Nội dung thi đấu
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                        Thi đấu đối kháng
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    {datasFightingCompetition && (
                                        <UpdateFightingCompetition
                                            onAddFightingCompetition={AddFightingCompetitionHandler}
                                            data={datasFightingCompetition}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                        Thi đấu biểu diễn
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    {datasPerformanceCompetition && (
                                        <UpdatePerformanceCompetition
                                            onAddPerformanceCompetition={PerformanceCompetitionHandler}
                                            data={datasPerformanceCompetition}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                            <div className={cx('create-event-button')}>
                                <Button variant="contained" onClick={handleSubmit(onUpdateTournament)}>
                                    Cập nhật thông tin
                                </Button>
                            </div>
                        </Box>
                    );
                })}
            </Box>
        </Fragment>
    );
}

export default UpdateTournament;
