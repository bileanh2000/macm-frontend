import {
    Box,
    FormControlLabel,
    Switch,
    TextField,
    Typography,
    Grid,
    Collapse,
    Button,
    InputAdornment,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { forwardRef, Fragment, useEffect, useState } from 'react';
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import styles from './Event.module.scss';
import classNames from 'classnames/bind';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import eventApi from 'src/api/eventApi';
import { Link, useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function EditEvent() {
    const [isChecked, setIsChecked] = useState(false);
    const [description, setDescription] = useState('');
    const [submitData, setSubmitData] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [event, setEvent] = useState([]);
    const [cost, setCost] = useState();
    const [cash, setCash] = useState();
    const [open, setOpen] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [eventId, setEventId] = useState();
    const [events, setEvents] = useState([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [scheduleList, setScheduleList] = useState([]);
    const [dataUpdateEvent, setDataUpdateEvent] = useState([]);
    let navigate = useNavigate();

    let snackBarStatus;
    const { id } = useParams();

    console.log(id);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };
    useEffect(() => {
        const getListEventsBySemester = async () => {
            try {
                const response = await eventApi.getAll();
                let selectedEvent = response.data.filter((item) => item.id === parseInt(id));
                // console.log(selectedEvent.name);
                console.log(selectedEvent);
                setEvents(selectedEvent);
                console.log(response.data);
            } catch (error) {
                console.log('Lấy dữ liệu thất bại', error);
            }
        };

        getListEventsBySemester();
    }, []);
    // console.log(events);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        maxQuantityComitee: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        // amountPerRegister: Yup.number()
        //     .required('Không được để trống trường này')
        //     .typeError('Vui lòng nhập số')
        //     .min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
        // totalAmount: Yup.number()
        //     .required('Không được để trống trường này')
        //     .typeError('Vui lòng nhập số')
        //     .min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
        startDate: Yup.date().typeError('Vui lòng không để trống trường này'),
        finishDate: Yup.date()
            .min(Yup.ref('startDate'), ({ min }) => `Ngày kết thúc không được bé hơn ngày bắt đầu`)
            .typeError('Vui lòng không để trống trường này'),
        startTime: Yup.date().typeError('Vui lòng không để trống trường này'),
        finishTime: Yup.date().typeError('Vui lòng không để trống trường này'),
    });
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };
    const onSubmit = async (data) => {
        let dataSubmit = {
            name: data.name,
            amount_per_register: data.amountPerRegister,
            maxQuantityComitee: data.maxQuantityComitee,
            description: data.description,
            totalAmount: data.totalAmount,
        };
        let scheduleData = {
            id: parseInt(id, 10),
            startDate: moment(data.startDate).format('DD/MM/yyyy'),
            finishDate: moment(data.finishDate).format('DD/MM/yyyy'),
            startTime: moment(data.startTime).format('HH:mm:ss'),
            finishTime: moment(data.finishTime).format('HH:mm:ss'),
        };
        setDataUpdateEvent(dataSubmit);
        await eventApi.previewUpdateEventSessionTime(id, scheduleData).then((res) => {
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
        setSubmitData(dataSubmit);

        console.log(dataSubmit);
    };

    const handleCreate = () => {
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
        eventApi.updateEvent(dataUpdateEvent, id).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data.length !== 0) {
                setOpenSnackBar(true);
                // setSnackBarStatus(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
            } else {
                console.log('huhu');
                setOpenSnackBar(true);
                // setSnackBarStatus(false);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus, res.message);
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

    const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumberFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                isNumericString
            />
        );
    });
    NumberFormatCustom.propTypes = {
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };
    const fetchEventSchedule = async (params) => {
        try {
            const response = await eventApi.getEventScheduleByEvent(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };
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
        fetchEventSchedule(id);
        fetchEventScheduleByEventId(id);
    }, [id]);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.event.name + ' - ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';

        return container;
    });

    useEffect(() => {
        let titleWrapper = document.querySelectorAll('.fc-event-title');
        let content = Array.prototype.map.call(titleWrapper, (i) => i.textContent);
        titleWrapper = Array.prototype.map.call(titleWrapper, (i, index) => i.setAttribute('title', content[index]));
        console.log(titleWrapper);
    });

    return (
        <Fragment>
            {/* <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Bạn muốn xóa sự kiện này ?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Sự kiện sẽ được xóa khỏi hệ thống !
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                    <Button onClick={handleDelete(id)} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog> */}

            {/* {scheduleList.map((item) => { */}
            {/* return ( */}
            {scheduleList[0] && (
                <Fragment key={scheduleList[0].id}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                            Chỉnh sửa thông tin sự kiện "{scheduleList[0].event.name}"
                        </Typography>
                    </Box>
                    <Grid container columns={12} sx={{ mt: 2 }} spacing={3}>
                        <Grid item xs={5}>
                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': { mb: 2 },
                                }}
                                noValidate
                                autoComplete="off"
                                onSubmit={handleSubmit}
                            >
                                <TextField
                                    id="outlined-basic"
                                    label="Tên sự kiện"
                                    variant="outlined"
                                    fullWidth
                                    defaultValue={scheduleList[0].event.name}
                                    {...register('name')}
                                    error={errors.name ? true : false}
                                    helperText={errors.name?.message}
                                />

                                <TextField
                                    type="number"
                                    id="outlined-basic"
                                    label="Số người ban tổ chức"
                                    defaultValue={scheduleList[0].event.maxQuantityComitee}
                                    variant="outlined"
                                    fullWidth
                                    {...register('maxQuantityComitee')}
                                    error={errors.maxQuantityComitee ? true : false}
                                    helperText={errors.maxQuantityComitee?.message}
                                />

                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                    <Grid container columns={12} spacing={2}>
                                        <Grid item xs={6}></Grid>
                                        <Grid item xs={6}></Grid>
                                    </Grid>
                                </LocalizationProvider>

                                {/* <Controller
                                    name="totalAmount"
                                    variant="outlined"
                                    defaultValue={scheduleList[0].event.totalAmountEstimated}
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <NumberFormat
                                            name="totalAmount"
                                            customInput={TextField}
                                            label="Tổng chi phí dự kiến"
                                            thousandSeparator={true}
                                            variant="outlined"
                                            defaultValue={scheduleList[0].event.totalAmountEstimated}
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
                                /> */}

                                {/* <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                Dự kiến mỗi người phải đóng: 160k
                            </Typography> */}
                                {/* <Controller
                                    name="amountPerRegister"
                                    variant="outlined"
                                    defaultValue={scheduleList[0].event.amountPerRegisterEstimated}
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <NumberFormat
                                            name="amountPerRegister"
                                            customInput={TextField}
                                            label="Dự kiến số tiền mỗi người phải đóng"
                                            thousandSeparator={true}
                                            variant="outlined"
                                            defaultValue={scheduleList[0].event.amountPerRegisterEstimated}
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
                                /> */}
                                {/* <TextField
                                id="outlined-multiline-flexible"
                                name="description"
                                control={control}
                                label="Nội dung"
                                multiline
                                maxRows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                // {...register('content')}
                            /> */}
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                    {schedule[0] && (
                                        <Grid container columns={12} spacing={2}>
                                            <Grid item xs={6}>
                                                <Controller
                                                    required
                                                    name="startDate"
                                                    control={control}
                                                    defaultValue={new Date(schedule[0])}
                                                    render={({
                                                        field: { onChange, value },
                                                        fieldState: { error, invalid },
                                                    }) => (
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
                                                    render={({
                                                        field: { onChange, value },
                                                        fieldState: { error, invalid },
                                                    }) => (
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
                                                    render={({
                                                        field: { onChange, value },
                                                        fieldState: { error, invalid },
                                                    }) => (
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
                                                    render={({
                                                        field: { onChange, value },
                                                        fieldState: { error, invalid },
                                                    }) => (
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
                                    )}
                                </LocalizationProvider>
                                <TextField
                                    id="standard-multiline-static"
                                    label="Nội dung"
                                    multiline
                                    rows={4}
                                    defaultValue={scheduleList[0].event.description}
                                    variant="outlined"
                                    fullWidth
                                    {...register('description')}
                                />
                                <div className={cx('create-event-button')}>
                                    <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                                        Cập nhật thông tin
                                    </Button>
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={7} sx={{ minHeight: '755px' }}>
                            <FullCalendar
                                // initialDate={new Date('2022-09-01')}
                                initialDate={scheduleData[0] && new Date(scheduleData[0].date)}
                                locale="vie"
                                height="60%"
                                plugins={[dayGridPlugin, interactionPlugin]}
                                // defaultView="dayGridMonth"
                                events={scheduleData}
                                weekends={true}
                                headerToolbar={{
                                    left: 'title',
                                    center: 'dayGridMonth,dayGridWeek',
                                    right: 'prev next today',
                                    // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Fragment>
            )}

            {/* ); */}
            {/* })} */}
            {/* <MemberEvent /> */}

            {/* <Helmet>
                <script src="src/Components/Common/addTitleForSchedule.js" type="text/javascript" />
            </Helmet> */}
        </Fragment>
    );
}

export default EditEvent;
