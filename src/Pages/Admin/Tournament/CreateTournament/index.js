import React, { Fragment, useState } from 'react';
import {
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
import { Link } from 'react-router-dom';

import styles from './CreateTournament.module.scss';
import FightingCompetition from './FightingCompetition';
import PerformanceCompetition from './PerformanceCompetition';

const cx = classNames.bind(styles);

const _datas = [
    { gender: 'Nam', weight: ['42-45 kg', '45-48 kg'] },
    { gender: 'Nữ', weight: ['39-42 kg', '42-45 kg'] },
];

const _datas1 = [
    { id: 0, name: 'Long hổ quyền', male: 3, female: 0 },
    { id: 1, name: 'Ngũ môn quyền', male: 1, female: 0 },
    { id: 2, name: 'Tinh hoa lưỡng nghi kiếm pháp', male: 0, female: 1 },
    { id: 3, name: 'Tự vệ nữ', male: 1, female: 1 },
];

function CreateTourament() {
    const [datasFightingCompetition, setDataFightingCompetition] = useState(_datas);
    const [datasPerformanceCompetition, setDataPerformanceCompetition] = useState(_datas1);
    const [open, setOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [description, setDescription] = useState('');
    const [previewTournament, setPreviewTournament] = useState([]);

    console.log(datasFightingCompetition, datasPerformanceCompetition);

    const AddFightingCompetitionHandler = (FightingCompetition) => {
        setDataFightingCompetition(FightingCompetition);
    };
    const PerformanceCompetitionHandler = (PerformanceCompetition) => {
        setDataPerformanceCompetition(PerformanceCompetition);
    };

    const validationSchema = Yup.object().shape({
        tournamentName: Yup.string().required('Không được để trống trường này'),
        numOfParticipants: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        cost: Yup.string().required('Không được để trống trường này'),
        ...(isChecked && {
            cash: Yup.string().required('Không được để trống trường này'),
        }),
        startDate: Yup.string().nullable().required('Không được để trống trường này'),
        finishDate: Yup.string().nullable().required('Không được để trống trường này'),
        amountPerRegister: Yup.number().required('Không được để trống trường này').typeError('Vui lòng nhập số'),
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        console.log('create');
    };

    const onSubmit = (data) => {
        // let dataSubmit = {
        //     maxQuantityComitee: data.maxQuantityComitee,
        //     description: description,
        //     finishTime: moment(new Date(data.finishTime)).format('HH:mm:ss'),
        //     startTime: moment(new Date(data.startTime)).format('HH:mm:ss'),
        //     startDate: moment(new Date(data.startDate)).format('DD/MM/yyyy'),
        //     finishDate: moment(new Date(data.finishDate)).format('DD/MM/yyyy'),
        //     numOfParticipants: data.numOfParticipants,
        //     name: data.name,
        //     cash: data.cash,
        //     cost: data.cost,
        //     amountPerRegister: data.amountPerRegister,
        // };
        // setSubmitData(dataSubmit);
        // eventApi.createPreviewEvent(dataSubmit).then((res) => {
        //     console.log('1', res);
        //     console.log('2', res.data);
        //     if (res.data.length != 0) {
        //         // setOpenSnackBar(true);
        //         // setSnackBarStatus(true);
        //         // snackBarStatus = true;
        //         // dynamicAlert(snackBarStatus, res.message);
        console.log(data);
        setPreviewTournament(data);
        setOpen(true);
        //     } else {
        //         console.log('huhu');
        //         // setOpenSnackBar(true);
        //         // setSnackBarStatus(false);
        //         // snackBarStatus = false;
        //         // dynamicAlert(snackBarStatus, res.message);
        //     }
        // });
        console.log(data, datasFightingCompetition, datasPerformanceCompetition);
    };

    const TournamentSchedule = [
        {
            id: 0,
            date: moment(new Date(previewTournament.startDate)).format('yyyy-MM-DD'),
            title: previewTournament.tournamentName,
            display: 'background',
            backgroundColor: '#5ba8f5',
        },
    ];

    console.log(TournamentSchedule);
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
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Tạo giải đấu
            </Typography>
            <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
                <DialogTitle>Xem trước thông tin giải đấu</DialogTitle>
                <DialogContent sx={{ height: '590px' }}>
                    <FullCalendar
                        locale="vie"
                        height="100%"
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={TournamentSchedule}
                        // events={[
                        //     { title: 'event 1', date: '29-06-2022' },
                        //     { title: 'event 2', date: '2022-06-29' },
                        //]}
                        weekends={true}
                        headerToolbar={{
                            left: 'title',
                            center: '',
                            right: 'prev next today',
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Quay lại</Button>
                    <Button onClick={handleCreate}>Đồng ý</Button>
                </DialogActions>
            </Dialog>
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
                <Box sx={{ width: '70%' }}>
                    <TextField
                        id="outlined-basic"
                        label="Tên giải đấu"
                        variant="outlined"
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
                                variant="outlined"
                                fullWidth
                                {...register('numOfParticipants')}
                                error={errors.numOfParticipants ? true : false}
                                helperText={errors.numOfParticipants?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {/* <Button
                                variant="outlined"
                                sx={{ maxHeight: '50px', minHeight: '50px', width: '100%' }}
                                component={Link}
                                to={'/admin/events/add'}
                                startIcon={<AddCircle />}
                            >
                                Thêm người vào ban tổ chức
                            </Button> */}
                        </Grid>
                    </Grid>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                        <Grid container columns={12} spacing={2}>
                            <Grid item xs={6}>
                                <Controller
                                    required
                                    name="startDate"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <DatePicker
                                            label="Ngày bắt đầu"
                                            disablePast
                                            ampm={false}
                                            value={value}
                                            onChange={(value) => onChange(value)}
                                            renderInput={(params) => (
                                                <TextField
                                                    sx={{
                                                        marginTop: '0px !important',
                                                        marginBottom: '16px !important',
                                                    }}
                                                    {...params}
                                                    required
                                                    id="outlined-disabled"
                                                    error={invalid}
                                                    helperText={invalid ? error.message : null}
                                                    // id="startDate"
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    required
                                    name="finishDate"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <DatePicker
                                            label="Ngày kết thúc"
                                            disablePast
                                            ampm={false}
                                            value={value}
                                            onChange={(value) => onChange(value)}
                                            renderInput={(params) => (
                                                <TextField
                                                    sx={{
                                                        marginTop: '0px !important',
                                                        marginBottom: '16px !important',
                                                    }}
                                                    {...params}
                                                    required
                                                    id="outlined-disabled"
                                                    error={invalid}
                                                    helperText={invalid ? error.message : null}
                                                    // id="startDate"
                                                    variant="outlined"
                                                    margin="dense"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>

                    <Controller
                        name="cost"
                        variant="outlined"
                        defaultValue=""
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                            <NumberFormat
                                name="cost"
                                customInput={TextField}
                                label="Tổng chi phí tổ chức"
                                thousandSeparator={true}
                                variant="outlined"
                                defaultValue=""
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
                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid item xs={6}>
                            <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                Dự kiến mỗi người phải đóng: 160k
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="amountPerRegister"
                                variant="outlined"
                                defaultValue=""
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <NumberFormat
                                        name="amountPerRegister"
                                        customInput={TextField}
                                        label="Số tiền mỗi người cần phải đóng"
                                        thousandSeparator={true}
                                        variant="outlined"
                                        defaultValue=""
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
                        </Grid>
                    </Grid>

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
                            <FightingCompetition
                                onAddFightingCompetition={AddFightingCompetitionHandler}
                                data={datasFightingCompetition}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                Thi đấu biểu diễn
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <PerformanceCompetition
                                onAddPerformanceCompetition={PerformanceCompetitionHandler}
                                data={datasPerformanceCompetition}
                            />
                        </Grid>
                    </Grid>
                    <div className={cx('create-event-button')}>
                        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                            Tạo sự kiện
                        </Button>
                    </div>
                </Box>
            </Box>
        </Fragment>
    );
}

export default CreateTourament;
