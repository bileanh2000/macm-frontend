import { Button, Typography } from '@mui/material';
import { Fragment, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styles from './TrainingSchedule.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from 'react';
import trainingSchedule from 'src/api/trainingScheduleApi';
import interactionPlugin from '@fullcalendar/interaction';
import swal from 'sweetalert';
import moment from 'moment';
import { getDate } from 'date-fns';

const cx = classNames.bind(styles);

function TrainingSchedule() {
    const nowDate = new Date();
    // const nowDate = new Date(2022, 5, 21);
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });
    const [scheduleList, setScheduleList] = useState([]);
    const [scheduleId, setScheduleId] = useState();
    const getMonthInCurrentTableView = (startDate) => {
        const temp = new Date(startDate);
        temp.setDate(temp.getDate() + 17);
        const currentMonth = temp.getMonth() + 1;
        const currentYear = temp.getFullYear();
        setMonthAndYear({ month: currentMonth, year: currentYear });
        console.log(currentMonth, currentYear);
    };
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const params = monthAndYear;
                const response = await trainingSchedule.getAllSchedule();
                console.log('Thanh cong roi: ', response);
                setScheduleList(response.data);
            } catch (error) {
                console.log('That bai roi huhu ', error);
            }
        };
        fetchSchedule();
    }, []);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';

        return container;
    });

    useEffect(() => {
        console.log(scheduleData);
        console.log(scheduleData.filter((item) => item.id === 6));
    }, [scheduleData]);

    const handleEventAdd = () => {
        console.log('selected');
    };
    let navigate = useNavigate();
    const navigateToUpdate = (params, date) => {
        console.log(date, nowDate);
        if (
            date.getMonth() === nowDate.getMonth() &&
            date.getFullYear() === nowDate.getFullYear() &&
            date.getDate() === nowDate.getDate()
        ) {
            console.log('dung ngay roi');
            navigate({ pathname: '../admin/attendance' }, { state: { date: date, id: params } });
        } else {
            console.log('sai ngay roi');
            console.log(params);
            let path = `${params}/edit`;
            navigate(path);
        }
    };
    return (
        <Fragment>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 700, marginBottom: 2 }}>
                Theo dõi lịch tập
            </Typography>
            <Button component={Link} to="/admin/trainingschedules/addsession" startIcon={<AddCircleIcon />}>
                Thêm buổi tập
            </Button>
            <Button component={Link} to="/admin/trainingschedules/add" startIcon={<AddCircleIcon />}>
                Thêm lịch tập
            </Button>
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
                            center: '',
                            right: 'prev next today',
                        }}
                        // editable={true}
                        // selectable={true}
                        datesSet={(dateInfo) => {
                            getMonthInCurrentTableView(dateInfo.start);
                        }}
                        eventClick={(args) => {
                            navigateToUpdate(args.event.id, args.event.start);
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
}

export default TrainingSchedule;
