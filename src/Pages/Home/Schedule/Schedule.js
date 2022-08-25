import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Square } from '@mui/icons-material';
import trainingSchedule from 'src/api/trainingScheduleApi';
import styles from './Schedule.module.scss';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Tooltip,
    Typography,
} from '@mui/material';
import userApi from 'src/api/userApi';
import styled from '@emotion/styled';
import ReactDOM from 'react-dom';
import LoadingProgress from 'src/Components/LoadingProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import moment from 'moment';

const cx = classNames.bind(styles);

export const StyleWrapper = styled.div`
    .fc-event-past {
        background-color: #f5f5f5 !important;
    }
    .fc-day-past {
        background-color: #f5f5f5 !important;
    }
    // .fc-event::after {
    //     content: 'hahaah';
    // }
    .fc-day-today a {
        font-weight: bold;
        text-decoration: underline !important;
    }
`;
function Schedule() {
    const nowDate = new Date();
    const [type, setType] = useState(-1);
    const [commonList, setCommonList] = useState([]);
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });
    const [calendarView, setCalendarView] = useState('dayGridWeek');
    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;
    const [selectedEvent, setSelectedEvent] = useState({
        isOpen: false,
        eventName: '',
        eventStartDate: '',
        eventFinishDate: '',
        eventFinishTime: '',
        attendanceStatus: '',
        description: '',
        type: -1,
        time: '',
        id: '',
        eventStartTime: '',
    });

    const handleChange = (event) => {
        setType(event.target.value);
        console.log(event.target.value);
        fetchCommonScheduleBySemester(event.target.value, studentId);
    };

    const getMonthInCurrentTableView = (startDate) => {
        const temp = new Date(startDate);
        temp.setDate(temp.getDate() + 17);
        const currentMonth = temp.getMonth() + 1;
        const currentYear = temp.getFullYear();
        setMonthAndYear({ month: currentMonth, year: currentYear });
        console.log(currentMonth, currentYear);
    };
    const fetchCommonScheduleBySemester = async (type, studentId) => {
        try {
            const response = await userApi.getAllAttendanceStatus(studentId);
            console.log('Thanh cong roi: ', response);
            if (type === -1) {
                setCommonList(response.data);
            } else {
                const schedules = response.data.filter((schedule) => schedule.type === type);
                setCommonList(schedules);
            }
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };
    useEffect(() => {
        fetchCommonScheduleBySemester(type, studentId);
    }, [type]);

    const scheduleData = commonList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.title;
        container['time'] = item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['description'] = item.title + ' ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['type'] = item.type;
        container['description'] = item.description;

        container['startTimeEvent'] = item.startTimeEvent;
        container['endTimeEvent'] = item.endTimeEvent;
        container['startDateEvent'] = item.startDateEvent;
        container['endDateEvent'] = item.endDateEvent;
        container['endTimeEvent'] = item.endTimeEvent;
        container['startDate'] = item.date;
        container['status'] = item.status;

        // 0 la vang, 1 la co mat, 2 chua diem danh
        container['backgroundColor'] = item.status === 0 ? '#fc8282' : item.status === 1 ? '#56f000' : '#fff0';

        return container;
    });

    // if (!commonList.length) {
    //     return <LoadingProgress />;
    // }
    const renderEventContent = (eventInfo) => {
        console.log(eventInfo);
        return (
            <Tooltip title={eventInfo.event.title + ' ' + eventInfo.event.extendedProps.time} placement="top">
                {calendarView === 'dayGridWeek' ? (
                    <Box sx={{ height: '100%' }}>
                        <Box sx={{ ml: 0.5 }} className={cx('tooltip')}>
                            {/* <p className={cx('tooltiptext')}>
     
 </p> */}
                            {/* <b>{eventInfo.timeText}</b> */}
                            <div className={cx('event-title')}>
                                {eventInfo.event.title} <br />
                                {eventInfo.event.extendedProps.time}
                            </div>

                            {eventInfo.event.extendedProps.type === 2 ? null : eventInfo.event.extendedProps.status ===
                              0 ? (
                                // <div className={cx('absent')}>Vắng mặt</div>
                                <CancelIcon sx={{ color: '#fc6262' }} />
                            ) : eventInfo.event.extendedProps.status === 1 ? (
                                // <div className={cx('attend')}>Có mặt</div>
                                <CheckCircleIcon sx={{ color: '#56f000' }} />
                            ) : (
                                // <div className={cx('not-yet')}>Chưa điểm danh</div>
                                <PendingIcon sx={{ color: '#1f67ed' }} />
                            )}
                        </Box>
                    </Box>
                ) : (
                    // <Box>
                    //     <Box sx={{ ml: 0.5 }} className={cx('tooltip')}>
                    //         <div className={cx('event-title')}>
                    //             {eventInfo.event.title} <br />
                    //             {eventInfo.event.extendedProps.time}
                    //         </div>
                    //     </Box>
                    // </Box>
                    <Box sx={{ height: '100%' }}>
                        <Box sx={{ ml: 0.5 }} className={cx('tooltip')}>
                            {/* <p className={cx('tooltiptext')}>
 
</p> */}
                            {/* <b>{eventInfo.timeText}</b> */}
                            <div className={cx('event-title')}>
                                {eventInfo.event.title} <br />
                                {eventInfo.event.extendedProps.time}
                            </div>

                            {eventInfo.event.extendedProps.type === 2 ? null : eventInfo.event.extendedProps.status ===
                              0 ? (
                                // <div className={cx('absent')}>Vắng mặt</div>
                                <CancelIcon sx={{ color: '#fc6262' }} />
                            ) : eventInfo.event.extendedProps.status === 1 ? (
                                // <div className={cx('attend')}>Có mặt</div>
                                <CheckCircleIcon sx={{ color: '#56f000' }} />
                            ) : (
                                // <div className={cx('not-yet')}>Chưa điểm danh</div>
                                <PendingIcon sx={{ color: '#1f67ed' }} />
                            )}
                        </Box>
                    </Box>
                )}
            </Tooltip>
        );
    };

    return (
        <StyleWrapper>
            <Dialog
                open={selectedEvent.isOpen}
                onClose={() => setSelectedEvent({ isOpen: false })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{selectedEvent.eventName}</DialogTitle>
                <DialogContent>
                    {selectedEvent.type == 1 ? (
                        <Box>
                            {selectedEvent.description}
                            <br />
                            {moment(selectedEvent.eventStartDate).format('DD/MM/yyyy') +
                                ' - ' +
                                moment(selectedEvent.eventEndDate).format('DD/MM/yyyy')}
                            <br />
                            {selectedEvent.eventStartTime.slice(0, 5) + ' - ' + selectedEvent.endTimeEvent.slice(0, 5)}
                        </Box>
                    ) : (
                        <Box>
                            {selectedEvent.description}
                            <br />
                            {moment(selectedEvent.date).format('DD/MM/yyyy')}
                            <br />
                            {selectedEvent.time}
                        </Box>
                    )}
                    {selectedEvent.type === 2 ? null : selectedEvent.attendanceStatus === 0 ? (
                        <div className={cx('absent')}>Vắng mặt</div>
                    ) : selectedEvent.attendanceStatus === 1 ? (
                        <div className={cx('attend')}>Có mặt</div>
                    ) : (
                        <div className={cx('not-yet')}>Chưa điểm danh</div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedEvent({ isOpen: false })} autoFocus>
                        Quay lại
                    </Button>
                    {selectedEvent.type == 1 || selectedEvent.type == 2 ? (
                        <Button>
                            <Link to={`/events/${selectedEvent.id}`}>Xem chi tiết</Link>
                        </Button>
                    ) : null}
                </DialogActions>
            </Dialog>
            <Paper sx={{ padding: '20px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                    }}
                >
                    <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: '500', mr: 2 }}>
                            Hoạt động
                        </Typography>
                        <FormControl size="small">
                            <Select
                                id="demo-simple-select"
                                value={type}
                                displayEmpty
                                onChange={handleChange}
                                variant="outlined"
                            >
                                <MenuItem value={-1}>
                                    <em>Tất cả</em>
                                </MenuItem>
                                <MenuItem value={0}>Tập luyện</MenuItem>
                                <MenuItem value={1}>Sự kiện</MenuItem>
                                <MenuItem value={2}>Giải đấu</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {calendarView !== 'dayGridWeek' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <CancelIcon sx={{ color: '#fc6262' }} />
                                <span>Vắng mặt</span>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <CheckCircleIcon sx={{ color: '#56f000' }} />
                                <span>Có mặt</span>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <PendingIcon sx={{ color: '#1f67ed' }} />
                                <span>Chưa điểm danh</span>
                            </Box>
                            {/* <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <Square sx={{ color: '#ededed' }} />
                                <span>Hoạt động trong quá khứ</span>
                            </Box> */}
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <CancelIcon sx={{ color: '#fc6262' }} />
                                <span>Vắng mặt</span>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <CheckCircleIcon sx={{ color: '#56f000' }} />
                                <span>Có mặt</span>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <PendingIcon sx={{ color: '#1f67ed' }} />
                                <span>Chưa điểm danh</span>
                            </Box>
                        </Box>
                    )}
                </Box>
                <div>
                    <div className={cx('schedule-container')}>
                        <div className={cx('schedule-content')}>
                            {scheduleData.length > 0 && (
                                <FullCalendar
                                    locale="vie"
                                    height="100%"
                                    initialView="dayGridWeek"
                                    plugins={[dayGridPlugin, interactionPlugin]}
                                    events={scheduleData}
                                    weekends={true}
                                    eventClick={(args) => {
                                        // navigateToUpdate(args.event.id, args.event.start);
                                        // console.log(args);
                                        // console.log(args.event._def.publicId);
                                        setSelectedEvent({
                                            isOpen: true,
                                            eventName: args.event.title,
                                            attendanceStatus: args.event.extendedProps.status,
                                            eventStartDate: args.event.extendedProps.startDateEvent,
                                            eventEndDate: args.event.extendedProps.endDateEvent,
                                            eventStartTime: args.event.extendedProps.startTimeEvent,
                                            endTimeEvent: args.event.extendedProps.endTimeEvent,
                                            description: args.event.extendedProps.description,
                                            time: args.event.extendedProps.time,
                                            id: args.event._def.publicId,
                                            type: args.event.extendedProps.type,
                                            date: args.event.start,
                                        });
                                    }}
                                    eventContent={renderEventContent}
                                    headerToolbar={{
                                        left: 'title',
                                        center: 'dayGridMonth,dayGridWeek',
                                        right: 'prev next today',
                                    }}
                                    datesSet={(dateInfo) => {
                                        console.log(dateInfo.view.type);
                                        setCalendarView(dateInfo.view.type);
                                        getMonthInCurrentTableView(dateInfo.start);
                                    }}
                                />
                            )}
                        </div>
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button>
                                <Link to="/report/attendance">Xem báo cáo điểm danh</Link>
                            </Button>
                        </Box>
                    </div>
                </div>
            </Paper>
        </StyleWrapper>
    );
}

export default Schedule;
