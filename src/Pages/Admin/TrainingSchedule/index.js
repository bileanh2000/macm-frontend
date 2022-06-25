import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
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
import moment from 'moment';

import semesterApi from 'src/api/semesterApi';

const cx = classNames.bind(styles);

function TrainingSchedule() {
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
    const fetchScheduleBySemester = async (params) => {
        try {
            const response = await trainingSchedule.getAllScheduleBySemester(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
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
    const handleChange = (event) => {
        console.log('semester', event.target.value);
        let selectSemester = event.target.value;
        setSemester(selectSemester);
        // fetchScheduleBySemester(semester);
    };

    useEffect(() => {
        fetchScheduleBySemester(semester);
    }, [semester]);
    useEffect(() => {
        fetchSemester();
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                <Box>
                    <Button component={Link} to="/admin/trainingschedules/addsession" startIcon={<AddCircleIcon />}>
                        Thêm buổi tập
                    </Button>
                    <Button component={Link} to="/admin/trainingschedules/add" startIcon={<AddCircleIcon />}>
                        Thêm lịch tập
                    </Button>
                </Box>
            </Box>

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
