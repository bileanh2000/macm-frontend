import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useParams } from 'react-router-dom';

import adminTournament from 'src/api/adminTournamentAPI';
import { Box } from '@mui/material';

function TournamentSchedule() {
    let { tournamentId } = useParams();
    const [scheduleList, setScheduleList] = useState([]);

    const fetchTournamentSchedule = async (params) => {
        try {
            const response = await adminTournament.getTournamentSchedule(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };

    useEffect(() => {
        fetchTournamentSchedule(tournamentId);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
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

    return (
        <Box sx={{ mt: 2, mb: 2, p: 1, height: '30rem' }}>
            {scheduleList.length > 0 && (
                <FullCalendar
                    // initialDate={new Date('2022-09-01')}
                    initialDate={scheduleData[0] && new Date(scheduleData[0].date)}
                    locale="vie"
                    height="100%"
                    plugins={[dayGridPlugin, interactionPlugin]}
                    defaultView="dayGridMonth"
                    events={scheduleData}
                    weekends={true}
                    headerToolbar={{
                        left: 'title',
                        center: 'dayGridMonth,dayGridWeek',
                        right: 'prev next',
                        // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                    }}
                />
            )}
        </Box>
    );
}

export default TournamentSchedule;
