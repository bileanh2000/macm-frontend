import { Box, Button, MenuItem, TextField, Tooltip, Typography } from '@mui/material';
import { createRef, Fragment, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styles from './TrainingSchedule.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from 'react';
import trainingSchedule from 'src/api/trainingScheduleApi';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import SquareIcon from '@mui/icons-material/Square';
import styled from '@emotion/styled';

import semesterApi from 'src/api/semesterApi';
import { CollectionsBookmarkOutlined } from '@material-ui/icons';

const cx = classNames.bind(styles);

export const CustomTrainingSchedule = styled.div`
    .fc-day-future {
        transition: 0.2s;
    }
    .fc-day-future:hover:hover {
        background-color: #57a6f4 !important;
    }
    background-color: #fff;
    padding: 12px;
    height: 80vh;
    width: 70%;
`;
function TrainingSchedule() {
    const nowDate = new Date();
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });
    const [scheduleList, setScheduleList] = useState([]);
    const [scheduleId, setScheduleId] = useState();
    const [semester, setSemester] = useState(2);
    const [semesterList, setSemesterList] = useState([]);
    const [currentSemester, setCurrentSemester] = useState([]);
    const [startDateOfSemester, setStartDateOfSemester] = useState();
    const [commonList, setCommonList] = useState([]);
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
        fetchCommonScheduleBySemester();
        fetchTrainingSchedule();
        getStartDateBySemesterId(semester);
        startDateOfSemester && goToSemester(startDateOfSemester);
        console.log(startDateOfSemester);
    }, [semester, startDateOfSemester]);
    useEffect(() => {
        fetchSemester();
        // getCurrentSemester();
    }, []);

    const scheduleData = commonList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.title;
        container['time'] = item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['type'] = item.type;

        // container['backgroundColor'] = '#5ba8f5';
        container['backgroundColor'] = item.type === 0 ? '#9fccf9' : item.type === 1 ? '#d9d9d9' : '#d9d9d9';

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

            let path = `${moment(date).format('YYYY-MM-DD')}/edit`;
            navigate(path);
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
            navigate(`addsession/${date}`);
            console.log(date);
        } else {
            return;
        }
    };
    const renderEventContent = (eventInfo) => {
        console.log(eventInfo);

        return (
            <Tooltip
                title={
                    eventInfo.event.extendedProps.type === 0
                        ? eventInfo.event.title + ' ' + eventInfo.event.extendedProps.time
                        : 'Không thể tạo lịch tập (trùng hoạt động khác)'
                }
                placement="top"
            >
                {eventInfo.event.extendedProps.type === 0 ? (
                    <Box>
                        <Box sx={{ ml: 0.5 }}>
                            <div className={cx('event-title')}>
                                {eventInfo.event.title} <br />
                                {eventInfo.event.extendedProps.time}
                            </div>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ ml: 0.5 }}>
                            <div className={cx('event-title')} style={{ opacity: 0 }}>
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
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 700, marginBottom: 2 }}>
                    Theo dõi lịch tập
                </Typography>
                <Box>
                    {/* <Box sx={{ mt: 8, ml: 2 }}>
                    </Box> */}
                    <Button
                        component={Link}
                        to="/admin/trainingschedules/addsession"
                        startIcon={<AddCircleIcon />}
                        variant="outlined"
                        sx={{ mr: 1 }}
                    >
                        Thêm buổi tập
                    </Button>
                    <Button
                        component={Link}
                        to="/admin/trainingschedules/add"
                        startIcon={<AddCircleIcon />}
                        variant="outlined"
                    >
                        Thêm lịch tập
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                    id="outlined-select-currency"
                    size="small"
                    select
                    label="Select"
                    value={semester}
                    onChange={handleChange}
                >
                    {semesterList.map((option) => (
                        <MenuItem key={option.id} value={parseInt(option.id, 10)}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* <Typography>Bấm vào ngày trống trong tương lai để tạo lịch tập</Typography>
                    <Typography>Bấm vào lịch tập cũ để xem trạng thái điểm danh</Typography> */}
                    {/* <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <SquareIcon sx={{ color: '#BBBBBB', mr: 0.5 }} />
                        <span>Lịch trong quá khứ</span>
                    </Box> */}
                    {/* <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <SquareIcon sx={{ color: '#9fccf9', mr: 0.5 }} />
                        <span>Tập luyện</span>
                    </Box> */}
                    {/* <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <SquareIcon sx={{ color: '#80ffc1', mr: 0.5 }} />
                        <span>Sự kiện</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <SquareIcon sx={{ color: '#f8aaa0', mr: 0.5 }} />
                        <span>Giải đấu</span>
                    </Box> */}
                </Box>
            </Box>
            <div className={cx('schedule-container')}>
                <CustomTrainingSchedule>
                    {/* <div className={cx('schedule-content')}> */}
                    {semester && (
                        <FullCalendar
                            // initialDate={new Date('2022-10-01')}
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
                            // editable={true}
                            // selectable={true}
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
                        />
                    )}
                    {/* </div> */}
                </CustomTrainingSchedule>
            </div>
        </Fragment>
    );
}

export default TrainingSchedule;
