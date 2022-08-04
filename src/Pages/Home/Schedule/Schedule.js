import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Square } from '@mui/icons-material';
import trainingSchedule from 'src/api/trainingScheduleApi';
import styles from './Schedule.module.scss';
import { Box, Button, FormControl, MenuItem, Paper, Select, Tooltip, Typography } from '@mui/material';
import userApi from 'src/api/userApi';
import styled from '@emotion/styled';
import ReactDOM from 'react-dom';
import LoadingProgress from 'src/Components/LoadingProgress';

const cx = classNames.bind(styles);

export const StyleWrapper = styled.div`
    .fc-event-past {
        background-color: none !important;
    }
    // .fc-event::after {
    //     content: 'hahaah';
    // }
`;
function Schedule() {
    const nowDate = new Date();
    const [type, setType] = useState(-1);
    const [commonList, setCommonList] = useState([]);
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });
    const [calendarView, setCalendarView] = useState('dayGridWeek');
    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;

    const handleChange = (event) => {
        setType(event.target.value);
        console.log(event.target.value);
        fetchCommonScheduleBySemester(event.target.value);
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
        container['status'] = item.status;

        // 0 la vang, 1 la co mat, 2 chua diem danh
        container['backgroundColor'] = item.status === 0 ? '#fc6262' : item.status === 1 ? '#56f000' : '#fff';

        return container;
    });

    // if (!commonList.length) {
    //     return <LoadingProgress />;
    // }
    const renderEventContent = (eventInfo) => {
        // console.log(eventInfo);
        return (
            <Tooltip title={eventInfo.event.title + ' ' + eventInfo.event.extendedProps.time} placement="top">
                {calendarView === 'dayGridWeek' ? (
                    <Box sx={{ backgroundColor: '#fff', height: '100%' }}>
                        <Box sx={{ ml: 0.5 }} className={cx('tooltip')}>
                            {/* <p className={cx('tooltiptext')}>
     
 </p> */}
                            {/* <b>{eventInfo.timeText}</b> */}
                            <div className={cx('event-title')}>
                                {eventInfo.event.title} <br />
                                {eventInfo.event.extendedProps.time}
                            </div>

                            {eventInfo.event.extendedProps.status === 0 ? (
                                <div className={cx('absent')}>Vắng mặt</div>
                            ) : eventInfo.event.extendedProps.status === 1 ? (
                                <div className={cx('attend')}>Có mặt</div>
                            ) : (
                                <div className={cx('not-yet')}>Not yet</div>
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ ml: 0.5 }} className={cx('tooltip')}>
                            {/* <p className={cx('tooltiptext')}>

</p> */}
                            {/* <b>{eventInfo.timeText}</b> */}
                            <div className={cx('event-title')}>
                                {eventInfo.event.title} <br />
                                {eventInfo.event.extendedProps.time}
                            </div>
                        </Box>
                    </Box>
                )}
            </Tooltip>
        );
    };

    return (
        <StyleWrapper>
            <Paper sx={{ padding: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex' }}>
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
                            {/* <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Square sx={{ color: '#BBBBBB', mr: 0.5 }} />
                        <span>Lịch trong quá khứ</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Square sx={{ color: '#5BA8F5', mr: 0.5 }} />
                        <span>Tập luyện</span>
                    </Box> */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <Square sx={{ color: '#fc6262', mr: 0.5 }} />
                                <span>Vắng mặt</span>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <Square sx={{ color: '#56f000', mr: 0.5 }} />
                                <span>Có mặt</span>
                            </Box>
                        </Box>
                    ) : null}
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
                                    // eventMouseEnter={(infor) => {
                                    //     console.log('hover', infor);
                                    // }}
                                    // eventMouseLeave={(infor) => {
                                    //     console.log('leave', infor);
                                    // }}
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
