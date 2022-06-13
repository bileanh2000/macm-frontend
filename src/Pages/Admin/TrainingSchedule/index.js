import { Button, Typography } from '@mui/material';
import { Fragment } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styles from './TrainingSchedule.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
const cx = classNames.bind(styles);
function TrainingSchedule() {
    // const event = {[
    //     { title: 'Đi tập đi đmm', date: '2022-06-06' },
    //     { title: 'đờ i đi', date: '2022-06-07' },
    //     { title: 'đờ i đi', date: '2022-06-07' },
    //     { title: 'đờ i đi', date: '2022-06-09' },
    // ], color: 'yellow'};
    return (
        <Fragment>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Theo dõi lịch tập
            </Typography>
            <Button component={Link} to="/admin/trainingschedules/add" startIcon={<AddCircleIcon />}>
                Thêm lịch tập
            </Button>
            <FullCalendar
                locale="vie"
                height="60%"
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={[
                    {
                        title: 'đi tập đi đmm',
                        start: '2022-06-15',
                        end: '2022-06-15',
                        display: 'background',
                        // textColor: 'white',
                        backgroundColor: '#5ba8f5',
                        classNames: ['test-css'],
                    },
                ]}
                weekends={true}
                headerToolbar={{
                    left: 'title',
                    center: '',
                    right: 'prev next today',
                }}
            />
        </Fragment>
    );
}

export default TrainingSchedule;
