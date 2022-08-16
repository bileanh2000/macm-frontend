import { Box } from '@mui/system';
import moment from 'moment';
import { Fragment, useEffect } from 'react';
import { useState } from 'react';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import CircularProgress from '@mui/material/CircularProgress';
import QRScanner from '../index';
import LoadingProgress from 'src/Components/LoadingProgress';
import eventApi from 'src/api/eventApi';
import trainingScheduleApi from 'src/api/trainingScheduleApi';

function CheckAttendanceDate() {
    const [attendanceDateStatus, setAttendanceDateStatus] = useState(false);
    const [typeOfActivity, setTypeOfActivity] = useState(0);

    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState([]);
    const currentDate = moment(new Date()).format('DD/MM/YYYY');

    const fetchCommonScheduleByDate = async (date) => {
        try {
            const response = await adminAttendanceAPI.getCommonSessionByDate(date);
            console.log('fetchCommonScheduleByDate', response);
            if (response.data.length !== 0) {
                setAttendanceDateStatus(true);
                setLoading(false);
                setTypeOfActivity(response.data[0].type);
            } else {
                setAttendanceDateStatus(false);
                setLoading(false);
            }
        } catch (error) {
            console.log('failed when fetchCommonScheduleByDate', error);
        }
    };

    const fetchEventSessionByDate = async (date) => {
        try {
            const response = await eventApi.getEventByDate(date);
            console.log('fetchEventSessionByDate', response);
            if (response.data.length !== 0) {
                console.log('fetchEventSessionByDate', response.data);
                setActivity(response.data);
            }
        } catch (error) {
            console.log('failed when fetchEventSessionByDate', error);
        }
    };
    const fetchTrainingSessionByDate = async (date) => {
        try {
            const response = await trainingScheduleApi.getTrainingSessionByDate(date);
            console.log('fetchTrainingSessionByDate', response);
            if (response.data.length !== 0) {
                console.log('fetchTrainingSessionByDate', response.data);

                setActivity(response.data);
            }
        } catch (error) {
            console.log('failed when fetchTrainingSessionByDate', error);
        }
    };

    useEffect(() => {
        fetchCommonScheduleByDate(currentDate);
        fetchEventSessionByDate(currentDate);
        fetchTrainingSessionByDate(currentDate);
    }, [currentDate]);
    useEffect(() => {
        const now = new Date();
        let setupTime = localStorage.getItem('setupTime');
        if (setupTime == null) {
            localStorage.setItem('setupTime', now);
        } else {
            if (now - new Date(setupTime) > 1 * 60 * 60 * 1000) {
                localStorage.removeItem('attendanced');
                localStorage.removeItem('setupTime');
                localStorage.setItem('setupTime', now);
            }
        }
        console.log('test', now - new Date(setupTime));
    }, []);
    return (
        // <Box sx={{ display: 'flex', height: '100%', width: '100wh', alignItems: 'center', justifyContent: 'center' }}>
        <Fragment>
            <Box>
                {loading ? (
                    <LoadingProgress />
                ) : attendanceDateStatus ? (
                    activity[0] && <QRScanner activityData={activity[0]} activityType={typeOfActivity} />
                ) : (
                    'Hôm nay không có hoạt động cần điểm danh!'
                )}
            </Box>
        </Fragment>
    );
}

export default CheckAttendanceDate;
