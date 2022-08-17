import {
    Alert,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker, StaticTimePicker, DesktopDatePicker, TimePicker, DatePicker } from '@mui/x-date-pickers';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';

import { useState } from 'react';
import vi from 'date-fns/locale/vi';
import { useEffect } from 'react';
import { Paper } from '@mui/material';
import trainingScheduleApi from 'src/api/trainingScheduleApi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import semesterApi from 'src/api/semesterApi';
import { useSnackbar } from 'notistack';

function AddSchedule({ title, children, isOpen, handleClose, onSucess, date }) {
    const max = '2200-12-31'; 
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const min = moment(tomorrow).format('yyyy-MM-DD');

    moment().locale('vi');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [submitData, setSubmitData] = useState();
    const [previewData, setPreviewData] = useState();
    const [currentSemester, setCurrentSemester] = useState([]);
    // const today = new Date();
    // const tomorrow = today.setDate(today.getDate() + 1);
    const [selectStartDate, setSelectStartDate] = useState();
    const [selectEndDate, setSelectEndDate] = useState();
    const [previewStatistical, setPreviewStatistical] = useState({
        existedSession: 0,
        totalSession: 0,
        coincideEvent: 0,
        coincideTournament: 0,
    });

    let navigate = useNavigate();

    const handleOpenPreviewDialog = () => {
        setOpen(true);
    };

    const handleClosePreviewDialog = () => {
        setOpen(false);
    };

    const getCurrentSemester = async () => {
        try {
            const response = await semesterApi.getCurrentSemester();
            console.log('thanh cong roi, currentSemester:', response);
            setCurrentSemester(response.data);
        } catch (error) {
            console.log('failed in get current semester', error);
        }
    };
    useEffect(() => {
        getCurrentSemester();
    }, []);
    useEffect(() => {
        currentSemester[0] && console.log(currentSemester[0].endDate);
    }, [currentSemester]);
    const schema = Yup.object().shape({
        startDate: Yup.date()
            .nullable()
            .min(min, 'Vui lòng không nhập ngày trong quá khứ')
            .max(max, 'Vui lòng không nhập ngày với số năm quá lớn')
            .required('Vui lòng không để trống trường này')
            .typeError('Vui lòng nhập đúng định dạng ngày DD/mm/yyyy'),

        endDate: Yup.date()
            .min(min, 'Vui lòng không nhập ngày trong quá khứ')
            .max(max, 'Vui lòng không nhập ngày với số năm quá lớn')
            .typeError('Vui lòng nhập đúng định dạng ngày DD/mm/yyyy')
            .test('abc', 'Thời gian kết thúc không được sớm hơn thời gian bắt đầu', function (value) {
                const { startDate } = this.parent;
                return value.getTime() > startDate.getTime();
            }),
        startTime: Yup.date()
            .nullable()
            .required('Vui lòng không để trống trường này')
            .typeError('Vui lòng nhập đúng định dạng thời gian HH:mm'),
        endTime: Yup.date()
            .min(Yup.ref('startTime'), ({ min }) => `Thời gian kết thúc không được sớm hơn thời gian bắt đầu`)
            .typeError('Vui lòng nhập đúng định dạng thời gian HH:mm')
            .test('cde', 'Thời gian kết thúc không được sớm hơn thời gian bắt đầu', function (value) {
                const { startTime } = this.parent;
                return value.getTime() > startTime.getTime();
            }),
        dayOfWeek: Yup.array()
            .min(1, 'Vui lòng chọn ít nhất một ngày')
            // .of(Yup.string().required('Vui lòng chọn ít nhất một ngày'))
            .required('Vui lòng chọn ít nhất một ngày'),
    });

    const {
        control,
        handleSubmit,
        reset,
        resetField,
        formState: { errors },
        invalid,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            dayOfWeek: [],
        },
    });
    const dayOfWeek = [
        {
            label: 'Chủ nhật',
            value: 'SUNDAY',
        },
        {
            label: 'Thứ hai',
            value: 'MONDAY',
        },
        {
            label: 'Thứ ba',
            value: 'TUESDAY',
        },
        {
            label: 'Thứ tư',
            value: 'WEDNESDAY',
        },
        {
            label: 'Thứ năm',
            value: 'THURSDAY',
        },
        {
            label: 'Thứ sáu',
            value: 'FRIDAY',
        },
        {
            label: 'Thứ bảy',
            value: 'SATURDAY',
        },
    ];
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
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
    const deleteDate = (id) => {
        console.log(id);
        // delete previewData[id];
        previewData.splice(id, 1);
        setPreviewData(previewData);
        console.log(previewData);
    };
    const onSubmit = (data) => {
        // setSubmitData(moment(new Date(data.startDate)).format('yyyy-MM-DD'));
        const dataFormat = {
            startDate: moment(new Date(data.startDate)).format('DD/MM/yyyy'),
            endDate: moment(new Date(data.endDate)).format('DD/MM/yyyy'),
            startTime: moment(new Date(data.startTime)).format('HH:mm:ss'),
            endTime: moment(new Date(data.endTime)).format('HH:mm:ss'),
            daysOfWeek: data.dayOfWeek,
        };
        setSubmitData(dataFormat);

        trainingScheduleApi.previewSchedule(dataFormat).then((res) => {
            console.log('1', res);
            console.log('2', res.data);

            if (res.data.length != 0) {
                // setOpenSnackBar(true);
                // setSnackBarStatus(true);
                // snackBarStatus = true;
                // dynamicAlert(snackBarStatus, res.message);
                setPreviewStatistical({ totalSession: res.data.length });
                setPreviewData(res.data);
                setOpen(true);
            } else {
                console.log('huhu');
                setOpenSnackBar(true);
                // setSnackBarStatus(false);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus, res.message);
            }
        });
    };
    const handleCreate = () => {
        trainingScheduleApi.createSchedule(previewData).then((res) => {
            console.log('1', res);
            console.log('2', res.data);

            if (res.data.length != 0) {
                enqueueSnackbar('Tạo thành công lịch tập', { variant: 'success' });
                navigate(-1);
            } else {
                console.log('huhu');
                setOpenSnackBar(true);
                // setSnackBarStatus(false);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus, res.message);
            }
        });
    };
    const scheduleData =
        previewData &&
        previewData.map((item, index) => {
            const container = {};
            container['id'] = index;
            container['date'] = item.date;
            container['title'] = item.title + ' ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
            container['display'] = 'background';
            container['backgroundColor'] = item.existed === false ? '#9fccf9' : '#ffb3b4';

            return container;
        });
    const resetCheckbox = () => {
        // reset({ dayOfWeek: [] });
        resetField('dayOfWeek');
    };
    const getDaysOfWeekBetweenDates = (sDate = '2022-01-14', eDate = '2022-12-20') => {
        const startDate = moment(sDate);
        const endDate = moment(eDate);

        endDate.add(1, 'day');

        const daysOfWeek = [];

        let i = 0;

        while (i < 7 && startDate < endDate) {
            daysOfWeek.push(startDate.day());
            startDate.add(1, 'day');
            i++;
        }
        // console.log(daysOfWeek);
        return daysOfWeek;
    };

    useEffect(() => {
        resetCheckbox();
        // getDaysOfWeekBetweenDates(selectStartDate, selectEndDate);
    }, [selectStartDate, selectEndDate]);
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    return (
        <Box>
            {/* {JSON.stringify(getDaysOfWeekBetweenDates(selectStartDate, selectEndDate))} */}
            <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClosePreviewDialog}>
                <DialogTitle>Xem trước lịch tập</DialogTitle>
                <DialogContent sx={{ height: '590px' }}>
                    <Typography>
                        <strong>Tổng số buổi tập có thể tạo:</strong> {previewStatistical.totalSession}
                    </Typography>
                    <FullCalendar
                        locale="vie"
                        height="100%"
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={scheduleData && scheduleData}
                        weekends={true}
                        headerToolbar={{
                            left: 'title',
                            center: '',
                            right: 'prev next today',
                        }}
                        eventClick={(args) => {
                            deleteDate(args.event.id);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePreviewDialog}>Hủy</Button>
                    <Button onClick={handleCreate}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullWidth
                maxWidth="md"
                // keepMounted
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {title}
                </DialogTitle>
                <DialogContent>
                    {/* <button onClick={() => resetCheckbox()}>Reset</button> */}
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{
                            '& .MuiTextField-root': { mb: 1 },
                            '& .MuiBox-root': { width: '100%', ml: 1, mr: 2 },
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                }}
                            >
                                <Box>
                                    <Controller
                                        required
                                        name="startDate"
                                        control={control}
                                        defaultValue=""
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <DatePicker
                                                label="Ngày bắt đầu"

                                                // disablePast
                                                minDate={addDays(new Date(), 1)}

                                                ampm={false}
                                                value={value}
                                                onChange={(value) => {
                                                    onChange(value);
                                                    console.log('startDate value', value);
                                                    setSelectStartDate(value);
                                                }}
                                                inputProps={{ readOnly: true }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        required
                                                        id="outlined-disabled"
                                                        error={!!error}
                                                        helperText={error ? error.message : null}
                                                        // id="startDate"
                                                        variant="outlined"
                                                        margin="dense"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box>
                                    <Controller
                                        required
                                        name="endDate"
                                        // inputFormat="DD/MM/YYYY"
                                        control={control}
                                        // defaultValue="2022-09-04"
                                        // defaultValue={currentSemester[0].endDate}
                                        defaultValue=""
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <DatePicker
                                                label="Ngày kết thúc"
                                                // minDate={new Date('2022-06-29')}
                                                // minDate={startDate}
                                                minDate={addDays(new Date(), 1)}
                                                disableFuture={false}
                                                // inputFormat="dd/MM/yyyy"
                                                value={value}
                                                onChange={(value) => {
                                                    onChange(value);
                                                    setSelectEndDate(value);
                                                }}
                                                inputProps={{ readOnly: true }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        required
                                                        id="outlined-disabled"
                                                        error={invalid}
                                                        helperText={invalid ? error.message : null}
                                                        // id="startDate"
                                                        variant="outlined"
                                                        margin="dense"
                                                        type="datetime-local"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                }}
                            >
                                <Box>
                                    <Controller
                                        required
                                        name="startTime"
                                        control={control}
                                        defaultValue={new Date('1/1/2000 18:00:00')}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <TimePicker
                                                label="Thời gian bắt đầu mỗi buổi"
                                                ampm={false}
                                                value={value}
                                                onChange={(value) => {
                                                    onChange(value);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
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
                                </Box>
                                <Box>
                                    <Controller
                                        required
                                        name="endTime"
                                        control={control}
                                        defaultValue={new Date('1/1/2000 19:45:00')}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <TimePicker
                                                label="Thời gian kết thúc mỗi buổi"
                                                ampm={false}
                                                value={value}
                                                onChange={(value) => onChange(value)}
                                                renderInput={(params) => (
                                                    <TextField
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
                                </Box>
                            </Box>
                        </LocalizationProvider>
                        <Box component="div" sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Paper elevation={2} sx={{ padding: 2 }}>
                                <FormControl component="div" error={errors.dayOfWeek ? true : false}>
                                    <FormLabel component="legend">Lặp lại</FormLabel>
                                    <FormGroup sx={{ flexDirection: 'row' }}>
                                        <Controller
                                            name="dayOfWeek"
                                            control={control}
                                            render={({ field, fieldState: { error, invalid } }) => (
                                                <>
                                                    {dayOfWeek.map((item, index) => (
                                                        <FormControlLabel
                                                            required={true}
                                                            key={item.value}
                                                            label={item.label}
                                                            // helperText={invalid ? error.message : null}
                                                            control={
                                                                <Checkbox
                                                                    required
                                                                    disabled={
                                                                        !getDaysOfWeekBetweenDates(
                                                                            selectStartDate,
                                                                            selectEndDate,
                                                                        ).some((i) => i === index)
                                                                    }
                                                                    value={item.value}
                                                                    checked={field.value.some(
                                                                        (existingValue) => existingValue === item.value,
                                                                    )}
                                                                    // error={invalid}
                                                                    // helperText={invalid ? error.message : null}
                                                                    onChange={(event, checked) => {
                                                                        if (checked) {
                                                                            field.onChange([
                                                                                ...field.value,
                                                                                event.target.value,
                                                                            ]);
                                                                        } else {
                                                                            field.onChange(
                                                                                field.value.filter(
                                                                                    (value) =>
                                                                                        value !== event.target.value,
                                                                                ),
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                            // error={invalid}
                                                            // helperText={invalid ? error.message : null}
                                                        />
                                                    ))}
                                                </>
                                            )}
                                        />
                                    </FormGroup>
                                    <FormHelperText>{errors.dayOfWeek?.message}</FormHelperText>
                                    {/* error={errors.maxQuantityComitee ? true : false}
                                helperText={errors.maxQuantityComitee?.message} */}
                                </FormControl>
                            </Paper>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ mr: 1 }}>
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)} autoFocus>
                        Xem trước
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AddSchedule;
