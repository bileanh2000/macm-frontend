import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import QRScanner from '../index';

function CheckAttendanceDate() {
    const [attendanceDateStatus, setAttendanceDateStatus] = useState(false);
    const currentDate = moment(new Date()).format('DD/MM/YYYY');
    const fetchCommonScheduleByDate = async (date) => {
        try {
            const response = await adminAttendanceAPI.getCommonSessionByDate(date);
            console.log('commonschedulebydate', response);
            if (response.data.length !== 0) {
                setAttendanceDateStatus(true);
            } else {
                setAttendanceDateStatus(false);
            }
        } catch (error) {
            console.log('failed when fetchCommonScheduleByDate', error);
        }
    };

    useEffect(() => {
        fetchCommonScheduleByDate(currentDate);
    });
    return attendanceDateStatus ? <QRScanner /> : 'Hôm nay đéo có hoạt động cần điểm danh nhé nhé';
}

export default CheckAttendanceDate;
