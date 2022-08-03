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
import trainingScheduleApi from 'src/api/trainingScheduleApi';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function AddSchedule() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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

    const onSubmit = (data) => {
        const dataFormat = {
            date: moment(new Date(data.date)).format('yyyy-MM-DD'),
            startTime: moment(new Date(data.startTime)).format('HH:mm:ss'),
            finishTime: moment(new Date(data.finishTime)).format('HH:mm:ss'),
        };
        trainingScheduleApi.createSession(dataFormat).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data.length != 0) {
                enqueueSnackbar(res.message, { variant: 'success' });
                navigate(-1);
            } else {
                console.log('huhu');
                enqueueSnackbar(res.message, { variant: 'error' });
            }
        });
        console.log('form submit', dataFormat);
    };

    return (
        <Box>
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
