import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { Fragment, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useNavigate, useParams } from 'react-router-dom';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

import adminTournament from 'src/api/adminTournamentAPI';

function TournamentSchedule() {
    const { tournamentId } = useParams();
    const nowDate = new Date();
    const [monthAndYear, setMonthAndYear] = useState({ month: nowDate.getMonth() + 1, year: nowDate.getFullYear() });
    const [scheduleList, setScheduleList] = useState([]);

    const getMonthInCurrentTableView = (startDate) => {
        const temp = new Date(startDate);
        temp.setDate(temp.getDate() + 17);
        const currentMonth = temp.getMonth() + 1;
        const currentYear = temp.getFullYear();
        setMonthAndYear({ month: currentMonth, year: currentYear });
    };
    const fetchEventSchedule = async (params) => {
        try {
            const response = await adminTournament.getTournamentSchedule(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };

    useEffect(() => {
        fetchEventSchedule(tournamentId);
    }, [tournamentId]);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] =
            item.tournament.name + ' - ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';

        return container;
    });

    // const handleEventAdd = () => {
    //     console.log('selected');
    // };
    let navigate = useNavigate();
    const navigateToUpdate = (params) => {
        console.log(params);
        let path = `${params}/update`;
        navigate(path);
    };

    return (
        <Fragment>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 700, marginBottom: 2 }}>
                Chỉnh sửa lịch sự kiện
            </Typography>

            <div>
                <div>
                    <FullCalendar
                        locale="vie"
                        height="60%"
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
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
                        eventClick={(args) => {
                            navigateToUpdate(args.event.id);
                        }}
                    />
                </div>
            </div>
        </Fragment>
    );
}

export default TournamentSchedule;
