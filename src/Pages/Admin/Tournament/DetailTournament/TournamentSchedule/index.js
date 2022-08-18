import React, { useEffect, useRef, useState } from 'react';
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
    Tooltip,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Cancel, Delete, Edit } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import moment from 'moment';
import classNames from 'classnames/bind';

import adminTournament from 'src/api/adminTournamentAPI';
import styles from 'src/Pages/Admin/TrainingSchedule/TrainingSchedule.module.scss';
import styled from '@emotion/styled';
import trainingScheduleApi from 'src/api/trainingScheduleApi';
import AddSession from './addSession';
import EditSession from './editSession';

const cx = classNames.bind(styles);

export const CustomTrainingSchedule = styled.div`
    .fc-day-future {
        transition: 0.2s;
        cursor: ;
    }
    .fc-day-past {
        transition: 0.2s;
        cursor: default;
    }
    .fc-event {
        cursor: pointer;
    }
    .fc-day-future:hover:after {
        content: 'Tạo lịch';
        position: absolute;
        margin-top: -8vh;
        margin-left: 6px;
        font-weight: bold;
        font-size: 0.8rem;
        // bottom: 50%;
        // left: 50%;
    }
    .fc-day-future:hover {
        background-color: #d0e6fb !important;
    }
    .fc-day-today a {
        background-color: white;
        // color: red !important;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        margin: 7px;

        // text-align: center;
        font-weight: bold;
    }
    .fc-daygrid-day-number {
        margin: 7px;
    }
    .fc td,
    .fc th {
        // border-style: none !important;
        border: 1.25px solid #c4cfd9 !important;
    }
    background-color: #fff;
    padding: 12px;
    height: 80vh;
    width: 70%;
`;

function TournamentSchedule({ isUpdate, tournamentStage }) {
    const calendarComponentRef = useRef(null);
    const nowDate = new Date();
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [scheduleList, setScheduleList] = useState([]);
    const [scheduleUpdate, setScheduleUpdate] = useState({});
    const [open, setOpen] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [update, setUpdate] = useState(false);
    const [commonList, setCommonList] = useState([]);
    const [isOpenAddSessionDialog, setIsOpenAddSessionDialog] = useState(false);
    const [isOpenEditSessionDialog, setIsOpenEditSessionDialog] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });
    const [isRender, setIsRender] = useState(true);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const goToSemester = (date) => {
        let calApi = calendarComponentRef.current.getApi();
        calApi.gotoDate(date);
    };

    const fetchTournamentSchedule = async (params) => {
        try {
            const response = await adminTournament.getTournamentSchedule(params);
            console.log(response.data);
            const newSchedule = response.data.map((schedule) => {
                return { id: schedule.id, title: schedule.tournament.name, type: 3, ...schedule };
            });
            setScheduleList(newSchedule);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };

    const fetchCommonScheduleBySemester = async () => {
        try {
            const response = await trainingScheduleApi.commonSchedule();
            console.log('Thanh cong roi: ', response);
            setCommonList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };

    useEffect(() => {
        fetchTournamentSchedule(tournamentId);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [tournamentId]);

    useEffect(() => {
        fetchCommonScheduleBySemester();
        setUpdate(false);
    }, [update]);

    useEffect(() => {
        isRender && fetchTournamentSchedule(tournamentId);
        isRender && fetchCommonScheduleBySemester();
        setIsRender(false);
    }, [scheduleList, commonList, isRender, tournamentId]);

    const totalSchedule =
        commonList.length > 0 &&
        scheduleList.length > 0 &&
        commonList.map((common) =>
            scheduleList.find((tourament) => tourament.date == common.date)
                ? scheduleList.find((tourament) => tourament.date == common.date)
                : common,
        );

    const scheduleData =
        totalSchedule &&
        totalSchedule.map((item) => {
            const container = {};
            container['id'] = item.id;
            container['date'] = item.date;
            container['title'] = item.title;
            container['time'] = item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
            container['display'] = 'background';
            // container['backgroundColor'] = '#5ba8f5';
            container['type'] = item.type;
            container['backgroundColor'] = item.type === 3 ? '#9fccf9' : item.type === 1 ? '#edf2fc' : '#edf2fc';
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
        startTime: Yup.string().nullable().required('Không để để trống trường này'),
        // .matches(/^([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/, 'Vui lòng nhập đúng định dạng thời gian HH:mm:ss'),
        finishTime: Yup.string().nullable().required('Không để để trống trường này'),
        // .matches(/^([01]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/, 'Vui lòng nhập đúng định dạng thời gian HH:mm:ss'),
    });

    const handleDelete = (id) => {
        adminTournament.deleteTournamentSession(id).then((res) => {
            if (res.data.length != 0) {
                const newScheduleList = totalSchedule.filter((date) => date.id !== id);
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
        const newData = {
            finishTime: moment(new Date(data.finishTime)).format('HH:mm:ss'),
            startTime: moment(new Date(data.startTime)).format('HH:mm:ss'),
            date: scheduleUpdate.date,
        };
        console.log(newData);
        if (scheduleUpdate.params) {
            adminTournament.updateTournamentSession(scheduleUpdate.params.id, newData).then((res) => {
                if (res.data.length != 0) {
                    const newScheduleList = totalSchedule.map((date) =>
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
                    const newScheduleList = [...totalSchedule, res.data[0]];
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
        setScheduleUpdate();
        reset({
            startTime: '',
            finishTime: '',
        });
    };

    const navigateToUpdate = (params, date) => {
        if (isUpdate || tournamentStage != 0) {
            return;
        }
        console.log(params);
        const filterEventClicked = totalSchedule.filter((item) => item.date === moment(date).format('YYYY-MM-DD'));
        console.log('filter event clicked', filterEventClicked);
        if (filterEventClicked[0].type !== 3) {
            console.log('ko phai lich tap');
            return;
        }
        console.log(date);
        if (new Date(date) === new Date()) {
            return;
        } else {
            const data = scheduleList.filter((item) => item.date == moment(date).format('YYYY-MM-DD'));
            console.log(scheduleList, data);
            setScheduleUpdate(data);
            setIsOpenEditSessionDialog(true);
        }
    };

    const navigateToCreate = (date) => {
        if (isUpdate || tournamentStage != 0) {
            return;
        }
        console.log(date);
        if (new Date(date) > nowDate) {
            const existSession = totalSchedule.filter((item) => item.date === date).length; //length = 0 (false) is not exist
            if (!existSession) {
                setIsDisabled(true);
                setScheduleUpdate(date);
                setIsOpenAddSessionDialog(true);
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

    const renderEventContent = (eventInfo) => {
        let eventDate = new Date(eventInfo.event.start);
        let current = new Date();

        return (
            <Tooltip
                title={
                    // eventInfo.event.extendedProps.type === 0
                    //     ? eventInfo.event.title + ' ' + eventInfo.event.extendedProps.time
                    //     : 'Không thể tạo lịch tập (trùng hoạt động khác)'
                    // eventDate < current ? 'Xem thông tin điểm danh' : 'Cập nhật thời gian'?eventInfo.event.extendedProps.type === 0?'Không thể tạo lịch tập (trùng hoạt động khác)':''
                    !isUpdate
                        ? eventInfo.event.extendedProps.type === 3
                            ? eventDate < current
                                ? ''
                                : 'Cập nhật thời gian (' + eventInfo.event.extendedProps.time + ')'
                            : `Không thể tạo lịch (trùng với ${eventInfo.event.title})`
                        : 'Quá thời gian cập nhật'
                }
                placement="top"
            >
                {eventInfo.event.extendedProps.type === 3 ? (
                    <Box>
                        <Box sx={{ ml: '10px' }}>
                            <div className={cx('event-title')}>
                                {eventDate === current ? (
                                    <>
                                        <strong>
                                            {/* {eventInfo.event.title} <br /> */}
                                            {eventInfo.event.extendedProps.time}
                                        </strong>
                                    </>
                                ) : (
                                    <>
                                        {/* {eventInfo.event.title} <br /> */}
                                        {eventInfo.event.extendedProps.time}
                                    </>
                                )}
                            </div>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ ml: '10px' }}>
                            <div className={cx('event-title')} style={{ opacity: 0 }}>
                                {/* {eventInfo.event.title} <br />
                                {eventInfo.event.extendedProps.time} */}
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem cumque voluptatum nihil
                                magni sint cum veritatis voluptas consequuntur delectus, facere magnam quisquam
                                architecto illum officiis ratione, nobis est nesciunt autem!
                            </div>
                        </Box>
                    </Box>
                )}
            </Tooltip>
        );
    };

    return (
        <Box sx={{ mt: 1, mb: 2, display: 'flex', flexDirection: 'column' }}>
            {/* {!isUpdate && (
                <Box component="div" sx={{ mb: 2 }}>
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
                        {isEdit ? '*Để chỉnh sửa, vui lòng chọn 1 ngày trên lịch' : ''}
                    </Typography>
                </Box>
            )} */}

            {isOpenAddSessionDialog && (
                <AddSession
                    title="Tạo lịch mới"
                    isOpen={isOpenAddSessionDialog}
                    handleClose={() => {
                        setIsOpenAddSessionDialog(false);
                        setScheduleUpdate(null);
                    }}
                    date={scheduleUpdate}
                    isDisabled={isDisabled}
                    onSucess={(isUpdate) => {
                        setIsRender(true);
                        setUpdate(isUpdate);
                    }}
                />
            )}
            {isOpenEditSessionDialog && (
                <EditSession
                    title="Cập nhật thời gian"
                    isOpen={isOpenEditSessionDialog}
                    handleClose={() => {
                        setIsOpenEditSessionDialog(false);
                        setScheduleUpdate(null);
                    }}
                    date={scheduleUpdate}
                    onSucess={(isUpdate) => {
                        setIsRender(true);
                        setUpdate(isUpdate);
                    }}
                />
            )}
            {scheduleList[0] && (
                <div className={cx('schedule-container')}>
                    {scheduleList[0] && (
                        <CustomTrainingSchedule>
                            <FullCalendar
                                initialDate={scheduleList[0] && new Date(scheduleList[0].date)}
                                // {...(semester!==2?(initialDate: '2022-10-01'):{})}
                                // initialDate={semester !== 2 ? new Date('2022-10-01') : new Date()}
                                locale="vie"
                                height="100%"
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                eventContent={renderEventContent}
                                events={scheduleData}
                                ref={calendarComponentRef}
                                weekends={true}
                                headerToolbar={{
                                    left: 'title',
                                    center: 'dayGridMonth,dayGridWeek',
                                    right: 'prev next today',
                                    // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                                }}
                                datesSet={(dateInfo) => {
                                    getMonthInCurrentTableView(dateInfo.start);
                                }}
                                eventClick={(args) => {
                                    navigateToUpdate(args.event, args.event.start);
                                    // console.log(args);
                                }}
                                dateClick={function (arg) {
                                    // console.log(arg.dateStr);
                                    navigateToCreate(arg.dateStr);
                                    // swal({
                                    //     title: 'Date',
                                    //     text: arg.dateStr,
                                    //     type: 'success',
                                    // });
                                }}
                            />
                        </CustomTrainingSchedule>
                    )}
                </div>
            )}
        </Box>
    );
}

export default TournamentSchedule;
