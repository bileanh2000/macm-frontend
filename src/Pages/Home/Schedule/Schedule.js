import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import trainingSchedule from 'src/api/trainingScheduleApi';
import styles from './Schedule.module.scss'
import { FormControl, MenuItem, Select } from '@mui/material'

const cx = classNames.bind(styles)

function Schedule() {

    const nowDate = new Date();
    const [type, setType] = useState('All');
    const [scheduleList, setScheduleList] = useState([]);
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });
    let navigate = useNavigate();

    const handleChange = (event) => {
        setType(event.target.value);
    };

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
    }, [monthAndYear]);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.startTime + ' - ' + item.finishTime;
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';

        return container;
    });

    useEffect(() => {
        console.log(scheduleData);
    }, [scheduleData]);

    const navigateToUpdate = (params) => {
        let path = `${params}/edit`;
        navigate(path);
    };

    return (
        <div className={cx('schedule-container')}>
            <div>
                <h2>Schedule</h2>
                <FormControl size='medium'>
                    <Select
                        id="demo-simple-select"
                        value={type}
                        displayEmpty
                        onChange={handleChange}
                    >
                        <MenuItem value="All">
                            <em>All</em>
                        </MenuItem>
                        <MenuItem value={'Event'}>Event</MenuItem>
                        <MenuItem value={'News'}>News</MenuItem>
                        <MenuItem value={'Schedule Training'}>Schedule Training</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <div className={cx('schedule-container')}>
                    <div className={cx('schedule-content')}>
                        {scheduleData.length > 0 && (
                            <FullCalendar
                                locale="vie"
                                initialView="dayGridMonth"
                                plugins={[dayGridPlugin, interactionPlugin]}
                                events={scheduleData}
                                weekends={true}
                                headerToolbar={{
                                    left: 'title',
                                    center: '',
                                    right: 'prev next today',
                                }}
                                datesSet={(dateInfo) => {
                                    getMonthInCurrentTableView(dateInfo.start);
                                }}
                            // eventClick={(args) => {
                            //     navigateToUpdate(args.event.id);
                            // }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Schedule 