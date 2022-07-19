import { Box } from '@mui/system';
import moment from 'moment';
import { Fragment, useEffect } from 'react';
import { useState } from 'react';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import CircularProgress from '@mui/material/CircularProgress';
import QRScanner from '../index';
import LoadingProgress from 'src/Components/LoadingProgress';

function CheckAttendanceDate() {
    const [attendanceDateStatus, setAttendanceDateStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const currentDate = moment(new Date()).format('DD/MM/YYYY');

    const fetchCommonScheduleByDate = async (date) => {
        try {
            const response = await adminAttendanceAPI.getCommonSessionByDate(date);
            console.log('commonschedulebydate', response);
            if (response.data.length !== 0) {
                setAttendanceDateStatus(true);
                setLoading(false);
            } else {
                setAttendanceDateStatus(false);
                setLoading(false);
            }
        } catch (error) {
            console.log('failed when fetchCommonScheduleByDate', error);
        }
    };

    useEffect(() => {
        fetchCommonScheduleByDate(currentDate);
    });
    return (
        // <Box sx={{ display: 'flex', height: '100%', width: '100wh', alignItems: 'center', justifyContent: 'center' }}>
        <Fragment>
            <Box>
                {loading ? (
                    <LoadingProgress />
                ) : attendanceDateStatus ? (
                    <QRScanner />
                ) : (
                    'Hôm nay không có hoạt động cần điểm danh!'
                )}
            </Box>
        </Fragment>
    );
}

export default CheckAttendanceDate;
