import React, { Fragment, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';

import adminTournament from 'src/api/adminTournamentAPI';

import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import PreviewSchedule from '../../../PreviewSchedule';
import eventApi from 'src/api/eventApi';

function UpdateTournamentOverview({ title, isOpen, data, handleClose, onSuccessSchedule, onSuccessEvent, schedule }) {
    console.log(data);
    const { enqueueSnackbar } = useSnackbar();
    const [datasFightingCompetition, setDataFightingCompetition] = useState(data.competitiveTypes);
    const [datasPerformanceCompetition, setDataPerformanceCompetition] = useState(data.exhibitionTypes);
    const { id } = useParams();
    const [totalClubFunds, setTotalClubFunds] = useState(20000);
    const [isOpenPreviewDialog, setIsOpenPreviewDialog] = useState(false);
    const [previewEvent, setPreviewEvent] = useState();
    const [eventSchedulePreview, setEventSchedulePreview] = useState([]);
    const [eventSchedule, setEventSchedule] = useState([]);
    const [eventTime, setEventTime] = useState([]);

    const AddFightingCompetitionHandler = (FightingCompetition) => {
        setDataFightingCompetition(FightingCompetition);
    };
    const PerformanceCompetitionHandler = (PerformanceCompetition) => {
        setDataPerformanceCompetition(PerformanceCompetition);
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        // description: Yup.string().required('Không được để trống trường này'),
        startDate: Yup.date()

            .typeError('Vui lòng không để trống trường này')
            .required('Vui lòng không để trống trường này'),

        finishDate: Yup.date()
            .test('same_dates_test', 'Thời gian kết thúc phải muộn hơn thời gian bắt đầu', function (value) {
                const { startDate } = this.parent;
                return value.getTime() !== startDate.getTime();
            })
            .min(Yup.ref('startDate'), ({ min }) => `Thời gian kết thúc phải muộn hơn thời gian bắt đầu`)
            .required('Vui lòng không để trống trường này')
            .typeError('Vui lòng không để trống trường này')
            .required('Vui lòng không để trống trường này'),

        registrationMemberDeadline: Yup.date()
            .max(Yup.ref('startDate'), ({ max }) => `Deadline không được muộn hơn thời gian bắt đầu`)
            .typeError('Vui lòng không để trống trường này')
            .required('Vui lòng không để trống trường này'),
        registrationOrganizingCommitteeDeadline: Yup.date()
            .max(Yup.ref('startDate'), ({ max }) => `Deadline đăng ký BTC phải sớm hơn thời gian bắt đầu`)
            .typeError('Vui lòng không để trống trường này')
            .required('Vui lòng không để trống trường này')
            .test('same_dates_test', 'Deadline đăng ký BTC phải sớm hơn thời gian bắt đầu', function (value) {
                const { startDate } = this.parent;
                return value.getTime() !== startDate.getTime();
            }),
        // amountFromClub: Yup.number()
        //     .required('Không được để trống trường này')
        //     .min(0, 'Vui lòng nhập giá trị lớn hơn 0')
        //     .max(totalClubFunds, 'Tiền quỹ CLB không đủ')
        //     .typeError('Vui lòng nhập giá trị lớn hơn 0'),
        // totalAmountEstimated: Yup.number()
        //     .required('Không được để trống trường này')
        //     .min(1000, 'Vui lòng nhập giá trị lớn hơn 1000')
        //     .typeError('Vui lòng nhập giá trị lớn hơn 0')
        //     .max(100000000, 'Giá trị không hợp lệ'),

        // amountPerRegisterEstimated: Yup.number()
        //     .required('Không được để trống trường này')
        //     .typeError('Vui lòng nhập số')
        //     .min(0, 'Vui lòng nhập giá trị lớn hơn 0')
        //     .typeError('Vui lòng nhập giá trị lớn hơn 0')
        //     .max(100000000, 'Giá trị không hợp lệ'),
    });

    const onPreviewData = async (data) => {
        let eventInforPreview = {
            name: data.name,
            description: data.description,
            registrationOrganizingCommitteeDeadline: moment(data.registrationOrganizingCommitteeDeadline).format(
                'YYYY-MM-DDTHH:mm:ss',
            ),
            registrationMemberDeadline: moment(data.registrationMemberDeadline).format('YYYY-MM-DDTHH:mm:ss'),
            amountPerRegisterEstimated: data.amountPerRegisterEstimated,
            totalAmountEstimated: data.totalAmountEstimated,
        };
        const previewScheduleData = {
            id: id,
            startTime: moment(new Date(data.startDate)).format('HH:mm:ss'),
            finishTime: moment(new Date(data.finishDate)).format('HH:mm:ss'),
            startDate: moment(new Date(data.startDate)).format('DD/MM/yyyy'),
            finishDate: moment(new Date(data.finishDate)).format('DD/MM/yyyy'),
        };
        // setEventSchedulePreview(previewScheduleData);
        setEventTime(data);
        setPreviewEvent(eventInforPreview);

        console.log('eventInforPreview', eventInforPreview);
        console.log('previewScheduleData', previewScheduleData);
        eventApi.udpateEventPreview(previewScheduleData).then((res) => {
            if (res.data.length !== 0) {
                setEventSchedule(res.data);
                console.log(res.data);
                const scheduleData = res.data.map((item) => {
                    const container = {};
                    container['id'] = item.id;
                    container['date'] = item.date;
                    container['title'] = item.title;
                    container['display'] = 'background';
                    container['time'] = item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);

                    container['backgroundColor'] = item.existed ? '#ffb199' : '#ccffe6';
                    return container;
                });
                setEventSchedulePreview(scheduleData);
                setIsOpenPreviewDialog(true);

                // let variant = 'success';
                // enqueueSnackbar(res.message, { variant });
                // onSuccess && onSuccess(res.data[0]);
            } else {
                enqueueSnackbar(res.message, { variant: 'error' });
            }
        });

        // handleClose && handleClose();
    };
    const onUpdateEvent = () => {
        console.log('EVENTSCHEDULE 153', eventSchedule);
        console.log('EVENTSCHEDULE Id 154', id);

        eventApi.updateEventSchedule(eventSchedule, id).then((res) => {
            console.log('updateEventSchedule', res);
            if (res.data.length !== 0) {
                onSuccessSchedule && onSuccessSchedule(res.data[0]);
            }
        });
        eventApi.updateEvent(previewEvent, id).then((res) => {
            console.log(res);
            if (res.data.length !== 0) {
                enqueueSnackbar(res.message, { variant: 'success' });
                onSuccessEvent && onSuccessEvent(true);
                setIsOpenPreviewDialog(false);

                handleClose();
            } else {
                enqueueSnackbar(res.message, { variant: 'error' });
            }
        });
    };
    useEffect(() => {
        console.log(previewEvent);
    }, [previewEvent]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth="md"
                // keepMounted
                open={isOpenPreviewDialog}
                onClose={() => setIsOpenPreviewDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xem trước</DialogTitle>
                <DialogContent>
                    {previewEvent && (
                        <Fragment>
                            <Grid container sx={{ mb: 3 }}>
                                <Grid item xs={6}>
                                    <Box>
                                        <Box>
                                            <Typography component="span" sx={{ fontSize: '16px', fontWeight: '700' }}>
                                                Tên sự kiện:{' '}
                                            </Typography>
                                            <span>{previewEvent.name}</span>
                                        </Box>
                                        <Box>
                                            <Typography component="span" sx={{ fontSize: '16px', fontWeight: '700' }}>
                                                Nội dung:{' '}
                                            </Typography>
                                            <span>{previewEvent.description}</span>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box>
                                        <Box>
                                            <Typography component="span" sx={{ fontSize: '16px', fontWeight: '700' }}>
                                                Thời gian bắt đầu:{' '}
                                            </Typography>
                                            <span>
                                                {moment(new Date(eventTime.startDate)).format('HH:ss - DD/MM/yyyy')}
                                            </span>
                                        </Box>
                                        <Box>
                                            <Typography component="span" sx={{ fontSize: '16px', fontWeight: '700' }}>
                                                Thời gian kết thúc:{' '}
                                            </Typography>
                                            <span>
                                                {moment(new Date(eventTime.finishDate)).format('HH:ss - DD/MM/yyyy')}
                                            </span>
                                        </Box>
                                        <Box>
                                            <Typography component="span" sx={{ fontSize: '16px', fontWeight: '700' }}>
                                                Deadline đăng ký tham gia:{' '}
                                            </Typography>

                                            <span>
                                                {moment(new Date(previewEvent.registrationMemberDeadline)).format(
                                                    'HH:ss - DD/MM/yyyy',
                                                )}
                                            </span>
                                        </Box>
                                        <Box>
                                            <>
                                                <Typography
                                                    component="span"
                                                    sx={{ fontSize: '16px', fontWeight: '700' }}
                                                >
                                                    Deadline đăng ký ban tổ chức:{' '}
                                                </Typography>
                                                <span>
                                                    {moment(
                                                        new Date(previewEvent.registrationOrganizingCommitteeDeadline),
                                                    ).format('HH:ss - DD/MM/yyyy')}
                                                </span>
                                            </>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box sx={{ height: '50vh', ml: 0 }}>
                                <PreviewSchedule
                                    dataPreview={eventSchedulePreview}
                                    initialDate={eventSchedulePreview[0] && new Date(eventSchedulePreview[0].date)}
                                />
                            </Box>
                        </Fragment>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpenPreviewDialog(false)}>Quay lại</Button>
                    <Button variant="contained" onClick={handleSubmit(onUpdateEvent)}>
                        Cập nhật thông tin
                    </Button>
                </DialogActions>
            </Dialog>
            {data && (
                <Dialog
                    fullWidth
                    maxWidth="md"
                    // keepMounted
                    open={!!isOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText id="alert-dialog-description">{facilityId}</DialogContentText> */}
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
                            <Grid container columns={12} sx={{ mt: 2 }} spacing={3}>
                                <Grid item xs={7}>
                                    <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                        Thông tin sự kiện
                                    </Typography>
                                    <TextField
                                        id="outlined-basic"
                                        label="Tên sự kiện"
                                        variant="outlined"
                                        defaultValue={data.name}
                                        fullWidth
                                        {...register('name')}
                                        error={errors.name ? true : false}
                                        helperText={errors.name?.message}
                                    />
                                    <TextField
                                        id="outlined-multiline-flexible"
                                        name="description"
                                        control={control}
                                        label="Nội dung"
                                        defaultValue={data.description}
                                        multiline
                                        rows={4}
                                        // value={description}
                                        fullWidth
                                        {...register('description')}
                                        error={errors.description ? true : false}
                                        helperText={errors.description?.message}
                                    />
                                </Grid>

                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                    <Grid item xs={5}>
                                        <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                            Thời gian
                                        </Typography>
                                        <Controller
                                            required
                                            name="startDate"
                                            control={control}
                                            defaultValue={schedule[0].date + 'T' + schedule[0].startTime}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DateTimePicker
                                                    label="Thời gian bắt đầu"
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
                                        <Controller
                                            required
                                            name="finishDate"
                                            control={control}
                                            defaultValue={
                                                schedule[schedule.length - 1].date +
                                                'T' +
                                                schedule[schedule.length - 1].finishTime
                                            }
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DateTimePicker
                                                    label="Thời gian kết thúc"
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
                                        <Controller
                                            required
                                            name="registrationMemberDeadline"
                                            control={control}
                                            defaultValue={data.registrationMemberDeadline}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DateTimePicker
                                                    label="Deadline đăng ký tham gia"
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
                                        <Controller
                                            required
                                            name="registrationOrganizingCommitteeDeadline"
                                            control={control}
                                            defaultValue={data.registrationOrganizingCommitteeDeadline}
                                            // defaultValue="2000-11-12T12:00"
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DateTimePicker
                                                    label="Deadline đăng ký ban tổ chức"
                                                    // minDate={startTime}
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
                                </LocalizationProvider>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button variant="contained" onClick={handleSubmit(onPreviewData)}>
                            Xem trước
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Fragment>
    );
}

export default UpdateTournamentOverview;
