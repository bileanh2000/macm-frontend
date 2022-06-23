import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { Fragment, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styles from 'src/Pages/Admin/TrainingSchedule/TrainingSchedule.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from 'react';
import trainingSchedule from 'src/api/trainingScheduleApi';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import eventApi from 'src/api/eventApi';

const cx = classNames.bind(styles);

function ViewEventSchedule() {
    const { id } = useParams();
    const nowDate = new Date();
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });
    const [scheduleList, setScheduleList] = useState([]);
    const [scheduleId, setScheduleId] = useState();
    const [semester, setSemester] = useState(2);
    const [semesterList, setSemesterList] = useState([]);

    const getMonthInCurrentTableView = (startDate) => {
        const temp = new Date(startDate);
        temp.setDate(temp.getDate() + 17);
        const currentMonth = temp.getMonth() + 1;
        const currentYear = temp.getFullYear();
        setMonthAndYear({ month: currentMonth, year: currentYear });
    };
    const fetchEventSchedule = async (params) => {
        try {
            const response = await eventApi.getEventScheduleByEvent(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };

    useEffect(() => {
        fetchEventSchedule(id);
    }, [id]);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.event.name + ' - ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';

        return container;
    });

    const handleEventAdd = () => {
        console.log('selected');
    };
    let navigate = useNavigate();
    const navigateToUpdate = (params) => {
        // console.log('sai ngay roi');
        console.log(params);
        let path = `${params}/edit`;
        navigate(path);
    };
    return (
        <Fragment>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 700, marginBottom: 2 }}>
                Chỉnh sửa lịch sự kiện
            </Typography>

            <div className={cx('schedule-container')}>
                <div className={cx('schedule-content')}>
                    <FullCalendar
                        locale="vie"
                        height="60%"
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        // events={[
                        //     {
                        //         id: 1,
                        //         title: 'đi tập đi đmm',
                        //         date: '2022-06-16',
                        //         // display: 'background',
                        //         // textColor: 'white',
                        //         backgroundColor: '#5ba8f5',
                        //         classNames: ['test-css'],
                        //     },
                        // ]}
                        events={scheduleData}
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
                            navigateToUpdate(args.event.id);
                        }}
                        // dateClick={function (arg) {
                        //     swal({
                        //         title: 'Date',
                        //         text: arg.dateStr,
                        //         type: 'success',
                        //     });
                        // }}
                        // selectable
                        // select={handleEventAdd}
                        // eventDrop={(e) => console.log(e)}
                    />
                </div>
            </div>
        </Fragment>
    );
    // return (
    //     <Fragment>
    //         <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
    //             Chỉnh sửa lịch sự kiện
    //         </Typography>
    //     </Fragment>
    // );
}

export default ViewEventSchedule;
