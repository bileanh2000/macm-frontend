import { Box, ButtonGroup, Button, Typography, TextField, Grid, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider, StaticDatePicker, TimePicker } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import vi from 'date-fns/locale/vi';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import trainingSchedule from 'src/api/trainingScheduleApi';
import moment from 'moment';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

function UpdateTouramentSchedule() {
    const currentDate = new Date();

    const [open, setOpen] = useState(false);
    const { scheduleId } = useParams();
    const [scheduleList, setScheduleList] = useState([]);

    const [value, setValue] = useState(scheduleList);
    const [selectedDate, setSelectedDate] = useState();
    const [dateValue, setDateValue] = useState();

    const schema = Yup.object().shape({
        date: Yup.string()
            .nullable()
            .matches(/(\d{4})-(\d{2})-(\d{2})/, 'Vui lòng nhập đúng định dạng ngày tháng YYYY-MM-DD'),
        // endDate: Yup.string().nullable().required('Điền đi'),
        startTime: Yup.string()
            .nullable()
            .required('Không để để trống trường này')
            .matches(/(\d{2}):(\d{2}):(\d{2})/, 'Vui lòng nhập đúng định dạng thời gian HH:mm:ss'),
        finishTime: Yup.string()
            .nullable()
            .required('Không để để trống trường này')
            .matches(/(\d{2}):(\d{2}):(\d{2})/, 'Vui lòng nhập đúng định dạng thời gian HH:mm:ss'),
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchSchedule = async () => {
            try {
                const response = await trainingSchedule.getAllSchedule();
                console.log(
                    'Thanh cong roi: ',
                    response.data.filter((item) => item.id === parseInt(scheduleId)),
                );

                console.log('scheduleId ', scheduleId);
                let dataSelected = response.data.filter((item) => item.id === parseInt(scheduleId));
                let dateSelected = dataSelected[0].date;
                setScheduleList(dataSelected);
                setSelectedDate(new Date(dateSelected));
            } catch (error) {
                console.log('That bai roi huhu ', error);
            }
        };
        fetchSchedule();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmDialog = async () => {
        setOpen(false);
        await trainingSchedule.deleteSession(scheduleId).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            console.log('3', res.message);
        });
        setTimeout(navigate(-1), 50000);
    };
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
            id: parseInt(scheduleId, 10),
            date: moment(dateValue).format('yyyy-MM-DD'),
            startTime: data.startTime,
            finishTime: data.finishTime,
        };
        await trainingSchedule.updateSchedule(data).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data.length != 0) {
                setOpenSnackBar(true);
                // setSnackBarStatus(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
                navigate(`/admin/trainingschedules`);
            } else {
                console.log('huhu');
                setOpenSnackBar(true);
                // setSnackBarStatus(false);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus, res.message);
            }
        });
        console.log('form submit', data);
    };
    // const onSubmit = (data) => {
    //     console.log('form submit', data);
    // };
    return (
        <Box>
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Xác nhận xóa!'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Bạn muốn xóa buổi sự kiện này?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Từ chối</Button>
                    <Button onClick={handleConfirmDialog} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" color="initial" sx={{ marginBottom: '16px', fontWeight: '700' }}>
                    Cập nhật buổi tập
                </Typography>
                {selectedDate <= currentDate ? (
                    ''
                ) : (
                    <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={handleClickOpen}>
                        Xóa buổi sự kiện
                    </Button>
                )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                        className="signup-form"
                        sx={{ width: '100%', mt: 5 }}
                    >
                        {scheduleList.map((item) => {
                            return (
                                <Grid container spacing={1} columns={12} key={item.id}>
                                    <Grid item sm={4}>
                                        <TextField
                                            disabled
                                            id="outlined-disabled"
                                            label="Ngày tháng"
                                            defaultValue={item.date}
                                            fullWidth
                                            {...register('date')}
                                            error={errors.date ? true : false}
                                            helperText={errors.date?.message}
                                        />
                                    </Grid>
                                    <Grid item sm={4}>
                                        <TextField
                                            required
                                            id="outlined-disabled"
                                            label="Thời gian bắt đầu"
                                            defaultValue={item.startTime}
                                            fullWidth
                                            {...register('startTime')}
                                            error={errors.startTime ? true : false}
                                            helperText={errors.startTime?.message}
                                        />
                                    </Grid>
                                    <Grid item sm={4}>
                                        <TextField
                                            required
                                            id="outlined-disabled"
                                            label="Thời gian bắt đầu"
                                            defaultValue={item.finishTime}
                                            fullWidth
                                            {...register('finishTime')}
                                            error={errors.finishTime ? true : false}
                                            helperText={errors.finishTime?.message}
                                        />
                                    </Grid>
                                </Grid>
                            );
                        })}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button color="primary" variant="contained" type="submit" sx={{ mt: 3 }}>
                                Xác nhận
                            </Button>
                        </Box>
                    </Box>
                </LocalizationProvider>
            </Box>
        </Box>
    );
}

export default UpdateTouramentSchedule;
