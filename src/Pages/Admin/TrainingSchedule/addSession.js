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

import { useState } from 'react';
import vi from 'date-fns/locale/vi';
import { useEffect } from 'react';
import { Paper } from '@mui/material';
import trainingScheduleApi from 'src/api/trainingScheduleApi';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
function AddSchedule() {
    moment().locale('vi');
    let { date } = useParams();
    let navigate = useNavigate();

    const schema = Yup.object().shape({
        date: Yup.string().nullable().required('Điền đi'),
        startTime: Yup.string().nullable().required('Điền đi'),
        finishTime: Yup.string().nullable().required('Điền đi'),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur',
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
    const onSubmit = (data) => {
        // setSubmitData(moment(new Date(data.startDate)).format('yyyy-MM-DD'));
        const dataFormat = {
            date: moment(new Date(data.date)).format('yyyy-MM-DD'),
            startTime: moment(new Date(data.startTime)).format('HH:mm:ss'),
            finishTime: moment(new Date(data.finishTime)).format('HH:mm:ss'),
        };
        trainingScheduleApi.createSession(dataFormat).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data.length != 0) {
                setOpenSnackBar(true);
                // setSnackBarStatus(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
                navigate(-1);
            } else {
                console.log('huhu');
                setOpenSnackBar(true);
                // setSnackBarStatus(false);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus, res.message);
            }
        });
        console.log('form submit', dataFormat);
    };

    const [timePicked, setTimePicked] = useState(null);
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
                    <Typography variant="h4" component="div" sx={{ marginBottom: '16px', fontWeight: '700' }}>
                        Tạo buổi tập
                    </Typography>
                    <Grid container spacing={3} columns={12}>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                required
                                name="date"
                                control={control}
                                defaultValue={date ? date : null}
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
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                        <Grid item xs={12} sm={4}>
                            {' '}
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
                    <Button color="primary" variant="contained" type="submit" sx={{ mt: 2 }}>
                        Xác nhận
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default AddSchedule;
