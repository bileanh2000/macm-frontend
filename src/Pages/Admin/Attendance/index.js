import React, { Fragment, useEffect, useState } from 'react';
import { Button, Container, Paper, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ViewAttendance from './ViewAttendance';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import moment from 'moment';

function Attendance() {
    const location = useLocation();
    const [type, setType] = useState(0);

    moment().locale('vi');

    const _trainingScheduleId = location.state?.id;
    let _nowDate = location.state?.date;

    const [trainingScheduleId, setTrainingScheduleId] = useState(_trainingScheduleId);

    const nowDate = new Date();
    if (!_nowDate) _nowDate = nowDate;
    const date = moment(new Date(_nowDate)).format('DD/MM/yyyy');

    console.log(trainingScheduleId, date);
    const getSessionByDate = async () => {
        try {
            const response = await adminAttendanceAPI.getCommonSessionByDate(date);
            if (!_trainingScheduleId && response.data.length > 0) {
                setTrainingScheduleId(response.data[0].id);
            }
            setType(response.data[0].type);
        } catch (error) {
            console.log('dm', error);
        }
    };

    useEffect(() => {
        getSessionByDate();
    }, []);

    return (
        <Paper elevation={3} sx={{ p: 1 }}>
            <Button variant="contained" color="success" sx={{ float: 'right', m: 2 }}>
                <Link to={`./report`} style={{ color: 'white' }}>
                    Thống kê thành viên tham gia buổi tập
                </Link>
            </Button>
            {trainingScheduleId && type && (
                <Container maxWidth="xl">
                    <ViewAttendance data={{ trainingScheduleId, date, type }} />
                    <Button variant="outlined" sx={{ color: 'black' }}>
                        <Link
                            sx={{ color: 'black' }}
                            to="./take"
                            state={{ id: trainingScheduleId, date: date, type: type }}
                        >
                            Điểm danh
                        </Link>
                    </Button>
                </Container>
            )}
            {!trainingScheduleId && <Typography variant="h3">Hôm nay không có buổi tập nào</Typography>}
        </Paper>
    );
}

export default Attendance;
