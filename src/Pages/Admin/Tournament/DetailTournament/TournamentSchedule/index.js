import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Cancel, Delete, Edit } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import adminTournament from 'src/api/adminTournamentAPI';

function TournamentSchedule() {
    const nowDate = new Date();
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [scheduleList, setScheduleList] = useState([]);
    const [scheduleUpdate, setScheduleUpdate] = useState({});
    const [open, setOpen] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });

    const fetchTournamentSchedule = async (params) => {
        try {
            const response = await adminTournament.getTournamentSchedule(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };

    useEffect(() => {
        fetchTournamentSchedule(tournamentId);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [tournamentId]);

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

    const getMonthInCurrentTableView = (startDate) => {
        if (!isEdit) {
            return;
        }
        const temp = new Date(startDate);
        temp.setDate(temp.getDate() + 17);
        const currentMonth = temp.getMonth() + 1;
        const currentYear = temp.getFullYear();
        setMonthAndYear({ month: currentMonth, year: currentYear });
    };

    const validationSchema = Yup.object().shape({
        startTime: Yup.string()
            .nullable()
            .required('Không để để trống trường này')
            .matches(/^([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/, 'Vui lòng nhập đúng định dạng thời gian HH:mm:ss'),
        finishTime: Yup.string()
            .nullable()
            .required('Không để để trống trường này')
            .matches(/^([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/, 'Vui lòng nhập đúng định dạng thời gian HH:mm:ss'),
    });

    const handleDelete = (id) => {
        adminTournament.deleteTournamentSession(id).then((res) => {
            if (res.data.length != 0) {
                const newScheduleList = scheduleList.filter((date) => date.id !== id);
                setScheduleList(newScheduleList);
                let variant = 'success';
                enqueueSnackbar(res.message, { variant });
                handleClose();
            } else {
                let variant = 'error';
                enqueueSnackbar(res.message, { variant });
                handleClose();
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
                    let variant = 'success';
                    enqueueSnackbar(res.message, { variant });
                    handleClose();
                } else {
                    let variant = 'error';
                    enqueueSnackbar(res.message, { variant });
                    handleClose();
                }
            });
        } else {
            adminTournament.createTournamentSession(tournamentId, newData).then((res) => {
                if (res.data.length != 0) {
                    const newScheduleList = [...scheduleList, res.data[0]];
                    setScheduleList(newScheduleList);
                    let variant = 'success';
                    enqueueSnackbar(res.message, { variant });
                    handleClose();
                } else {
                    let variant = 'error';
                    enqueueSnackbar(res.message, { variant });
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

    const navigateToUpdate = (params, date, day) => {
        if (!isEdit) {
            return;
        }
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
        if (!isEdit) {
            return;
        }
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
        <Box sx={{ mt: 2, mb: 2, p: 1, height: '30rem' }}>
            <Box component="div">
                <Button
                    variant="outlined"
                    component="div"
                    startIcon={!isEdit ? <Edit /> : <Cancel />}
                    sx={{ float: 'right' }}
                    onClick={() => setEdit((prev) => !prev)}
                >
                    {isEdit ? 'Hủy' : 'Chỉnh sửa lịch'}
                </Button>
                <Typography variant="caption">
                    {isEdit ? 'Để chỉnh sửa, vui lòng chọn 1 ngày trên lịch' : ''}
                </Typography>
            </Box>

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
                                        startIcon={<Delete />}
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
                        <Grid container spacing={1} columns={12}>
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
                                    defaultValue={scheduleUpdate.params ? scheduleUpdate.params.startTime : ''}
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
                                    defaultValue={scheduleUpdate.params ? scheduleUpdate.params.finishTime : ''}
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
                        <Button onClick={handleSubmit(handleUpdate)}>Đồng ý</Button>
                    </DialogActions>
                </Dialog>
            )}
            <FullCalendar
                // initialDate={new Date('2022-09-01')}
                initialDate={scheduleData[0] && new Date(scheduleData[0].date)}
                locale="vie"
                height="100%"
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
        </Box>
    );
}

export default TournamentSchedule;
