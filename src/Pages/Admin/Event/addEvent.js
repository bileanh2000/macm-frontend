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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { forwardRef, Fragment, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function AddEvent() {
    const [isChecked, setIsChecked] = useState(false);
    const [isCheckedForm, setIsCheckedForm] = useState(false);
    const [description, setDescription] = useState('');
    const [submitData, setSubmitData] = useState([]);
    const [event, setEvent] = useState([]);
    const [cost, setCost] = useState();
    const [cash, setCash] = useState();
    const [open, setOpen] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [eventId, setEventId] = useState();
    const [checked, setChecked] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [numOfPersonEstimated, setNumOfPersonEstimated] = useState();
    const [totalAmountEstimated, setTotalAmountEstimated] = useState();
    const [amountFromClub, setAmountFromClub] = useState();

    const [isOverride, setIsOverride] = useState(-1);
    let navigator = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCreate = () => {
        const params = {
            name: submitData.name,
            amountPerRegisterEstimated: submitData.amount_per_register,
            description: submitData.description,
            maxQuantityComitee: submitData.maxQuantityComitee,
            totalAmountEstimated: submitData.cost,
            IsContinuous: submitData.IsContinuous,
            amountFromClub: submitData.amountFromClub,
        };
        console.log(params);

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
                eventApi.createScheduleSession(previewData, response.data[0].id).then((res) => {
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
        isChecked(false);
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        maxQuantityComitee: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
        numOfParticipants: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
        startTime: Yup.string().nullable().required('Không được để trống trường này'),
        finishTime: Yup.string().nullable().required('Không được để trống trường này'),
        cost: Yup.string().required('Không được để trống trường này').min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
        ...(isChecked && {
            amountPerRegister: Yup.number()
                .required('Không được để trống trường này')
                .typeError('Vui lòng nhập số')
                .min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
        }),
        startDate: Yup.string().nullable().required('Không được để trống trường này'),
        finishDate: Yup.string().nullable().required('Không được để trống trường này'),
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

    const onSubmit = (data) => {
        setIsChecked(false);
        // setOpen(false);
        let dataSubmit = {
            maxQuantityComitee: data.maxQuantityComitee,
            description: description,
            finishTime: moment(new Date(data.finishTime)).format('HH:mm:ss'),
            startTime: moment(new Date(data.startTime)).format('HH:mm:ss'),
            startDate: moment(new Date(data.startDate)).format('DD/MM/yyyy'),
            finishDate: moment(new Date(data.finishDate)).format('DD/MM/yyyy'),
            numOfParticipants: data.numOfParticipants,
            name: data.name,
            cash: data.cash,
            cost: data.cost,
            amount_per_register: data.amountPerRegister,
            amountFromClub: data.amountFromClub,
            // IsContinuous: isChecked,
        };
        setSubmitData(dataSubmit);

        eventApi.createPreviewEvent(dataSubmit).then((res) => {
            console.log('1', res);
            console.log('2', res.data);

            if (res.data.length != 0) {
                // setOpenSnackBar(true);
                // setSnackBarStatus(true);
                // snackBarStatus = true;
                // dynamicAlert(snackBarStatus, res.message);
                checkOveride(res.data);
                setPreviewData(res.data);
                setOpen(true);
            } else {
                console.log('huhu');
                // setOpenSnackBar(true);
                // setSnackBarStatus(false);
                // snackBarStatus = false;
                // dynamicAlert(snackBarStatus, res.message);
            }
        });
        console.log(dataSubmit);
    };
    const EventSchedule = previewData.map((item, index) => {
        const container = {};
        container['id'] = index;
        container['date'] = item.date;
        container['title'] = item.title + '-' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        // container['backgroundColor'] = isOverride === -1 || isOverride === 0 ? '#5ba8f5' : '#ff3d00';
        container['backgroundColor'] = item.existed ? '#ff3d00' : '#5ba8f5';

        return container;
    });

    const handleChangeOverride = (event) => {
        setChecked(event.target.checked);
        if (event.target.checked) {
            setIsOverride(2);
            setDisabled(false);
        } else {
            setDisabled(true);
            setIsOverride(0);
        }
    };

    const checkOveride = (EventSchedule) => {
        EventSchedule.map((item) => {
            if (item.title.toString() === 'Trùng với Lịch tập') {
                setDisabled(true);
                setIsOverride(0);
                return 0;
            } else if (item.title.toString().includes('Trùng với')) {
                setDisabled(true);
                setIsOverride(1);
                return 1;
            } else {
                setDisabled(false);
                setIsOverride(-1);
                return -1;
            }
        });
    };
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
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Thêm sự kiện mới
            </Typography>
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
                    {(isOverride === 0 || isOverride === 2) && (
                        <FormControlLabel
                            sx={{ marginLeft: '1px' }}
                            control={
                                <Switch hidden={isOverride === 1} checked={checked} onChange={handleChangeOverride} />
                            }
                            label="Lịch đang trùng với lịch tập, bạn có muốn tạo không"
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Quay lại</Button>
                    <Button onClick={handleCreate} disabled={disabled}>
                        Đồng ý
                    </Button>
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
                <Box sx={{ width: '50%' }}>
                    <TextField
                        id="outlined-basic"
                        label="Tên sự kiện"
                        variant="outlined"
                        fullWidth
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
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    setNumOfPersonEstimated(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                id="outlined-basic"
                                label="Số người ban tổ chức"
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
                                <Controller
                                    required
                                    name="startTime"
                                    control={control}
                                    defaultValue={null}
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
                                <Controller
                                    required
                                    name="finishTime"
                                    control={control}
                                    defaultValue={null}
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
                    {amountFromClub &&
                        totalAmountEstimated &&
                        amountFromClub &&
                        (totalAmountEstimated - amountFromClub) / numOfPersonEstimated}
                    <Controller
                        name="cost"
                        variant="outlined"
                        defaultValue=""
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                            <NumberFormat
                                name="cost"
                                customInput={TextField}
                                label="Tổng chi phí tổ chức dự kiến"
                                thousandSeparator={true}
                                variant="outlined"
                                defaultValue=""
                                value={value}
                                onValueChange={(v) => {
                                    onChange(Number(v.value));
                                    setTotalAmountEstimated(Number(v.value));
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                }}
                                error={invalid}
                                helperText={invalid ? error.message : null}
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="amountFromClub"
                        variant="outlined"
                        defaultValue=""
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                            <NumberFormat
                                name="amountFromClub"
                                customInput={TextField}
                                label="Số tiền tài trợ từ CLB"
                                thousandSeparator={true}
                                variant="outlined"
                                defaultValue=""
                                value={value}
                                onValueChange={(v) => {
                                    onChange(Number(v.value));
                                    setAmountFromClub(Number(v.value));
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">VND</InputAdornment>,
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
                            control={
                                <Switch checked={isCheckedForm} onChange={() => setIsCheckedForm(!isCheckedForm)} />
                            }
                            label="Yêu cầu thành viên đóng tiền"
                        />
                        {/* <Typography>Tổng tiền quỹ: 2.000.000 vnđ</Typography> */}
                    </Box>
                    <Collapse in={isCheckedForm}>
                        {/* {amountFromClub && totalAmountEstimated && amountFromClub && ( */}
                        <Controller
                            name="amountPerRegister"
                            variant="outlined"
                            // defaultValue={
                            //     amountFromClub && (totalAmountEstimated - amountFromClub) / numOfPersonEstimated
                            // }
                            defaultValue=""
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                <NumberFormat
                                    name="amountPerRegister"
                                    customInput={TextField}
                                    label="Dự kiến số tiền mỗi người cần phải đóng"
                                    thousandSeparator={true}
                                    variant="outlined"
                                    defaultValue=""
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
                        />
                        {/* )} */}
                    </Collapse>
                    {/* <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                        Dự kiến mỗi người phải đóng: 160k
                    </Typography> */}

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
                            Xem trước
                        </Button>
                    </div>
                </Box>
            </Box>
        </Fragment>
    );
}

export default AddEvent;
