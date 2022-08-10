import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { Box, Tooltip } from '@mui/material';

function PreviewSchedule({ dataPreview, initialDate }) {
    const renderEventContent = (eventInfo) => {
        // console.log(eventInfo);
        return (
            <Tooltip title={eventInfo.event.title + ' ' + eventInfo.event.extendedProps.time} placement="top">
                <Box>
                    <Box sx={{ mt: 3, ml: 0.5, fontWeight: '500', fontSize: '14px' }}>
                        <div>
                            {eventInfo.event.title} <br />
                            {eventInfo.event.extendedProps.time}
                        </div>
                    </Box>
                </Box>
            </Tooltip>
        );
    };
    return (
        <FullCalendar
            initialDate={initialDate}
            locale="vie"
            height="100%"
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
            eventContent={renderEventContent}
            events={dataPreview}
            weekends={true}
            headerToolbar={{
                left: 'title',
                center: '',
                right: 'prev next today',
            }}

            // eventClick={(args) => {
            //     deleteDate(args.event.id);
            // }}
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
    );
}

export default PreviewSchedule;
