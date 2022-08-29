import React, { Fragment, useEffect, useState } from 'react';
import { Box, Button, Container, Divider, Paper, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ViewAttendance from './ViewAttendance';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import moment from 'moment';

function Attendance() {
    const location = useLocation();
    const [type, setType] = useState(0);
    const [title, setTitle] = useState();

    moment().locale('vi');

    const _trainingScheduleId = location.state?.id;
    let _nowDate = location.state?.date;

    const [trainingScheduleId, setTrainingScheduleId] = useState(_trainingScheduleId);

    const nowDate = new Date();
    if (!_nowDate) _nowDate = moment(new Date(nowDate)).format('DD/MM/yyyy');
    // const date = moment(new Date(_nowDate)).format('DD/MM/yyyy');

    console.log(trainingScheduleId, _nowDate);

    useEffect(() => {
        const getSessionByDate = async () => {
            try {
                const response = await adminAttendanceAPI.getCommonSessionByDate(_nowDate);
                if (!_trainingScheduleId && response.data.length > 0) {
                    setTrainingScheduleId(response.data[0].id);
                }
                console.log('common shedule', response);
                response.data[0].type == 0 ? setTitle('buổi tập') : setTitle(response.data[0].title);
                setType(response.data[0].type);
            } catch (error) {
                console.log('dm', error);
            }
        };
        getSessionByDate();
    }, [_nowDate, _trainingScheduleId]);

    useEffect(() => {
        setTrainingScheduleId(_trainingScheduleId);
    }, [_trainingScheduleId]);

    return (
        <Box sx={{}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {trainingScheduleId ? (
                    <Container maxWidth="xl">
                        <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                            Trạng thái điểm danh {type == 0 ? title : 'sự kiện ' + title} ngày: {_nowDate}
                        </Typography>
                        <Divider />

                        <ViewAttendance data={{ trainingScheduleId, date: _nowDate, type }} />
                    </Container>
                ) : (
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                        Hôm nay không có hoạt động nào cần điểm danh!
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default Attendance;
