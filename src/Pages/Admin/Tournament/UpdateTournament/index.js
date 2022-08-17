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
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller, useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import classNames from 'classnames/bind';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

import UpdatePerformanceCompetition from './UpdatePerformanceCompetition';
import adminTournament from 'src/api/adminTournamentAPI';
import UpdateFightingCompetition from './UpdateFightingCompetition';
import PreviewData from './PreviewData';

function UpdateTournament() {
    const nowDate = new Date();
    const [tournament, setTournament] = useState([]);
    const [datasFightingCompetition, setDataFightingCompetition] = useState([]);
    const [datasPerformanceCompetition, setDataPerformanceCompetition] = useState([]);
    const [open, setOpen] = useState(false);
    const { tournamentId } = useParams();
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [scheduleUpdate, setScheduleUpdate] = useState({});
    const [scheduleList, setScheduleList] = useState([]);
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });

    let snackBarStatus;

    const getListTournamentsBySemester = async () => {
        try {
            const response = await adminTournament.getTournamentById(tournamentId);
            setTournament(response.data);
            setDataFightingCompetition(response.data[0].competitiveTypes);
            setDataPerformanceCompetition(response.data[0].exhibitionTypes);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };

    const getTournamentSchedule = async (params) => {
        try {
            const response = await adminTournament.getTournamentSchedule(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };

    useEffect(() => {
        getListTournamentsBySemester();
        getTournamentSchedule(tournamentId);
    }, []);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] =
            item.tournament.name + ' - ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';

        return container;
    });

    const AddFightingCompetitionHandler = (FightingCompetition) => {
        setDataFightingCompetition(FightingCompetition);
    };
    const PerformanceCompetitionHandler = (PerformanceCompetition) => {
        setDataPerformanceCompetition(PerformanceCompetition);
    };

    const validationSchema = Yup.object().shape({
        tournamentName: Yup.string().required('Không được để trống trường này'),
        description: Yup.string().required('Không được để trống trường này'),
        startDate: Yup.date().typeError('Vui lòng không để trống trường này'),
        finishDate: Yup.date()
            .min(Yup.ref('startDate'), ({ min }) => `Ngày kết thúc không được bé hơn ngày bắt đầu`)
            .typeError('Vui lòng không để trống trường này'),
        cost: Yup.string().required('Không được để trống trường này'),
        startTime: Yup.string()
            .nullable()
            .required('Không để để trống trường này')
            .matches(/^([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/, 'Vui lòng nhập đúng định dạng thời gian HH:mm:ss'),
        finishTime: Yup.string()
            .nullable()
            .required('Không để để trống trường này')
            .matches(/^([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/, 'Vui lòng nhập đúng định dạng thời gian HH:mm:ss'),
    });

    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const dynamicAlert = (status, message) => {
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    const onUpdateTournament = (data) => {
        let dataSubmit = {
            competitiveTypesDto: datasFightingCompetition,
            exhibitionTypesDto: datasPerformanceCompetition,
            name: data.tournamentName,
            description: data.description,
        };
        adminTournament.updateTournament(dataSubmit, tournamentId).then((res) => {
            if (res.data.length != 0) {
                setOpenSnackBar(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
            } else {
                setOpenSnackBar(true);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus, res.message);
            }
        });
    };

    const handleUpdate = (data) => {
        const newData = { finishTime: data.finishTime, startTime: data.startTime, date: scheduleUpdate.date };

        if (scheduleUpdate.params) {
            adminTournament.updateTournamentSession(scheduleUpdate.params.id, newData).then((res) => {
                if (res.data.length != 0) {
                    const newScheduleList = scheduleList.map((date) =>
                        date.id === scheduleUpdate.params.id
                            ? { ...date, finishTime: newData.finishTime, startTime: newData.startTime }
                            : date,
                    );

                    setScheduleList(newScheduleList);
                    setOpenSnackBar(true);
                    snackBarStatus = true;
                    dynamicAlert(snackBarStatus, res.message);
                    handleClose();
                } else {
                    setOpenSnackBar(true);
                    snackBarStatus = false;
                    dynamicAlert(snackBarStatus, res.message);
                    handleClose();
                }
            });
        } else {
            adminTournament.createTournamentSession(tournamentId, newData).then((res) => {
                if (res.data.length != 0) {
                    const newScheduleList = [...scheduleList, res.data[0]];
                    setScheduleList(newScheduleList);
                    setOpenSnackBar(true);
                    snackBarStatus = true;
                    dynamicAlert(snackBarStatus, res.message);
                    handleClose();
                } else {
                    setOpenSnackBar(true);
                    snackBarStatus = false;
                    dynamicAlert(snackBarStatus, res.message);
                    handleClose();
                }
            });
        }
    };
    const handleClose = () => {
        setOpen(false);
        setScheduleUpdate({});
        reset({
            startTime: '',
            finishTime: '',
        });
    };

    const handleDelete = (id) => {
        adminTournament.deleteTournamentSession(id).then((res) => {
            if (res.data.length != 0) {
                const newScheduleList = scheduleList.filter((date) => date.id !== id);
                setScheduleList(newScheduleList);
                setOpenSnackBar(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
                handleClose();
            } else {
                setOpenSnackBar(true);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus, res.message);
                handleClose();
            }
        });
    };

    const getMonthInCurrentTableView = (startDate) => {
        const temp = new Date(startDate);
        temp.setDate(temp.getDate() + 17);
        const currentMonth = temp.getMonth() + 1;
        const currentYear = temp.getFullYear();
        setMonthAndYear({ month: currentMonth, year: currentYear });
    };

    const navigateToUpdate = (params, date, day) => {
        if (
            date.getMonth() === nowDate.getMonth() &&
            date.getFullYear() === nowDate.getFullYear() &&
            date.getDate() === nowDate.getDate()
        ) {
            return;
        } else {
            const data = scheduleList.filter((date) => date.id == params);
            setScheduleUpdate({ date: day, params: data[0] });
            setOpen(true);
        }
    };
    const navigateToCreate = (day, date) => {
        if (date > nowDate) {
            const existSession = scheduleList.filter((item) => item.date === day).length; //length = 0 (false) is not exist
            if (!existSession) {
                setScheduleUpdate({ date: day, params: null });
                setOpen(true);
            } else {
                return;
            }
        }
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
        reset,
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
                        <Fragment key={index}>
                            {scheduleUpdate && (
                                <Dialog fullWidth maxWidth="lg" open={open}>
                                    <DialogTitle>
                                        <Grid container spacing={1} columns={12}>
                                            <Grid item sm={6}>
                                                {scheduleUpdate.params ? 'Cập nhật' : 'Thêm mới'}
                                            </Grid>
                                            <Grid item sm={6}>
                                                {scheduleUpdate.params && (
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<DeleteIcon />}
                                                        color="error"
                                                        onClick={() => handleDelete(scheduleUpdate.params.id)}
                                                        sx={{ float: 'right' }}
                                                    >
                                                        Xóa lịch
                                                    </Button>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </DialogTitle>
                                    <DialogContent sx={{ height: '500px', paddingTop: '20px !important' }}>
                                        <Grid container spacing={1} columns={12} key={item.id}>
                                            <Grid item sm={4}>
                                                <TextField
                                                    disabled
                                                    id="outlined-disabled"
                                                    label="Ngày tháng"
                                                    defaultValue={scheduleUpdate.date}
                                                    fullWidth
                                                    {...register('date')}
                                                    //error={errors.date ? true : false}
                                                    //helperText={errors.date?.message}
                                                />
                                            </Grid>
                                            <Grid item sm={4}>
                                                <TextField
                                                    required
                                                    control={control}
                                                    id="outlined-disabled"
                                                    label="Thời gian bắt đầu"
                                                    defaultValue={
                                                        scheduleUpdate.params ? scheduleUpdate.params.startTime : ''
                                                    }
                                                    fullWidth
                                                    {...register('startTime')}
                                                    error={errors.startTime ? true : false}
                                                    helperText={errors.startTime?.message}
                                                />
                                            </Grid>
                                            <Grid item sm={4}>
                                                <TextField
                                                    required
                                                    control={control}
                                                    id="outlined-disabled"
                                                    label="Thời gian kết thúc"
                                                    defaultValue={
                                                        scheduleUpdate.params ? scheduleUpdate.params.finishTime : ''
                                                    }
                                                    fullWidth
                                                    {...register('finishTime')}
                                                    error={errors.finishTime ? true : false}
                                                    helperText={errors.finishTime?.message}
                                                />
                                            </Grid>
                                        </Grid>
                                    </DialogContent>

                                    <DialogActions>
                                        <Button onClick={handleClose}>Quay lại</Button>
                                        <Button onClick={handleSubmit(handleUpdate)}>Xác nhận</Button>
                                    </DialogActions>
                                </Dialog>
                            )}
                            <Grid container columns={12} sx={{ mt: 2 }} spacing={3}>
                                {/* <Box sx={{ width: '50%' }}  key={index}> */}
                                <Grid item xs={7}>
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
                                    <TextField
                                        id="outlined-multiline-flexible"
                                        name="description"
                                        control={control}
                                        label="Nội dung"
                                        defaultValue={item.description}
                                        multiline
                                        rows={4}
                                        // value={description}
                                        fullWidth
                                        {...register('description')}
                                        error={errors.description ? true : false}
                                        helperText={errors.description?.message}
                                    />
                                    <Controller
                                        name="cost"
                                        variant="outlined"
                                        defaultValue={item.totalAmountEstimate}
                                        control={control}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <NumberFormat
                                                name="totalAmount"
                                                customInput={TextField}
                                                label="Tổng chi phí tổ chức"
                                                thousandSeparator={true}
                                                variant="outlined"
                                                defaultValue={item.totalAmountEstimate}
                                                value={value}
                                                onValueChange={(v) => {
                                                    onChange(Number(v.value));
                                                }}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
                                                }}
                                                // error={invalid}
                                                helperText={invalid ? error.message : null}
                                                fullWidth
                                                disabled={true}
                                            />
                                        )}
                                    />
                                    <Grid container columns={12} spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                type="number"
                                                id="outlined-basic"
                                                label="Số người dự kiến tham gia ban tổ chức"
                                                variant="outlined"
                                                fullWidth
                                                defaultValue={item.maxQuantityComitee}
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Controller
                                                name="amountPerAdmin"
                                                variant="outlined"
                                                defaultValue={item.feeOrganizingCommiteePay}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error, invalid },
                                                }) => (
                                                    <NumberFormat
                                                        name="amountPerAdmin"
                                                        customInput={TextField}
                                                        label="Số tiền thành viên ban tổ chức cần phải đóng"
                                                        thousandSeparator={true}
                                                        variant="outlined"
                                                        defaultValue={item.feeOrganizingCommiteePay}
                                                        value={value}
                                                        onValueChange={(v) => {
                                                            onChange(Number(v.value));
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">vnđ</InputAdornment>
                                                            ),
                                                        }}
                                                        // error={invalid}
                                                        helperText={invalid ? error.message : null}
                                                        fullWidth
                                                        disabled={true}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                                        <Grid item xs={6}>
                                            <Controller
                                                name="amountPerRegister"
                                                variant="outlined"
                                                defaultValue={item.feePlayerPay}
                                                control={control}
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error, invalid },
                                                }) => (
                                                    <NumberFormat
                                                        name="amountPerRegister"
                                                        customInput={TextField}
                                                        label="Số tiền mỗi người cần phải đóng"
                                                        thousandSeparator={true}
                                                        variant="outlined"
                                                        defaultValue={item.feePlayerPay}
                                                        value={value}
                                                        onValueChange={(v) => {
                                                            onChange(Number(v.value));
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">vnđ</InputAdornment>
                                                            ),
                                                        }}
                                                        error={invalid}
                                                        helperText={invalid ? error.message : null}
                                                        fullWidth
                                                        disabled={true}
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
                                            <Typography
                                                sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }}
                                                variant="body1"
                                            >
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
                                            <Typography
                                                sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }}
                                                variant="body1"
                                            >
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
                                    <Button variant="contained" onClick={handleSubmit(onUpdateTournament)}>
                                        Cập nhật thông tin
                                    </Button>
                                </Grid>
                                <Grid item xs={5} sx={{ minHeight: '755px' }}>
                                    <FullCalendar
                                        // initialDate={new Date('2022-09-01')}
                                        initialDate={scheduleData[0] && new Date(scheduleData[0].date)}
                                        locale="vie"
                                        height="60%"
                                        plugins={[dayGridPlugin, interactionPlugin]}
                                        defaultView="dayGridMonth"
                                        events={scheduleData}
                                        weekends={true}
                                        headerToolbar={{
                                            left: 'title',
                                            center: 'dayGridMonth,dayGridWeek',
                                            right: 'prev next',
                                            // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                                        }}
                                        datesSet={(dateInfo) => {
                                            getMonthInCurrentTableView(dateInfo.start);
                                        }}
                                        eventClick={(args) => {
                                            navigateToUpdate(args.event.id, args.event.start, args.event.startStr);
                                        }}
                                        dateClick={function (arg) {
                                            navigateToCreate(arg.dateStr, arg.date);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Fragment>
                    );
                })}
            </Box>
        </Fragment>
    );
}

export default UpdateTournament;
