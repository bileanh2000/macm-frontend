import React, { Fragment } from 'react';
import { Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ViewAttendance from './ViewAttendance';

function Attendance() {
    const location = useLocation();

    const _trainingScheduleId = location.state?.id;
    const _nowDate = location.state?.date;
    return (
        <Fragment>
            <ViewAttendance />
            <Button>
                <Link to="./take" state={{ id: _trainingScheduleId, date: _nowDate }}>
                    Điểm danh
                </Link>
            </Button>
        </Fragment>
    );
}

export default Attendance;
