import {
    Alert,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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

import { Fragment, useState } from 'react';
import vi from 'date-fns/locale/vi';
import trainingScheduleApi from 'src/api/trainingScheduleApi';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import adminTournament from 'src/api/adminTournamentAPI';

function AddSession({ title, children, isOpen, handleClose, onSucess, date, isDisabled }) {
    const max = '2200-12-31';
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const min = moment(tomorrow).format('yyyy-MM-DD');

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    moment().locale('vi');
    let { tournamentId } = useParams();
    // let { date } = useParams();
    let navigate = useNavigate();

    const schema = Yup.object().shape({
        date: Yup.date()
            .nullable()
            .required('Vui lòng không để trống trường này')
            .min(min, 'Vui lòng không nhập ngày trong quá khứ')
            .max(max, 'Vui lòng không nhập ngày với số năm quá lớn')
            .typeError('Vui lòng nhập đúng định dạng ngày DD/mm/yyyy'),
        startTime: Yup.date()
            .nullable()
            .required('Vui lòng không để trống trường này')
            .typeError('Vui lòng nhập đúng định dạng thời gian HH:mm'),
        finishTime: Yup.date()
            // .min(Yup.ref('startTime'), ({ min }) => `Thời gian kết thúc không được sớm hơn thời gian bắt đầu`)
            .typeError('Vui lòng nhập đúng định dạng thời gian HH:mm')
            .test('deadline_test', 'Thời gian kết thúc không được sớm hơn thời gian bắt đầu', function (value) {
                const { startTime } = this.parent;
                return value.getTime() >= startTime.getTime();
            })
            .required('Vui lòng không để trống trường này'),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const onSubmit = (data) => {
        const dataFormat = {
            date: moment(new Date(data.date)).format('yyyy-MM-DD'),
            startTime: moment(new Date(data.startTime)).format('HH:mm:ss'),
            finishTime: moment(new Date(data.finishTime)).format('HH:mm:ss'),
        };
        // trainingScheduleApi.createSession(dataFormat).then((res) => {
        //     console.log('1', res);
        //     console.log('2', res.data);
        //     if (res.data.length != 0) {
        //         enqueueSnackbar(res.message, { variant: 'success' });
        //         onSucess && onSucess(true);
        //         handleClose();
        //     } else {
        //         console.log('huhu');
        //         enqueueSnackbar(res.message, { variant: 'error' });
        //     }
        // });
        adminTournament.createTournamentSession(tournamentId, dataFormat).then((res) => {
            if (res.data.length != 0) {
                let variant = 'success';
                enqueueSnackbar(res.message, { variant });
                onSucess && onSucess(true);
                handleClose();
            } else {
                let variant = 'error';
                enqueueSnackbar(res.message, { variant });
                handleClose();
            }
        });
        console.log('form submit', dataFormat);
    };

    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth="xs"
                // keepMounted
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    {isDisabled}
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={
                            {
                                // '& .MuiTextField-root': { mt: 0 },
                            }
                        }
                    >
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                            <Grid container spacing={1} columns={12}>
                                <Grid item xs={12} sm={12}>
                                    <Controller
                                        required
                                        name="date"
                                        control={control}
                                        defaultValue={date ? date : null}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <DatePicker
                                                disablePast
                                                disabled={isDisabled}
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
                                <Grid item xs={12} sm={12}>
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
                                <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
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
                        {/* <p style={{ textAlign: 'center', color: 'red' }}>
                            Đéo thành công, đã có lịch tập trong ngày này!
                        </p> */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Hủy bỏ
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default AddSession;
