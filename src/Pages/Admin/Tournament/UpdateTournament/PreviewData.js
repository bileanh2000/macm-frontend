import React from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function PreviewData({ data }) {
    const validationSchema = Yup.object().shape({
        startTime: Yup.string().nullable().required('Điền đi'),
        finishTime: Yup.string().nullable().required('Điền đi'),
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

    const handleUpdate = (data) => {
        console.log('change date: ', data);
        // adminTournament.updateTournamentSession(previewTournament, tournamentId).then((res) => {
        //     console.log('create tournament schedule', res);
        //     console.log('create tournament schedule', res.data);
        //     if (res.data.length != 0) {
        //         navigator(-1);
        //     } else {
        //         console.log('huhu');
        //     }
        // });
        // setDisabled(false);
        ///
        // adminTournament.updateEventSchedule(id, previewData).then((response) => {
        //     console.log('update event', response);
        //     console.log('update event', response.data);
        //     if (response.data.length != 0) {
        //         // setOpenSnackBar(true);
        //         // setSnackBarStatus(true);
        //         // snackBarStatus = true;
        //         // dynamicAlert(snackBarStatus, res.message);
        //         navigate(`/admin/events/${id}`);
        //     } else {
        //         console.log('huhu');
        //         // setOpenSnackBar(true);
        //         // setSnackBarStatus(false);
        //         // snackBarStatus = false;
        //         // dynamicAlert(snackBarStatus, res.message);
        //     }
        // });
        // adminTournament.updateTournament(adminTournament, tournamentId).then((res) => {
        //     console.log('1', res);
        //     console.log('2', res.data);
        //     if (res.data.length !== 0) {
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
    };
    const handleClose = () => {
        // adminTournament.deleteTournament(tournamentId).then((res) => {
        //     console.log('delete tournamen id: ', tournamentId);
        //     console.log('delete tournament, response: ', res.data);
        //     if (res.data.length != 0) {
        //         navigator(-1);
        //     } else {
        //         console.log('huhu');
        //     }
        // // });
        // setOpen(false);
        // setScheduleUpdate({});
        // setDisabled(false);
    };

    return (
        <Box component="div">
            <Grid container spacing={1} columns={12}>
                <Grid item sm={4}>
                    <TextField
                        disabled
                        id="outlined-disabled"
                        label="Ngày tháng"
                        defaultValue={data.date}
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
                        defaultValue={data.params ? data.params.startTime : ''}
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
                        defaultValue={data.params ? data.params.finishTime : ''}
                        fullWidth
                        {...register('finishTime')}
                        error={errors.finishTime ? true : false}
                        helperText={errors.finishTime?.message}
                    />
                </Grid>
            </Grid>
            <Button onClick={handleClose}>Quay lại</Button>
            <Button onClick={handleSubmit(handleUpdate)}>Đồng ý</Button>
        </Box>
    );
}

export default PreviewData;
