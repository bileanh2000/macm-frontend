import React, { Fragment, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    InputAdornment,
    Radio,
    RadioGroup,
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
import EditableSchedule from 'src/Pages/Admin/Tournament/CreateTournament/Schedule/EditableSchedule';

function UpdateTournamentOverview({ title, isOpen, data, handleClose, onSuccessSchedule, onSuccessEvent, schedule }) {
    const max = '2200-12-31';
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const min = moment(tomorrow).format('yyyy-MM-DD');

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

    const [existedDate, setExistedDate] = useState([]);
    const [submitOption, setSubmitOption] = useState(-1);
    // const [isOpenPreviewDialog, setIsOpenPreviewDialog] = useState(false);
    const [isEditableSchedule, setIsEditableSchedule] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [preview, setPreview] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [isOverride, setIsOverride] = useState(-1);

    const AddFightingCompetitionHandler = (FightingCompetition) => {
        setDataFightingCompetition(FightingCompetition);
    };
    const PerformanceCompetitionHandler = (PerformanceCompetition) => {
        setDataPerformanceCompetition(PerformanceCompetition);
    };

    const handleChange = (event) => {
        setSubmitOption(event.target.value);
    };
    const checkOverride = (TournamentSchedule) => {
        const arrayCheck = TournamentSchedule.map((item) => {
            if (item.title.toString() === 'Trùng với Lịch tập') {
                return 2;
            } else if (item.title.toString().includes('Trùng với')) {
                return 1;
            } else {
                return -1;
            }
        });
        console.log('arrayCheck', arrayCheck);
        if (arrayCheck.find((item) => item === 1)) {
            console.log('check', 1);
            setDisabled(true);
            setIsOverride(1);
        } else {
            if (arrayCheck.find((item) => item === 2)) {
                console.log('check', 2);
                setDisabled(true);
                setIsOverride(2);
                // isStepFailed(4);
            } else {
                console.log('check', -1);
                setDisabled(false);
                setIsOverride(-1);
            }
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required('Không được để trống trường này'),
        // description: Yup.string().required('Không được để trống trường này'),
        startDate: Yup.date()
            .min(min, 'Vui lòng không nhập ngày trong quá khứ')
            .max(max, 'Vui lòng không nhập ngày với số năm quá lớn')
            .required('Vui lòng không để trống trường này')
            .typeError('Vui lòng nhập đúng định dạng ngày DD/mm/yyyy'),
        finishDate: Yup.date()
            .test('same_dates_test', 'Thời gian kết thúc phải muộn hơn thời gian bắt đầu', function (value) {
                const { startDate } = this.parent;
                return value.getTime() !== startDate.getTime();
            })
            .min(Yup.ref('startDate'), ({ min }) => `Thời gian kết thúc phải muộn hơn thời gian bắt đầu`)
            .max(max, 'Vui lòng không nhập ngày với số năm quá lớn')
            .typeError('Vui lòng nhập đúng định dạng ngày DD/mm/yyyy')
            .required('Vui lòng không để trống trường này'),

        registrationMemberDeadline: Yup.date()
            .max(Yup.ref('startDate'), ({ max }) => `Deadline không được muộn hơn thời gian bắt đầu`)
            // .min(min, 'Vui lòng không nhập ngày trong quá khứ')
            .typeError('Vui lòng nhập đúng định dạng ngày DD/mm/yyyy')
            .required('Vui lòng không để trống trường này'),
        ...(data.registrationOrganizingCommitteeDeadline === null
            ? null
            : {
                  registrationOrganizingCommitteeDeadline: Yup.date()
                      .max(Yup.ref('startDate'), ({ max }) => `Deadline đăng ký BTC phải sớm hơn thời gian bắt đầu`)
                      //   .min(min, 'Vui lòng không nhập ngày trong quá khứ')
                      .typeError('Vui lòng nhập đúng định dạng ngày DD/mm/yyyy')
                      .required('Vui lòng không để trống trường này')
                      .test('same_dates_test', 'Deadline đăng ký BTC phải sớm hơn thời gian bắt đầu', function (value) {
                          const { startDate } = this.parent;
                          return value.getTime() !== startDate.getTime();
                      })
                      .test(
                          'deadline_test',
                          'Deadline đăng ký BTC phải muộn hơn deadline đăng ký tham gia',
                          function (value) {
                              const { registrationMemberDeadline } = this.parent;
                              return value.getTime() <= registrationMemberDeadline.getTime();
                          },
                      ),
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

    const onPreviewData = (data) => {
        let eventInforPreview = {
            name: data.name,
            description: data.description,
            ...(data.registrationOrganizingCommitteeDeadline === null
                ? null
                : {
                      registrationOrganizingCommitteeDeadline: moment(
                          data.registrationOrganizingCommitteeDeadline,
                      ).format('YYYY-MM-DDTHH:mm:ss'),
                  }),
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
        setPreview(previewScheduleData);
        console.log('eventInforPreview', eventInforPreview);
        console.log('previewScheduleData', previewScheduleData);

        // eventApi.udpateEventPreview(previewScheduleData).then((res) => {
        //     if (res.data.length !== 0) {
        //         checkOverride(res.data);
        //         setEventSchedule(res.data);
        //         let existedDate = res.data.filter((i) => i.existed);
        //         setExistedDate(existedDate);
        //         console.log(res.data);
        //         const scheduleData = res.data.map((item) => {
        //             const container = {};
        //             container['id'] = item.id;
        //             container['date'] = item.date;
        //             container['title'] = item.title;
        //             container['display'] = 'background';
        //             container['time'] = item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);

        //             container['backgroundColor'] = item.existed ? '#ffb199' : '#ccffe6';
        //             return container;
        //         });
        //         setEventSchedulePreview(scheduleData);
        //         setIsOpenPreviewDialog(true);

        //         // let variant = 'success';
        //         // enqueueSnackbar(res.message, { variant });
        //         // onSuccess && onSuccess(res.data[0]);
        //     } else {
        //         enqueueSnackbar(res.message, { variant: 'error' });
        //     }
        // });

        // handleClose && handleClose();
    };
    useEffect(() => {
        eventApi.udpateEventPreview(preview).then((res) => {
            if (res.data.length !== 0) {
                checkOverride(res.data);
                setEventSchedule(res.data);
                let existedDate = res.data.filter((i) => i.existed);
                setExistedDate(existedDate);
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
                if (!isOpenPreviewDialog) {
                    setIsOpenPreviewDialog(true);
                }
                // let variant = 'success';
                // enqueueSnackbar(res.message, { variant });
                // onSuccess && onSuccess(res.data[0]);
            } else {
                enqueueSnackbar(res.message, { variant: 'error' });
            }
        });
        setIsUpdate(false);
    }, [preview, isUpdate]);
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
        mode: 'onChange',
    });
    return (
        <Fragment>
            {isEditableSchedule && (
                <EditableSchedule
                    isOpen={isEditableSchedule}
                    handleClose={() => {
                        setIsEditableSchedule(false);
                        // handleSubmit(handlePreviewSchedule);
                        // handlePreviewSchedule();
                        // handleSubmit(handlePreviewSchedule);

                        setIsUpdate(true);
                    }}
                    initialDate={eventSchedule[0] && new Date(eventSchedule[0].date)}
                    description={existedDate}
                />
            )}
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
                                        {data.registrationOrganizingCommitteeDeadline === null ? null : (
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
                                                            new Date(
                                                                previewEvent.registrationOrganizingCommitteeDeadline,
                                                            ),
                                                        ).format('HH:ss - DD/MM/yyyy')}
                                                    </span>
                                                </>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                            {isOverride === 3 || isOverride === 2 ? (
                                <>
                                    <Typography color="error">
                                        <strong>
                                            Ngày {existedDate.map((i) => moment(i.date).format('DD/MM/yyyy') + ', ')}
                                            đang trùng với lịch tập, vui lòng lựa chọn:
                                        </strong>
                                    </Typography>
                                    <FormControl>
                                        {/* <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel> */}
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={submitOption}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel value={0} control={<Radio />} label="Bỏ lịch tập" />
                                            <FormControlLabel
                                                value={1}
                                                control={<Radio onClick={() => setIsEditableSchedule(true)} />}
                                                label="Thay đổi lịch tập"
                                            />
                                            <FormControlLabel
                                                value={2}
                                                control={<Radio onClick={() => setIsOpenPreviewDialog(false)} />}
                                                label="Chỉnh sửa thời gian sự kiện"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </>
                            ) : isOverride === 1 ? (
                                <Box sx={{ mb: 2 }}>
                                    <Typography color="error">
                                        <strong>
                                            Không thể tạo Sự kiện (lịch bị trùng với Sự kiện hoặc giải đấu khác) vui
                                            lòng chọn lại ngày !
                                        </strong>
                                    </Typography>
                                    <Button onClick={() => setIsOpenPreviewDialog(false)}>Chọn lại ngày</Button>
                                </Box>
                            ) : (
                                ''
                            )}
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
                    <Button
                        variant="contained"
                        onClick={handleSubmit(onUpdateEvent)}
                        disabled={submitOption != 0 && existedDate.length !== 0}
                    >
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
