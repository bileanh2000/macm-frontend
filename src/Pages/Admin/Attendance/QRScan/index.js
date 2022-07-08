import React, { Fragment, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import { QrReader } from 'react-qr-reader';
import qrSuccessSound from './Sound/off.mp3';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import { Box } from '@mui/system';

function QRScanner() {
    const [attendanceMessages, setAttendanceMessages] = useState('');
    const [qrStatus, setQrStatus] = useState(true);
    const audioPlayer = useRef(null);

    const takeAttendance = async (studentId, status) => {
        try {
            const response = await adminAttendanceAPI.takeAttendance(studentId, status);
            console.log('diem danh thanh cong', response);
        } catch (error) {
            console.log('error at attendance', error);
        }
    };

    const onQrSuccess = (result, error) => {
        if (!!result) {
            audioPlayer.current.play();
            try {
                let JSONResult = JSON.parse(result?.text);
                if (JSONResult.studentId !== undefined) {
                    setAttendanceMessages(
                        'Điểm danh cho "' + JSONResult.studentId + ' - ' + JSONResult.studentName + '" thành công!',
                    );
                    setQrStatus(true);
                } else {
                    setAttendanceMessages('Mã QR không hợp lệ');
                    setQrStatus(false);
                }

                takeAttendance(JSONResult.studentId, 1);
            } catch (error) {
                setAttendanceMessages('Mã QR không hợp lệ');
                setQrStatus(false);
            }
        }
        if (!!error) {
            console.info(error);
        }
    };
    return (
        <Fragment>
            <audio ref={audioPlayer} src={qrSuccessSound} />
            <QrReader
                constraints={{
                    facingMode: 'environment',
                }}
                onResult={(result, error) => {
                    onQrSuccess(result, error);
                    // if (!!result) {
                    //     audioPlayer.current.play();
                    //     setData(result?.text);
                    // }

                    // if (!!error) {
                    //     console.info(error);
                    // }
                }}
                style={{ width: '100%' }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 1,
                    ...(qrStatus ? { color: '#00c851' } : { color: '#ff4444' }),
                }}
            >
                {attendanceMessages.length !== 0 ? (
                    qrStatus ? (
                        <CheckCircleRoundedIcon sx={{ fontSize: '2.5rem', mb: 1 }} />
                    ) : (
                        <ErrorRoundedIcon sx={{ fontSize: '2.5rem', mb: 1 }} />
                    )
                ) : (
                    ''
                )}
                <Typography sx={{ fontWeight: 500 }}>{attendanceMessages}</Typography>
            </Box>
        </Fragment>
    );
}

export default QRScanner;
