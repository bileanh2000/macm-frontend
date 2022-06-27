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
    const [event, setEvent] = useState([]);
    const [cost, setCost] = useState();
    const [cash, setCash] = useState();
    const [open, setOpen] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [eventId, setEventId] = useState();
    const [events, setEvents] = useState([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    let snackBarStatus;
    const { id } = useParams();

    console.log(id);

    let navigator = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCreate = () => {
        const params = {
            name: submitData.name,
            amount_per_register: submitData.amountPerRegister,
            description: submitData.description,
            maxQuantityComitee: submitData.maxQuantityComitee,
            totalAmount: submitData.cost,
        };

        eventApi.createEvent(params).then((response) => {
            console.log('create event', response);
            console.log('create event', response.data);
            console.log('create event id', response.data[0].id);
            setEventId(response.data[0].id);
            setEvent(response.data);

            if (response.data.length != 0) {
                // setOpenSnackBar(true);
                // setSnackBarStatus(true);
                // snackBarStatus = true;
                // dynamicAlert(snackBarStatus, res.message);
                eventApi.createScheduleSession(previewData, eventId).then((res) => {
                    console.log('create event schedule', res);
                    console.log('create event schedule', res.data);

                    if (res.data.length != 0) {
                        // setOpenSnackBar(true);
                        // setSnackBarStatus(true);
                        // snackBarStatus = true;
                        // dynamicAlert(snackBarStatus, res.message);
                        // setEvent(res.data);
                        navigator(-1);
                    } else {
                        console.log('huhu');
                        // setOpenSnackBar(true);
                        // setSnackBarStatus(false);
                        // snackBarStatus = false;
                        // dynamicAlert(snackBarStatus, res.message);
                    }
                });
            } else {
                console.log('huhu');
                // setOpenSnackBar(true);
                // setSnackBarStatus(false);
                // snackBarStatus = false;
                // dynamicAlert(snackBarStatus, res.message);
            }
        });
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
        // numOfParticipants: Yup.number()
        //     .required('Không được để trống trường này')
        //     .typeError('Vui lòng nhập số')
        //     .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        // startTime: Yup.string().nullable().required('Không được để trống trường này'),
        // finishTime: Yup.string().nullable().required('Không được để trống trường này'),
        cost: Yup.string().required('Không được để trống trường này'),
        ...(isChecked && {
            cash: Yup.string().required('Không được để trống trường này'),
        }),
        // startDate: Yup.string().nullable().required('Không được để trống trường này'),
        // finishDate: Yup.string().nullable().required('Không được để trống trường này'),
        amountPerRegister: Yup.number().required('Không được để trống trường này').typeError('Vui lòng nhập số'),
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
            description: description,
            totalAmount: data.totalAmount,
        };
        await eventApi.updateEvent(dataSubmit, id).then((res) => {
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
        setSubmitData(dataSubmit);

        console.log(dataSubmit);
    };

    const EventSchedule = previewData.map((item, index) => {
        const container = {};
        container['id'] = index;
        container['date'] = item.date;
        container['title'] = item.title + '-' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';

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
                    Chỉnh sửa thông tin sự kiện
                </Typography>
                <Button variant="contained" size="medium" component={Link} to={`../admin/events/${id}/eventschedule`}>
                    Chỉnh sửa lịch sự kiện
                </Button>
            </Box>
            <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
                <DialogTitle>Xem trước lịch sự kiện</DialogTitle>
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
                        events={EventSchedule}
                        weekends={true}
                        headerToolbar={{
                            left: 'title',
                            center: '',
                            right: 'prev next today',
                        }}

                        // eventClick={(args) => {
                        //     deleteDate(args.event.id);
                        // }}
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
                {events.map((item, index) => {
                    return (
                        <Box sx={{ width: '50%' }} key={index}>
                            <TextField
                                id="outlined-basic"
                                label="Tên sự kiện"
                                variant="outlined"
                                fullWidth
                                defaultValue={item.name}
                                {...register('name')}
                                error={errors.name ? true : false}
                                helperText={errors.name?.message}
                            />
                            <Grid container columns={12} spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        type="number"
                                        id="outlined-basic"
                                        label="Dự kiến số người tham gia"
                                        variant="outlined"
                                        fullWidth
                                        {...register('numOfParticipants')}
                                        error={errors.numOfParticipants ? true : false}
                                        helperText={errors.numOfParticipants?.message}
                                    />
                                </Grid>
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
                                defaultValue={item.amountPerMemberRegister}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <NumberFormat
                                        name="amountPerRegister"
                                        customInput={TextField}
                                        label="Số tiền mỗi người cần phải đóng"
                                        thousandSeparator={true}
                                        variant="outlined"
                                        defaultValue={item.amountPerMemberRegister}
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
                                multiline
                                maxRows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                // {...register('content')}
                            />
                            <div className={cx('create-event-button')}>
                                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
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

export default EditEvent;
