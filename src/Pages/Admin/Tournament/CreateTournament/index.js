import React, { Fragment, useState } from 'react';
import {
    Box,
    Button,
    Collapse,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    InputAdornment,
    Paper,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import { Controller, useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import classNames from 'classnames/bind';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';

import styles from './CreateTournament.module.scss';
import FightingCompetition from './FightingCompetition';
import PerformanceCompetition from './PerformanceCompetition';
import PreviewData from './PreviewData';
import adminTournamentAPI from 'src/api/adminTournamentAPI';

const cx = classNames.bind(styles);

function CreateTourament() {
    const [datasFightingCompetition, setDataFightingCompetition] = useState([]);
    const [datasPerformanceCompetition, setDataPerformanceCompetition] = useState([]);
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState();
    const [submitData, setSubmitData] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [isOverride, setIsOverride] = useState(-1);
    const [description, setDescription] = useState('');
    const [touramentId, setTouramentId] = useState();
    const [tourament, setTourament] = useState([]);
    const [previewTournament, setPreviewTournament] = useState([]);
    const [previewData, setPreviewData] = useState({});
    const [checked, setChecked] = useState(false);
    const [disabled, setDisabled] = useState(false);

    let navigator = useNavigate();

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
            .max(Yup.ref('startDate'), ({ min }) => `Hạn đăng kí không được để sau ngày bắt đầu`)
            .typeError('Vui lòng không để trống trường này'),
        datePlayerDeadline: Yup.date()
            .max(Yup.ref('startDate'), ({ min }) => `Hạn đăng kí không được để sau ngày bắt đầu`)
            .typeError('Vui lòng không để trống trường này'),
        cost: Yup.string().required('Không được để trống trường này'),
        numOfOrganizingCommitee: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        numOfParticipants: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),

        feePlayerPay: Yup.number().required('Không được để trống trường này').typeError('Vui lòng nhập số'),
        feeOrganizingCommiteePay: Yup.number().required('Không được để trống trường này').typeError('Vui lòng nhập số'),
    });

    const handleClose = () => {
        adminTournamentAPI.deleteTournament(touramentId).then((res) => {
            console.log('delete tournamen id: ', touramentId);
            console.log('delete tournament, response: ', res.data);

            if (res.data.length != 0) {
                navigator(-1);
            } else {
                console.log('huhu');
            }
        });
        setOpen(false);
        setDisabled(false);
    };

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

    const handleCreate = () => {
        adminTournamentAPI.createTournamentSchedule(previewTournament, touramentId).then((res) => {
            console.log('create tournament schedule', res);
            console.log('create tournament schedule', res.data);

            if (res.data.length != 0) {
                navigator(-1);
            } else {
                console.log('huhu');
            }
        });
        setDisabled(false);
    };
    const createTourament = async (data) => {
        const params = {
            name: data.tournamentName,
            description: data.description,
            competitiveTypes: datasFightingCompetition,
            exhibitionTypes: datasPerformanceCompetition,
            maxQuantityComitee: data.numOfOrganizingCommitee,
            feeOrganizingCommiteePay: data.feeOrganizingCommiteePay,
            registrationOrganizingCommitteeDeadline: data.dateCommitteeDeadline,
            registrationPlayerDeadline: data.datePlayerDeadline,
            feePlayerPay: data.feePlayerPay,
            totalAmountEstimate: data.cost,
            totalAmountFromClubEstimate: data.totalAmountFromClubEstimate > 0 ? data.totalAmountFromClubEstimate : 0,
        };
        console.log(params);
        await adminTournamentAPI.createTournament(params).then((response) => {
            console.log('create event', response);
            console.log('create event', response.data);
            console.log('create event id', response.data[0].id);
            setTouramentId(response.data[0].id);
            setTourament(response.data);
        });
    };
    const onSubmit = (data) => {
        console.log(data);
        let dataSubmit = {
            finishTime: moment(new Date(2022, 5, 21, 20, 0, 0)).format('HH:mm:ss'),
            startTime: moment(new Date(2022, 5, 20, 8, 0, 0)).format('HH:mm:ss'),
            startDate: moment(new Date(data.startDate)).format('DD/MM/yyyy'),
            finishDate: moment(new Date(data.finishDate)).format('DD/MM/yyyy'),
            cost: data.cost,
            tournamentName: data.tournamentName,
            description: data.description,
            feeOrganizingCommiteePay: data.feeOrganizingCommiteePay,
            feePlayerPay: data.feePlayerPay,
            numOfOrganizingCommitee: data.numOfOrganizingCommitee,
            numOfParticipants: data.numOfParticipants,
            totalAmountFromClubEstimate:
                data.cost -
                (data.numOfOrganizingCommitee * data.feeOrganizingCommiteePay +
                    data.numOfParticipants * data.feePlayerPay),
        };
        console.log(dataSubmit);
        setSubmitData(dataSubmit);
        createTourament(dataSubmit);
        adminTournamentAPI.createPreviewTournamentSchedule(dataSubmit).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data.length != 0) {
                console.log(res.data);
                setPreviewData(dataSubmit);
                setPreviewTournament(res.data);
                checkOveride(res.data);
                setOpen(true);
            } else {
                console.log('huhu');
            }
        });
        setOpen(false);
    };

    const TournamentSchedule = previewTournament.map((item, index) => {
        const container = {};
        container['id'] = index;
        container['date'] = item.date;
        container['title'] = item.title + '-' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        console.log(isOverride);
        container['backgroundColor'] = isOverride === -1 || isOverride === 0 ? '#5ba8f5' : '#ff3d00';
        //container['isOverride'] = item.title.contain('Trùng với') ? true : false;
        return container;
    });

    console.log(TournamentSchedule);

    const checkOveride = (TournamentSchedule) => {
        TournamentSchedule.map((item) => {
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

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    return (
        <Paper elevation={3}>
            <Container maxWidth="lg" sx={{ pb: 2, pt: 1 }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 5 }}>
                    Tạo giải đấu
                </Typography>
                <Dialog fullWidth maxWidth="lg" open={open}>
                    <DialogTitle>Xem trước thông tin giải đấu</DialogTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <DialogContent sx={{ height: '500px' }}>
                                <FullCalendar
                                    locale="vie"
                                    height="100%"
                                    plugins={[dayGridPlugin, interactionPlugin]}
                                    initialView="dayGridMonth"
                                    events={TournamentSchedule}
                                    weekends={true}
                                    headerToolbar={{
                                        left: 'title',
                                        center: '',
                                        right: 'prev next today',
                                    }}
                                />
                                {(isOverride === 0 || isOverride === 2) && (
                                    <FormControlLabel
                                        sx={{ marginLeft: '1px' }}
                                        control={
                                            <Switch
                                                hidden={isOverride === 1}
                                                checked={checked}
                                                onChange={handleChangeOverride}
                                            />
                                        }
                                        label="Lịch đang trùng với lịch tập, bạn có muốn tạo không"
                                    />
                                )}
                            </DialogContent>
                        </Grid>
                        {previewData && (
                            <Grid item xs={4}>
                                <PreviewData data={previewData} />
                            </Grid>
                        )}
                    </Grid>

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
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={7}>
                            <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="h6">
                                Thông tin giải đấu
                            </Typography>
                            <TextField
                                id="outlined-basic"
                                label="Tên giải đấu"
                                variant="outlined"
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
                                multiline
                                maxRows={4}
                                value={description}
                                {...register('description')}
                                error={errors.description ? true : false}
                                helperText={errors.description?.message}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                // {...register('content')}
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                <Grid container columns={12} spacing={2}>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="startDate"
                                            control={control}
                                            defaultValue={null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DatePicker
                                                    label="Ngày bắt đầu"
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
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="finishDate"
                                            inputFormat="dd/MM/yyyy"
                                            control={control}
                                            defaultValue={null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DatePicker
                                                    label="Ngày kết thúc"
                                                    minDate={startDate}
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
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="datePlayerDeadline"
                                            control={control}
                                            defaultValue={null}
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
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="dateCommitteeDeadline"
                                            inputFormat="dd/MM/yyyy"
                                            control={control}
                                            defaultValue={null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DatePicker
                                                    label="Hạn đăng kí tham gia ban tổ chức"
                                                    minDate={startDate}
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
                                </Grid>
                            </LocalizationProvider>
                            <Controller
                                name="cost"
                                variant="outlined"
                                defaultValue=""
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <NumberFormat
                                        name="cost"
                                        customInput={TextField}
                                        label="Tổng chi phí tổ chức"
                                        thousandSeparator={true}
                                        variant="outlined"
                                        defaultValue=""
                                        value={value}
                                        onValueChange={(v) => {
                                            onChange(Number(v.value));
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
                                        }}
                                        error={invalid}
                                        helperText={invalid ? error.message : null}
                                        fullWidth
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
                                        {...register('numOfOrganizingCommitee')}
                                        error={errors.numOfOrganizingCommitee ? true : false}
                                        helperText={errors.numOfOrganizingCommitee?.message}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="feeOrganizingCommiteePay"
                                        variant="outlined"
                                        defaultValue=""
                                        control={control}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <NumberFormat
                                                name="feeOrganizingCommiteePay"
                                                customInput={TextField}
                                                label="Phí tham gia ban tổ chức"
                                                thousandSeparator={true}
                                                onValueChange={(v) => {
                                                    onChange(Number(v.value));
                                                }}
                                                variant="outlined"
                                                defaultValue=""
                                                value={value}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
                                                }}
                                                error={invalid}
                                                helperText={invalid ? error.message : null}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                                <Grid item xs={6}>
                                    <TextField
                                        type="number"
                                        id="outlined-basic"
                                        label="Số người dự kiến tham gia thi đấu"
                                        variant="outlined"
                                        fullWidth
                                        {...register('numOfParticipants')}
                                        error={errors.numOfParticipants ? true : false}
                                        helperText={errors.numOfParticipants?.message}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="feePlayerPay"
                                        variant="outlined"
                                        defaultValue=""
                                        control={control}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <NumberFormat
                                                name="feePlayerPay"
                                                customInput={TextField}
                                                label="Phí tham gia thi đấu"
                                                thousandSeparator={true}
                                                onValueChange={(v) => {
                                                    onChange(Number(v.value));
                                                }}
                                                variant="outlined"
                                                defaultValue=""
                                                value={value}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
                                                }}
                                                error={invalid}
                                                helperText={invalid ? error.message : null}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="h6">
                                Nội dung thi đấu
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                        Thi đấu đối kháng
                                    </Typography>
                                    <FightingCompetition
                                        onAddFightingCompetition={AddFightingCompetitionHandler}
                                        data={datasFightingCompetition}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                                        Thi đấu biểu diễn
                                    </Typography>
                                    <PerformanceCompetition
                                        onAddPerformanceCompetition={PerformanceCompetitionHandler}
                                        data={datasPerformanceCompetition}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={cx('create-event-button')}>
                                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                                    Tạo giải đấu
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Paper>
    );
}

export default CreateTourament;
