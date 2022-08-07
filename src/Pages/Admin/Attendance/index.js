import React, { Fragment, useEffect, useState } from 'react';
import { Box, Button, Container, Divider, Paper, Typography } from '@mui/material';
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
        <Box sx={{ m: 1, p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {trainingScheduleId ? (
                    <Container maxWidth="xl">
                        <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                            Trạng thái điểm danh ngày: {moment(new Date(_nowDate)).format('DD/MM/yyyy')}
                        </Typography>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2 }}>
                            <Button variant="outlined">
                                <Link to={`./report`} style={{ color: 'black' }}>
                                    Thống kê thành viên tham gia buổi tập
                                </Link>
                            </Button>
                            <Box>
                                <Button variant="outlined" sx={{ color: 'black', mr: 2 }}>
                                    <Link
                                        sx={{ color: 'black' }}
                                        to="./take"
                                        state={{ id: trainingScheduleId, date: date, type: type }}
                                    >
                                        Điểm danh
                                    </Link>
                                </Button>
                                <Button variant="outlined" sx={{ color: 'black' }}>
                                    <Link
                                        sx={{ color: 'black' }}
                                        to="./scanqrcode"
                                        // state={{ id: trainingScheduleId, date: date, type: type }}
                                    >
                                        QRCode
                                    </Link>
                                </Button>
                            </Box>
                        </Box>

                        <ViewAttendance data={{ trainingScheduleId, date, type }} />
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
