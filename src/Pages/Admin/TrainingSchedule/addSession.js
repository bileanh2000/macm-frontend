import { useState, useEffect } from 'react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
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

import vi from 'date-fns/locale/vi';
import { Paper } from '@mui/material';
import trainingScheduleApi from 'src/api/trainingScheduleApi';

function addSession() {
    moment().locale('vi');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const schema = Yup.object().shape({
        startDate: Yup.string().nullable().required('Điền đi'),
        endDate: Yup.string().nullable().required('Điền đi'),
        startTime: Yup.string().nullable().required('Điền đi'),
        endTime: Yup.string().nullable().required('Điền đi'),
    });

    const { control, handleSubmit } = useForm({
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
    const onSubmit = (data) => {
        // setSubmitData(moment(new Date(data.startDate)).format('yyyy-MM-DD'));
        const dataFormat = {
            startDate: moment(new Date(data.startDate)).format('DD/MM/yyyy'),
            endDate: moment(new Date(data.endDate)).format('DD/MM/yyyy'),
            startTime: moment(new Date(data.startTime)).format('HH:mm:ss'),
            endTime: moment(new Date(data.endTime)).format('HH:mm:ss'),
            daysOfWeek: data.dayOfWeek,
        };
        // trainingScheduleApi.createSchedule(dataFormat).then((res) => {
        //     console.log('1', res);
        //     console.log('2', res.data);
        //     if (res.data.length != 0) {
        //         setOpenSnackBar(true);
        //         // setSnackBarStatus(true);
        //         snackBarStatus = true;
        //         dynamicAlert(snackBarStatus, res.message);
        //     } else {
        //         console.log('huhu');
        //         setOpenSnackBar(true);
        //         // setSnackBarStatus(false);
        //         snackBarStatus = false;
        //         dynamicAlert(snackBarStatus, res.message);
        //     }
        // });
        console.log('form submit', dataFormat);
    };

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
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="signup-form">
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <Typography variant="h5" component="div" sx={{ marginBottom: '16px', fontWeight: '700' }}>
                        Tạo lịch tập
                    </Typography>
                    <Grid container spacing={6} columns={12}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                required
                                name="date"
                                control={control}
                                defaultValue={null}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <DatePicker
                                        disablePast
                                        label="Ngày tháng"
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
                            <Controller
                                required
                                name="startTime"
                                control={control}
                                defaultValue={null}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <TimePicker
                                        label="Thời gian bắt đầu"
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
                        <Grid item xs={12} sm={6}>
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
                    <Button color="primary" variant="contained" type="submit" sx={{ mt: 5 }}>
                        Xác nhận
                    </Button>
                </Box>
            </form>
        </Box>
    )
}

export default addSession