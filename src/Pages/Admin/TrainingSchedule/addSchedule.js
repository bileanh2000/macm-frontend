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

function AddSchedule() {
    moment().locale('vi');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState(new Date());
    const [submitData, setSubmitData] = useState();
    const [previewData, setPreviewData] = useState();
    const [currentSemester, setCurrentSemester] = useState([]);
    const today = new Date();
    const tomorrow = today.setDate(today.getDate() + 1);

    let navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
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
        startDate: Yup.date().typeError('Vui lòng không để trống trường này'),
        endDate: Yup.date()
            .min(Yup.ref('startDate'), ({ min }) => `Ngày kết thúc không được bé hơn ngày bắt đầu`)
            .typeError('Vui lòng không để trống trường này'),
        startTime: Yup.date().typeError('Vui lòng không để trống trường này'),
        endTime: Yup.date()
            .min(Yup.ref('startTime'), ({ min }) => `Thời gian kết thúc không được bé hơn thời gian bắt đầu`)
            .typeError('Vui lòng không để trống trường này'),
        dayOfWeek: Yup.array()
            .min(1)
            .of(Yup.string().required('Vui lòng chọn ít nhất một ngày'))
            .required('Vui lòng chọn ít nhất một ngày'),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            dayOfWeek: [],
        },
    });
    const dayOfWeek = [
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
        {
            label: 'Chủ nhật',
            value: 'SUNDAY',
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
        // previewData.splice(id, 1);
        // setPreviewData(previewData);
        // console.log(previewData);
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
            container['title'] = item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
            container['display'] = 'background';
            container['backgroundColor'] = '#5ba8f5';

            return container;
        });

    return (
        <Box>
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

            <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
                <DialogTitle>Xem trước lịch tập</DialogTitle>
                <DialogContent sx={{ height: '590px' }}>
                    <FullCalendar
                        locale="vie"
                        height="100%"
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        // events={[
                        //     {
                        //         id: 1,
                        //         title: 'đi tập đi đmm',
                        //         date: '2022-06-16',
                        //         // display: 'background',
                        //         // textColor: 'white',
                        //         backgroundColor: '#5ba8f5',
                        //         classNames: ['test-css'],
                        //     },
                        // ]}
                        events={scheduleData && scheduleData}
                        weekends={true}
                        headerToolbar={{
                            left: 'title',
                            center: '',
                            right: 'prev next today',
                        }}
                        // editable={true}
                        // selectable={true}
                        // datesSet={(dateInfo) => {
                        //     getMonthInCurrentTableView(dateInfo.start);
                        // }}
                        eventClick={(args) => {
                            deleteDate(args.event.id);
                        }}
                        // dateClick={function (arg) {
                        //     swal({
                        //         title: 'Date',
                        //         text: arg.dateStr,
                        //         type: 'success',
                        //     });
                        // }}
                        // selectable
                        // select={handleEventAdd}
                        // eventDrop={(e) => console.log(e)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy bỏ</Button>
                    <Button onClick={handleCreate}>Đồng ý</Button>
                </DialogActions>
            </Dialog>
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="signup-form">
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <Typography variant="h4" component="div" sx={{ marginBottom: '16px', fontWeight: '700' }}>
                        Tạo lịch tập
                    </Typography>
                    <Grid container spacing={6} columns={12}>
                        <Grid item xs={12} sm={6}>
                            {currentSemester[0] && (
                                <Controller
                                    required
                                    name="startDate"
                                    control={control}
                                    // defaultValue={tomorrow}
                                    defaultValue=""
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <DatePicker
                                            disablePast
                                            label="Ngày bắt đầu"
                                            inputFormat="dd/MM/yyyy"
                                            disableFuture={false}
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
                            )}

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
                                            setStartDate(value);
                                            console.log(value);
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {currentSemester[0] && (
                                <Controller
                                    required
                                    name="endDate"
                                    inputFormat="DD/MM/YYYY"
                                    control={control}
                                    // defaultValue="2022-09-04"
                                    // defaultValue={currentSemester[0].endDate}
                                    defaultValue=""
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <DatePicker
                                            label="Ngày kết thúc"
                                            // minDate={new Date('2022-06-29')}
                                            // minDate={startDate}
                                            disablePast
                                            disableFuture={false}
                                            inputFormat="dd/MM/yyyy"
                                            value={value}
                                            onChange={(value) => {
                                                console.log(value);
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
                                                    type="datetime-local"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    )}
                                />
                            )}

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
                        </Grid>
                    </Grid>
                </LocalizationProvider>
                <Box component="div" sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <FormControl component="div">
                            <FormLabel component="legend">Lặp lại</FormLabel>
                            <FormGroup sx={{ flexDirection: 'row' }}>
                                <Controller
                                    name="dayOfWeek"
                                    control={control}
                                    render={({ field, fieldState: { error, invalid } }) => (
                                        <>
                                            {dayOfWeek.map((item) => (
                                                <FormControlLabel
                                                    required={true}
                                                    key={item.value}
                                                    label={item.label}
                                                    // error={invalid}
                                                    // helperText={invalid ? error.message : null}
                                                    control={
                                                        <Checkbox
                                                            required
                                                            value={item.value}
                                                            checked={field.value.some(
                                                                (existingValue) => existingValue === item.value,
                                                            )}
                                                            onChange={(event, checked) => {
                                                                if (checked) {
                                                                    field.onChange([
                                                                        ...field.value,
                                                                        event.target.value,
                                                                    ]);
                                                                } else {
                                                                    field.onChange(
                                                                        field.value.filter(
                                                                            (value) => value !== event.target.value,
                                                                        ),
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                            ))}
                                        </>
                                    )}
                                />
                            </FormGroup>
                            <FormHelperText>{errors.maxQuantityComitee ? true : false}</FormHelperText>
                            {/* error={errors.maxQuantityComitee ? true : false}
                                helperText={errors.maxQuantityComitee?.message} */}
                        </FormControl>
                    </Paper>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button color="primary" variant="contained" onClick={handleSubmit(onSubmit)} sx={{ mt: 5 }}>
                        Xem trước
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default AddSchedule;
