import React, { Fragment, useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ViewAttendance from './ViewAttendance';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import moment from 'moment';

function Attendance() {
    const location = useLocation();
    moment().locale('vi');

    const _trainingScheduleId = location.state?.id;
    let _nowDate = location.state?.date;

    const [trainingScheduleId, setTrainingScheduleId] = useState(_trainingScheduleId);

    const nowDate = new Date(2022, 5, 22);
    if (!_nowDate) _nowDate = nowDate;
    const date = moment(new Date(_nowDate)).format('DD/MM/yyyy');

    const getSessionByDate = async () => {
        try {
            console.log(date);
            const response = await adminAttendanceAPI.getTrainingSessionByDate(date);
            console.log(response.data);
            if (!_trainingScheduleId) setTrainingScheduleId(response.data[0].id);
        } catch (error) {
            console.log('dm', error);
        }
    };

    useEffect(() => {
        getSessionByDate();
    }, [trainingScheduleId]);
    return (
        <Fragment>
            {trainingScheduleId && (
                <div>
                    <ViewAttendance data={{ trainingScheduleId, date }} />
                    <Button variant="outlined" sx={{ color: 'black' }}>
                        <Link sx={{ color: 'black' }} to="./take" state={{ id: trainingScheduleId, date: date }}>
                            Điểm danh
                        </Link>
                    </Button>
                </div>
            )}
            {!_trainingScheduleId && <Typography variant="h3">Hôm nay không có buổi tập nào</Typography>}
        </Fragment>
    );
}

export default Attendance;
