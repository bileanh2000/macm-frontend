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
import AddSession from './addSession';
import EditSession from './editSession';
import AddSchedule from './addSchedule';
import { IfAllGranted, IfAuthorized, IfAnyGranted, IfNoneGranted } from 'react-authorization';
import ForbiddenPage from 'src/Pages/ForbiddenPage';
import ViewSession from './viewSession';

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
    // .fc-event-today {
    //     background: none !important;
    // }
    .fc-day-future:hover:after {
        content: 'Tạo buổi tập';
        position: absolute;
        margin-top: -8vh;
        margin-left: 6px;
        font-weight: bold;
        font-size: 0.8rem;
        // bottom: 50%;
        // left: 50%;
    }
    // .fc-event-past {
    //     background-color: #f0f0f0 !important;
    // }
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
    // .fc-day-today:hover:after {
    //     // content: 'Không buổi tập';
    //     position: absolute;
    //     margin-top: -8vh;
    //     margin-left: 6px;
    //     font-weight: bold;
    //     font-size: 0.8rem;
    // }
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
function TrainingSchedule() {
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
    const [isOpenViewSessionDialog, setIsOpenViewSessionDialog] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [trainingId, setTrainingId] = useState();
    const ROLE = JSON.parse(localStorage.getItem('currentUser')).role.name;

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
        startDateOfSemester && goToSemester(startDateOfSemester);
        console.log(startDateOfSemester);
        // setIsUpdate(false);
    }, [semester, startDateOfSemester]);
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

        // container['backgroundColor'] = item.type === 0 ? '#9fccf9' : item.type === 1 ? '#edf2fc' : '#edf2fc';
        // container['backgroundColor'] = item.type === 0 ? '#fff' : item.type === 1 ? '#fff' : '#fff';
        return container;
    });

    const handleEventAdd = () => {
        console.log('selected');
    };
    const navigateToUpdate = (params, date) => {
        // console.log(date, nowDate);
        setSelectedDate(date);
        setTrainingId(params);
        const filterEventClicked = commonList.filter((item) => item.date === moment(date).format('YYYY-MM-DD'));
        console.log('filter event clicked', filterEventClicked);
        if (filterEventClicked[0].type !== 0) {
            console.log('ko phai lich tap');
            return;
        }
        if (new Date(date) < new Date()) {
            console.log('lịch tập quá khứ');
            setIsOpenViewSessionDialog(true);
            // navigate(
            //     { pathname: '../admin/attendance' },
            //     { state: { date: moment(date).format('DD/MM/YYYY'), id: params } },
            // );
        } else {
            console.log('lich tap tuong lai, update');
            setIsOpenEditSessionDialog(true);
        }
    };
    const navigateToCreate = (date) => {
        // console.log(date);

        nowDate.setHours(0, 0, 0, 0);
        let selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        console.log(nowDate - selectedDate);

        const existSession = commonList.filter((item) => item.date === date).length; //length = 0 (false) is not exist
        // const scheduleDateList = scheduleList.
        if (selectedDate < nowDate) {
            return;
        }
        if (selectedDate - nowDate === 0) {
            console.log('aaa');
            return;
        }
        // if (new Date(date) === nowDate) {
        //     console.log('123123');
        // }
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
        let eventDate = new Date(eventInfo.event.start);
        let current = new Date();
        current.setHours(0, 0, 0, 0);
        // console.log(current);

        return (
            // <Tooltip
            //     title={
            //         // eventInfo.event.extendedProps.type === 0
            //         //     ? eventInfo.event.title + ' ' + eventInfo.event.extendedProps.time
            //         //     : 'Không thể tạo lịch tập (trùng hoạt động khác)'
            //         // eventDate < current ? 'Xem thông tin điểm danh' : 'Cập nhật thời gian'?eventInfo.event.extendedProps.type === 0?'Không thể tạo lịch tập (trùng hoạt động khác)':''
            //         eventInfo.event.extendedProps.type === 0
            //             ? eventDate < current
            //                 ? 'Xem thông tin điểm danh'
            //                 : 'Cập nhật thời gian'
            //             : `Không thể tạo lịch tập (trùng với ${eventInfo.event.title})`
            //     }
            //     placement="top"
            // >
            //     {eventInfo.event.extendedProps.type === 0 ? (
            //         <Box sx={{ height: '100%' }}>
            //             <Box sx={{ ml: '10px' }}>
            //                 <div className={cx('event-title')}>
            //                     {eventDate === current ? (
            //                         <>
            //                             <strong>
            //                                 {eventInfo.event.title} <br />
            //                                 {eventInfo.event.extendedProps.time}
            //                             </strong>
            //                         </>
            //                     ) : (
            //                         <>
            //                             {eventInfo.event.title} <br />
            //                             {eventInfo.event.extendedProps.time}
            //                         </>
            //                     )}
            //                 </div>
            //             </Box>
            //         </Box>
            //     ) : (
            //         <Box sx={{ height: '100%', backgroundColor: 'red' }}>
            //             <Box sx={{ ml: '10px' }}>
            //                 <div className={cx('event-title')} style={{ opacity: 1 }}>
            //                     {/* {eventInfo.event.title} <br />
            //                     {eventInfo.event.extendedProps.time} */}
            //                     Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem cumque voluptatum nihil
            //                     magni sint cum veritatis voluptas consequuntur delectus, facere magnam quisquam
            //                     architecto illum officiis ratione, nobis est nesciunt autem!
            //                 </div>
            //             </Box>
            //         </Box>
            //     )}
            // </Tooltip>
            <Tooltip
                title={
                    // eventInfo.event.extendedProps.type === 0
                    //     ? eventDate < current
                    //         ? 'Xem thông tin điểm danh'
                    //         : 'Cập nhật thời gian'
                    //     : `Không thể tạo lịch tập (trùng với ${eventInfo.event.title})`
                    eventDate < current
                        ? eventInfo.event.extendedProps.type !== 0
                            ? ''
                            : 'Xem thông tin'
                        : eventInfo.event.extendedProps.type === 0
                        ? 'Xem thông tin'
                        : `Không thể tạo lịch tập (trùng với ${eventInfo.event.title})`
                }
                placement="top"
            >
                {eventDate < current ? (
                    eventInfo.event.extendedProps.type !== 0 ? (
                        <Box
                            sx={{
                                height: '100%',
                                backgroundColor: '#fff',
                                // display: 'none',
                                cursor: 'default !important',
                            }}
                        >
                            <Box sx={{ ml: 0.5 }} className={cx('tooltip')}></Box>
                        </Box>
                    ) : (
                        <Box sx={{ height: '100%', backgroundColor: '#edf2fc' }}>
                            <Box sx={{ ml: 0.5 }} className={cx('tooltip')}>
                                <div className={cx('event-title')}>
                                    {eventInfo.event.title} <br />
                                    {eventInfo.event.extendedProps.time}
                                </div>
                            </Box>
                        </Box>
                    )
                ) : eventInfo.event.extendedProps.type === 0 ? (
                    <Box sx={{ height: '100%', backgroundColor: '#9fccf9' }}>
                        <Box sx={{ ml: 0.5 }} className={cx('tooltip')}>
                            <div className={cx('event-title')}>
                                {eventInfo.event.title} <br />
                                {eventInfo.event.extendedProps.time}
                            </div>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ height: '100%', backgroundColor: '#f0f0f0' }}>
                        <Box sx={{ ml: 0.5 }} className={cx('tooltip')}>
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
        <IfNoneGranted
            expected={['ROLE_Treasurer']}
            actual={JSON.parse(localStorage.getItem('currentUser')).role.name}
            unauthorized={<Navigate to="/forbidden" />}
        >
            <Fragment>
                {isOpenViewSessionDialog && (
                    <ViewSession
                        title="Thông tin buổi tập"
                        isOpen={isOpenViewSessionDialog}
                        date={selectedDate}
                        handleClose={() => {
                            setIsOpenViewSessionDialog(false);
                            setSelectedDate(null);
                            setTrainingId(null);
                        }}
                        trainingId={trainingId}
                    />
                )}
                {isOpenAddSessionDialog && (
                    <AddSession
                        title="Tạo buổi tập"
                        isOpen={isOpenAddSessionDialog}
                        handleClose={() => {
                            setIsOpenAddSessionDialog(false);
                            setSelectedDate(null);
                        }}
                        date={selectedDate}
                        isDisabled={isDisabled}
                        onSucess={(isUpdate) => {
                            setIsUpdate(isUpdate);
                        }}
                    />
                )}
                {isOpenEditSessionDialog && (
                    <EditSession
                        title="Thông tin buổi tập"
                        isOpen={isOpenEditSessionDialog}
                        handleClose={() => {
                            setIsOpenEditSessionDialog(false);
                            setSelectedDate(null);
                        }}
                        date={selectedDate}
                        onSucess={(isUpdate) => {
                            setIsUpdate(isUpdate);
                        }}
                    />
                )}
                {isOpenAddScheduleDialog && (
                    <AddSchedule
                        title="Thêm lịch tập"
                        isOpen={isOpenAddScheduleDialog}
                        handleClose={() => {
                            // setIsOpenEditSessionDialog(false);
                            // setSelectedDate(null);
                            setIsOpenAddScheduleDialog(false);
                        }}
                        date={selectedDate}
                        onSucess={(isUpdate) => {
                            setIsUpdate(isUpdate);
                        }}
                    />
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 700, marginBottom: 2 }}>
                        Theo dõi lịch tập
                    </Typography>
                    <Box>
                        {/* <Box sx={{ mt: 8, ml: 2 }}>
                    </Box> */}
                        <Button
                            // component={Link}
                            // to="/admin/trainingschedules/addsession"
                            onClick={() => {
                                setIsOpenAddSessionDialog(true);
                                setIsDisabled(false);
                            }}
                            startIcon={<AddCircleIcon />}
                            variant="outlined"
                            sx={{ mr: 1 }}
                        >
                            Thêm buổi tập
                        </Button>
                        {/* <IfNoneGranted
                            expected={[
                                'ROLE_Treasurer, ROLE_HeadCulture,ROLE_ViceHeadCulture,ROLE_HeadCommunication,ROLE_ViceHeadCommunication',
                            ]}
                            actual={JSON.parse(localStorage.getItem('currentUser')).role.name}
                            unauthorized={<Navigate to="/forbidden" />}
                        > */}

                        {/* </IfNoneGranted> */}
                        {ROLE === 'ROLE_HeadClub' ||
                        ROLE === 'ROLE_ViceHeadClub' ||
                        ROLE === 'ROLE_HeadTechnique' ||
                        ROLE === 'ROLE_ViceHeadTechnique' ? (
                            <Button
                                // component={Link}
                                // to="/admin/trainingschedules/add"
                                onClick={() => setIsOpenAddScheduleDialog(true)}
                                startIcon={<AddCircleIcon />}
                                variant="outlined"
                            >
                                Thêm lịch tập
                            </Button>
                        ) : null}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <TextField
                        id="outlined-select-currency"
                        size="small"
                        select
                        label="Chọn kỳ"
                        value={semester}
                        onChange={handleChange}
                    >
                        {semesterList.map((option) => (
                            <MenuItem key={option.id} value={parseInt(option.id, 10)}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                        <Box>
                            <Typography>Bấm vào ngày trống trong tương lai để tạo lịch tập</Typography>
                        </Box>
                        <Box>
                            <Typography>Bấm vào lịch tập trong quá khứ để xem trạng thái điểm danh</Typography>
                        </Box>
                        {/* <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <SquareIcon sx={{ color: '#edf2fc', mr: 0.5, border: '1px solid black' }} />
                            <span>Lịch tập trong quá khứ (bấm vào để xem thông tin điểm danh)</span>
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
                                    center: '',
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

export default TrainingSchedule;
