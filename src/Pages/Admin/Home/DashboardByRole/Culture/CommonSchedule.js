import { Box, Button, MenuItem, TextField, Tooltip, Typography } from '@mui/material';
import { createRef, Fragment, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styles from './TrainingSchedule.module.scss';
import classNames from 'classnames/bind';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from 'react';
import trainingSchedule from 'src/api/trainingScheduleApi';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import SquareIcon from '@mui/icons-material/Square';
import styled from '@emotion/styled';

import semesterApi from 'src/api/semesterApi';
import { CollectionsBookmarkOutlined } from '@material-ui/icons';

import { IfAllGranted, IfAuthorized, IfAnyGranted, IfNoneGranted } from 'react-authorization';
import ForbiddenPage from 'src/Pages/ForbiddenPage';

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
    width: 100%;
`;
function CommonSchedule({ goDate }) {
    const nowDate = new Date();
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });
    const [scheduleList, setScheduleList] = useState([]);
    const [scheduleId, setScheduleId] = useState();
    const [semester, setSemester] = useState(1);
    const [semesterList, setSemesterList] = useState([]);
    const [startDateOfSemester, setStartDateOfSemester] = useState();
    const [commonList, setCommonList] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [isOpenAddSessionDialog, setIsOpenAddSessionDialog] = useState(false);
    const [isOpenAddScheduleDialog, setIsOpenAddScheduleDialog] = useState(false);
    const [isOpenEditSessionDialog, setIsOpenEditSessionDialog] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const calendarComponentRef = useRef(null);

    const getMonthInCurrentTableView = (startDate) => {
        const temp = new Date(startDate);
        temp.setDate(temp.getDate() + 17);
        const currentMonth = temp.getMonth() + 1;
        const currentYear = temp.getFullYear();
        setMonthAndYear({ month: currentMonth, year: currentYear });
    };

    const fetchCommonScheduleBySemester = async () => {
        try {
            const response = await trainingSchedule.commonSchedule();
            console.log('Thanh cong roi: ', response);
            setCommonList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };
    const fetchTrainingSchedule = async () => {
        try {
            const response = await trainingSchedule.getAllSchedule();
            console.log('fetchTrainingSchedule: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('failed when fetchTrainingSchedule ', error);
        }
    };

    const fetchSemester = async () => {
        try {
            const response = await semesterApi.getTop3Semester();
            console.log('Thanh cong roi, semester: ', response);
            setSemesterList(response.data);
        } catch (error) {
            console.log('That bai roi huhu, semester: ', error);
        }
    };
    // const getCurrentSemester = async () => {
    //     try {
    //         const response = await semesterApi.getCurrentSemester();
    //         console.log('thanh cong roi, currentSemester:', response);
    //         setCurrentSemester(response.data);
    //     } catch (error) {
    //         console.log('failed in get current semester', error);
    //     }
    // };
    const goToSemester = (date) => {
        let calApi = calendarComponentRef.current.getApi();
        calApi.gotoDate(date);
    };
    const getStartDateBySemesterId = (id) => {
        let startDateBySemester = semesterList && semesterList.filter((item) => item.id === id);
        startDateBySemester[0] && setStartDateOfSemester(startDateBySemester[0].startDate);
    };
    const handleChange = (event) => {
        console.log('semester', event.target.value);
        let selectSemester = event.target.value;
        setSemester(selectSemester);
        // fetchScheduleBySemester(semester);
    };

    useEffect(() => {
        // fetchCommonScheduleBySemester();
        fetchTrainingSchedule();
        getStartDateBySemesterId(semester);
        goDate && goToSemester(goDate);
        console.log(startDateOfSemester);
        // setIsUpdate(false);
    }, [semester, goDate]);
    useEffect(() => {
        fetchSemester();
        // getCurrentSemester();
    }, []);
    useEffect(() => {
        fetchCommonScheduleBySemester();
        setIsUpdate(false);
    }, [isUpdate]);

    const scheduleData = commonList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.title;
        container['time'] = item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['type'] = item.type;

        // container['backgroundColor'] = '#5ba8f5';
        container['backgroundColor'] = item.type === 0 ? '#edf2fc' : item.type === 1 ? '#80ffc1' : '#fce99c';

        return container;
    });

    const handleEventAdd = () => {
        console.log('selected');
    };
    let navigate = useNavigate();
    const navigateToUpdate = (params, date) => {
        // console.log(date, nowDate);
        const filterEventClicked = commonList.filter((item) => item.date === moment(date).format('YYYY-MM-DD'));
        console.log('filter event clicked', filterEventClicked);
        if (filterEventClicked[0].type !== 0) {
            console.log('ko phai lich tap');
            return;
        }
        if (
            // date.getMonth() === nowDate.getMonth() &&
            // date.getFullYear() === nowDate.getFullYear() &&
            // date.getDate() === nowDate.getDate()
            new Date(date) < new Date()
        ) {
            console.log('lịch tập quá khứ');
            navigate(
                { pathname: '../admin/attendance' },
                { state: { date: moment(date).format('DD/MM/YYYY'), id: params } },
            );
        } else {
            console.log('lich tap tuong lai, update');
            setSelectedDate(date);
            setIsOpenEditSessionDialog(true);
        }
    };
    const navigateToCreate = (date) => {
        console.log(date);
        const existSession = commonList.filter((item) => item.date === date).length; //length = 0 (false) is not exist
        // const scheduleDateList = scheduleList.
        if (new Date(date) < nowDate) {
            return;
        }
        if (!existSession) {
            setIsDisabled(true);
            setSelectedDate(date);
            setIsOpenAddSessionDialog(true);
            // navigate(`addsession/${date}`);
            // console.log(date);
        } else {
            return;
        }
    };
    const renderEventContent = (eventInfo) => {
        // console.log(eventInfo.event.start);
        let eventDate = new Date(eventInfo.event.start);
        let current = new Date();

        return (
            <Tooltip title={eventInfo.event.title + ' - ' + eventInfo.event.extendedProps.time} placement="top">
                {eventInfo.event.extendedProps.type === 0 ? (
                    <Box>
                        <Box sx={{ ml: '10px' }}>
                            <div className={cx('event-title')} style={{ opacity: 0 }}>
                                {eventDate === current ? (
                                    <>
                                        <strong>
                                            {eventInfo.event.title} <br />
                                            {eventInfo.event.extendedProps.time}
                                        </strong>
                                    </>
                                ) : (
                                    <>
                                        {eventInfo.event.title} <br />
                                        {eventInfo.event.extendedProps.time}
                                    </>
                                )}
                            </div>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ ml: '10px' }}>
                            <div className={cx('event-title')} style={{ opacity: 1 }}>
                                <>
                                    {eventInfo.event.title} <br />
                                    {eventInfo.event.extendedProps.time}
                                </>
                            </div>
                        </Box>
                    </Box>
                )}
            </Tooltip>
        );
    };

    return (
        <IfNoneGranted
            expected={['ROLE_Treasurer']}
            actual={JSON.parse(localStorage.getItem('currentUser')).role.name}
            unauthorized={<Navigate to="/forbidden" />}
        >
            <Fragment>
                <div className={cx('schedule-container')}>
                    <CustomTrainingSchedule>
                        {/* <div className={cx('schedule-content')}> */}
                        {semester && (
                            <FullCalendar
                                initialDate={new Date()}
                                // {...(semester!==2?(initialDate: '2022-10-01'):{})}
                                // initialDate={semester !== 2 ? new Date('2022-10-01') : new Date()}
                                locale="vie"
                                height="100%"
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                eventContent={renderEventContent}
                                // events={[
                                //     {
                                //         id: 1,
                                //         title: 'Teambuiding Tam đảo 18:00-19:00',
                                //         start: '2022-06-24',
                                //         end: '2022-06-27',
                                //         // display: 'background',
                                //         // textColor: 'white',
                                //         // backgroundColor: '#5ba8f5',
                                //         classNames: ['test-css'],
                                //     },
                                // ]}
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
                                    navigateToUpdate(args.event.id, args.event.start);
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
                                // selectable
                                // select={handleEventAdd}
                                // eventDrop={(e) => console.log(e)}
                                // selectable={true}
                                // editable={true}
                                // droppable={true}
                                // eventDrop={function (eventBj, date) {
                                //     console.log('eventDrop function');
                                // }}
                                // drop={(date, jsEvent, ui, resourceId) => {
                                //     console.log('drop function');
                                // }}
                                // select={(start, end, allDay) => {
                                //     this.handleSelect(start, end, allDay);
                                // }}
                            />
                        )}
                        {/* </div> */}
                    </CustomTrainingSchedule>
                </div>
            </Fragment>
        </IfNoneGranted>
    );
}

export default CommonSchedule;
