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
import { useForm } from 'react-hook-form';

import UpdatePerformanceCompetition from './UpdatePerformanceCompetition';
import adminTournament from 'src/api/adminTournamentAPI';
import UpdateFightingCompetition from './UpdateFightingCompetition';

function UpdateTournamentOverview({ title, isOpen, data, handleClose, onSuccess }) {
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
    });

    const onUpdateTournament = (data) => {
        let dataSubmit = {
            competitiveTypesDto: datasFightingCompetition,
            exhibitionTypesDto: datasPerformanceCompetition,
            name: data.tournamentName,
            description: data.description,
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
