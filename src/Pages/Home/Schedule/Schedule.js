import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Square } from '@mui/icons-material';
import trainingSchedule from 'src/api/trainingScheduleApi';
import styles from './Schedule.module.scss';
import { Box, FormControl, MenuItem, Paper, Select } from '@mui/material';

const cx = classNames.bind(styles);

function Schedule() {
    const nowDate = new Date();
    const [type, setType] = useState(-1);
    const [commonList, setCommonList] = useState([]);
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });

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
    const fetchCommonScheduleBySemester = async (type) => {
        try {
            const response = await trainingSchedule.commonSchedule();
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
        fetchCommonScheduleBySemester(type);
    }, [type]);

    const scheduleData = commonList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.title + ' - ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['type'] = item.type;

        container['backgroundColor'] = item.type === 0 ? '#5ba8f5' : item.type === 1 ? '#37ff9f' : '#F58171';

        return container;
    });

    return (
        <Paper className={cx('schedule-container')}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    <h2>Lịch của câu lạc bộ</h2>
                    <FormControl size="medium">
                        <Select id="demo-simple-select" value={type} displayEmpty onChange={handleChange}>
                            <MenuItem value={-1}>
                                <em>Tất cả</em>
                            </MenuItem>
                            <MenuItem value={0}>Tập luyện</MenuItem>
                            <MenuItem value={1}>Sự kiện</MenuItem>
                            <MenuItem value={2}>Giải đấu</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Square sx={{ color: '#BBBBBB', mr: 0.5 }} />
                        <span>Lịch trong quá khứ</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Square sx={{ color: '#5BA8F5', mr: 0.5 }} />
                        <span>Tập luyện</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Square sx={{ color: '#37ff9f', mr: 0.5 }} />
                        <span>Sự kiện</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Square sx={{ color: '#F58171', mr: 0.5 }} />
                        <span>Giải đấu</span>
                    </Box>
                </Box>
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
                                headerToolbar={{
                                    left: 'title',
                                    center: 'dayGridMonth,dayGridWeek',
                                    right: 'prev next today',
                                }}
                                datesSet={(dateInfo) => {
                                    getMonthInCurrentTableView(dateInfo.start);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Paper>
    );
}

export default Schedule;
