import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { createRef, Fragment, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styles from './Schedule.module.scss';
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
import AddSession from 'src/Pages/Admin/TrainingSchedule/addSession';
import EditSession from 'src/Pages/Admin/TrainingSchedule/editSession';

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
        content: 'Tạo buổi tập';
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
    height: 80vh;
`;
function EditableSchedule({ isEdit, isOpen, handleClose, onSucess, initialDate, description }) {
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

    useEffect(() => {
        // fetchCommonScheduleBySemester();
        fetchTrainingSchedule();
        console.log(startDateOfSemester);
        // setIsUpdate(false);
    }, [semester, startDateOfSemester]);
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
        container['backgroundColor'] = item.type === 0 ? '#9fccf9' : item.type === 1 ? '#edf2fc' : '#edf2fc';

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
            <Tooltip
                title={
                    // eventInfo.event.extendedProps.type === 0
                    //     ? eventInfo.event.title + ' ' + eventInfo.event.extendedProps.time
                    //     : 'Không thể tạo lịch tập (trùng hoạt động khác)'
                    // eventDate < current ? 'Xem thông tin điểm danh' : 'Cập nhật thời gian'?eventInfo.event.extendedProps.type === 0?'Không thể tạo lịch tập (trùng hoạt động khác)':''
                    eventInfo.event.extendedProps.type === 0
                        ? eventDate < current
                            ? 'Xem thông tin điểm danh'
                            : 'Cập nhật thời gian'
                        : `Không thể tạo lịch tập (trùng với ${eventInfo.event.title})`
                }
                placement="top"
            >
                {eventInfo.event.extendedProps.type === 0 ? (
                    <Box>
                        <Box sx={{ ml: '10px' }}>
                            <div className={cx('event-title')}>
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
        <Fragment>
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
                    title="Cập nhật thời gian buổi tập"
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

            <Dialog
                fullWidth
                maxWidth="md"
                // keepMounted
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Chỉnh sửa lịch tập</DialogTitle>
                <DialogContent>
                    <Typography color="error">
                        <strong>
                            Ngày {description.map((i) => moment(i.date).format('DD/MM/yyyy') + ', ')}
                            đang bị trùng !
                        </strong>
                    </Typography>
                    * Tương tác với lịch để chỉnh sửa
                    <div className={cx('schedule-container')}>
                        <CustomTrainingSchedule>
                            {/* <div className={cx('schedule-content')}> */}
                            {semester && (
                                <FullCalendar
                                    initialDate={initialDate}
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
                                        navigateToUpdate(args.event.id, args.event.start);
                                        // console.log(args);
                                    }}
                                    dateClick={function (arg) {
                                        navigateToCreate(arg.dateStr);
                                    }}
                                />
                            )}
                            {/* </div> */}
                        </CustomTrainingSchedule>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Quay lại</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default EditableSchedule;
