import { Box, ButtonGroup, Button, Typography, TextField, Grid, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider, StaticDatePicker, TimePicker } from '@mui/x-date-pickers';
import { Fragment, useEffect, useState } from 'react';
import vi from 'date-fns/locale/vi';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import eventApi from 'src/api/eventApi';
import moment from 'moment';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function EditEventSchedule() {
    const currentDate = new Date();
    const max = '2200-12-31';
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const min = moment(tomorrow).format('yyyy-MM-DD');

    const [open, setOpen] = useState(false);
    const { id } = useParams();
    const [schedule, setSchedule] = useState([]);
    const [previewData, setPreviewData] = useState([]);

    const [value, setValue] = useState(schedule);
    const [selectedDate, setSelectedDate] = useState();
    const [dateValue, setDateValue] = useState();

    const schema = Yup.object().shape({
        startDate: Yup.date()
            .min(min, 'Vui lòng không nhập ngày trong quá khứ')
            .max(max, 'Vui lòng không nhập ngày với số năm quá lớn')
            .typeError('Vui lòng nhập đúng định dạng ngày DD/mm/yyyy')
            .required('Vui lòng không để trống trường này'),
        finishDate: Yup.date()
            .min(Yup.ref('startDate'), ({ min }) => `Ngày kết thúc không được bé hơn ngày bắt đầu`)
            .max(max, 'Vui lòng không nhập ngày với số năm quá lớn')
            .typeError('Vui lòng nhập đúng định dạng ngày DD/mm/yyyy')
            .required('Vui lòng không để trống trường này'),
        startTime: Yup.date()
            .typeError('Vui lòng nhập đúng định dạng giờ HH:mm')
            .required('Vui lòng không để trống trường này'),
        finishTime: Yup.date()
            .typeError('Vui lòng nhập đúng định dạng giờ HH:mm')
            .required('Vui lòng không để trống trường này'),
    });

    const fetchEventScheduleByEventId = async (params) => {
        try {
            const response = await eventApi.getPeriodTime(params);

            console.log('fetchEventScheduleByEventId', response.data);
            console.log('event id ', id);

            setSchedule(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchEventScheduleByEventId(id);
    }, [id]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // const handleConfirmDialog = async () => {
    //     setOpen(false);
    //     await trainingSchedule.deleteSession(id).then((res) => {
    //         console.log('1', res);
    //         console.log('2', res.data);
    //         console.log('3', res.message);
    //     });
    //     setTimeout(navigate(-1), 50000);
    // };
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {},
    });
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
    let navigate = useNavigate();
    const onSubmit = async (data) => {
        data = {
            id: parseInt(id, 10),
            startDate: moment(data.startDate).format('DD/MM/yyyy'),
            finishDate: moment(data.finishDate).format('DD/MM/yyyy'),
            startTime: moment(data.startTime).format('HH:mm:ss'),
            finishTime: moment(data.finishTime).format('HH:mm:ss'),
        };
        console.log('form submit', data);
        await eventApi.previewUpdateEventSessionTime(id, data).then((res) => {
            console.log('preview', res);
            console.log('preview Data', res.data);
            setPreviewData(res.data);
            if (res.data.length != 0) {
                setOpen(true);
                // setOpenSnackBar(true);
                // setSnackBarStatus(true);
                // snackBarStatus = true;
                // dynamicAlert(snackBarStatus, res.message);
            } else {
                console.log('huhu');
                // setOpenSnackBar(true);
                // setSnackBarStatus(false);
                // snackBarStatus = false;
                // dynamicAlert(snackBarStatus, res.message);
            }
        });
    };
    const EventSchedule = previewData.map((item, index) => {
        const container = {};
        container['id'] = index;
        container['date'] = item.date;
        container['title'] = item.title + '-' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        // container['backgroundColor'] = '#5ba8f5';
        container['existed'] = item.existed;
        container['backgroundColor'] = item.existed ? '#ff3d00' : '#5ba8f5';

        return container;
    });
    // const onSubmit = (data) => {
    //     console.log('form submit', data);
    // };

    const dateFormat = schedule.map((item) => {
        return new Date(item);
    });

    const handleCreate = () => {
        // const params = {
        //     name: submitData.name,
        //     amount_per_register: submitData.amountPerRegister,
        //     description: submitData.description,
        //     maxQuantityComitee: submitData.maxQuantityComitee,
        //     totalAmount: submitData.cost,
        //     IsContinuous: submitData.IsContinuous,
        // };

        eventApi.updateEventSchedule(id, previewData).then((response) => {
            console.log('update event', response);
            console.log('update event', response.data);

            if (response.data.length != 0) {
                // setOpenSnackBar(true);
                // setSnackBarStatus(true);
                // snackBarStatus = true;
                // dynamicAlert(snackBarStatus, res.message);
                navigate(`/admin/events/${id}`);
            } else {
                console.log('huhu');
                // setOpenSnackBar(true);
                // setSnackBarStatus(false);
                // snackBarStatus = false;
                // dynamicAlert(snackBarStatus, res.message);
            }
        });
    };

    return (
        <Fragment>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Chỉnh sửa lịch sự kiện
            </Typography>
            {/* {dateFormat[0] && dateFormat[0].toDateString()} */}
            <Dialog fullWidth maxWidth="lg" open={open}>
                <DialogTitle>Xem trước lịch sự kiện</DialogTitle>
                <DialogContent sx={{ height: '590px' }}>
                    <FullCalendar
                        initialDate={EventSchedule[0] && new Date(EventSchedule[0].date)}
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
                        events={EventSchedule}
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
                {schedule[0] && (
                    <Box sx={{ width: '60%', mt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                            <Grid container columns={12} spacing={2}>
                                <Grid item xs={6}>
                                    <Controller
                                        required
                                        name="startDate"
                                        control={control}
                                        defaultValue={new Date(schedule[0])}
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
                                    <Controller
                                        required
                                        name="startTime"
                                        control={control}
                                        defaultValue={new Date('2000-09-01T' + schedule[2] + ':00')}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <TimePicker
                                                label="Thời gian bắt đầu"
                                                // disablePast
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
                                        defaultValue={new Date(schedule[1])}
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
                                    <Controller
                                        required
                                        name="finishTime"
                                        control={control}
                                        defaultValue={new Date('2000-09-01T' + schedule[3] + ':00')}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <TimePicker
                                                label="Thời gian kết thúc"
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

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                                Xem trước
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Fragment>
    );
}

export default EditEventSchedule;
