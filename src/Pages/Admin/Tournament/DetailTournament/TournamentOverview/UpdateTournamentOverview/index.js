import React, { Fragment, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';

import UpdatePerformanceCompetition from './UpdatePerformanceCompetition';
import adminTournament from 'src/api/adminTournamentAPI';
import UpdateFightingCompetition from './UpdateFightingCompetition';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import moment from 'moment';

function UpdateTournamentOverview({ title, isOpen, data, handleClose, onSuccess, startTime }) {
    console.log(data);
    const { enqueueSnackbar } = useSnackbar();
    const [datasFightingCompetition, setDataFightingCompetition] = useState(data.competitiveTypes);
    const [datasPerformanceCompetition, setDataPerformanceCompetition] = useState(data.exhibitionTypes);
    const { tournamentId } = useParams();

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
        dateCommitteeDeadline: Yup.date()
            .max(startTime, ({ min }) => `Hạn đăng kí không được để sau ngày bắt đầu ${startTime}`)
            .typeError('Vui lòng không để trống trường này'),
        datePlayerDeadline: Yup.date()
            .max(startTime, ({ min }) => `Hạn đăng kí không được để sau ngày bắt đầu ${startTime}`)
            .typeError('Vui lòng không để trống trường này'),
    });

    const onUpdateTournament = (data) => {
        console.log(data);
        let dataSubmit = {
            competitiveTypesDto: datasFightingCompetition,
            exhibitionTypesDto: datasPerformanceCompetition,
            name: data.tournamentName,
            description: data.description,
            registrationOrganizingCommitteeDeadline: moment(data.dateCommitteeDeadline).format('YYYY-MM-DDTHH:mm:ss'),
            registrationPlayerDeadline: moment(data.datePlayerDeadline).format('YYYY-MM-DDTHH:mm:ss'),
        };
        adminTournament.updateTournament(dataSubmit, tournamentId).then((res) => {
            if (res.data.length != 0) {
                let variant = 'success';
                enqueueSnackbar(res.message, { variant });
                onSuccess && onSuccess(res.data[0]);
            } else {
                let variant = 'error';
                enqueueSnackbar(res.message, { variant });
            }
        });
        handleClose && handleClose();
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
            {data && (
                <Dialog
                    fullWidth
                    maxWidth="md"
                    // keepMounted
                    open={!!isOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText id="alert-dialog-description">{facilityId}</DialogContentText> */}
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
                            <Grid container columns={12} sx={{ mt: 2 }} spacing={3}>
                                <Grid item xs={7}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Tên giải đấu"
                                        variant="outlined"
                                        defaultValue={data.name}
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
                                        defaultValue={data.description}
                                        multiline
                                        rows={4}
                                        // value={description}
                                        fullWidth
                                        {...register('description')}
                                        error={errors.description ? true : false}
                                        helperText={errors.description?.message}
                                    />
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
                                </Grid>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                    <Grid item xs={5}>
                                        <Controller
                                            required
                                            name="datePlayerDeadline"
                                            control={control}
                                            defaultValue={data.registrationPlayerDeadline}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DatePicker
                                                    label="Hạn đăng kí cho người chơi"
                                                    inputFormat="dd/MM/yyyy"
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
                                            name="dateCommitteeDeadline"
                                            inputFormat="dd/MM/yyyy"
                                            control={control}
                                            defaultValue={data.registrationOrganizingCommitteeDeadline}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DatePicker
                                                    label="Hạn đăng kí tham gia ban tổ chức"
                                                    // minDate={startTime}
                                                    disablePast
                                                    ampm={false}
                                                    inputFormat="dd/MM/yyyy"
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
                                </LocalizationProvider>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button variant="contained" onClick={handleSubmit(onUpdateTournament)}>
                            Cập nhật thông tin
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Fragment>
    );
}

export default UpdateTournamentOverview;
