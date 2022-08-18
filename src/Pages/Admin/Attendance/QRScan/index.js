import React, { Fragment, useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import { QrReader } from 'react-qr-reader';
import qrSuccessSound from './Sound/off.mp3';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import { Box } from '@mui/system';
import userApi from 'src/api/userApi';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const LIMIT_TIME = 1; //HOURS
const TIME_OUT = 100000; //ms

function QRScanner({ activityData, activityType }) {
    const { enqueueSnackbar } = useSnackbar();
    const [attendanceMessages, setAttendanceMessages] = useState('');
    const [qrStatus, setQrStatus] = useState(true);
    const [isSessionTime, setIsSessionTime] = useState(true);
    const [test, setTest] = useState('null');
    const audioPlayer = useRef(null);
    const now = new Date();
    const [tabHasFocus, setTabHasFocus] = useState(true);

    const handleClickVariant = (message, variant) => () => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    useEffect(() => {
        const handleFocus = () => {
            console.log('Tab has focus');
            setTabHasFocus(true);
        };

        const handleBlur = () => {
            console.log('Tab lost focus');
            setTabHasFocus(false);
            // handleClickVariant('chuyển quả thẻ này để quét QR code', 'warning');
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSessionTime(false);
            console.log('Initial timeout!');
        }, TIME_OUT);

        return () => clearTimeout(timer);
    }, []);

    // useEffect(() => {
    //     let setupTime = localStorage.getItem('setupTime');
    //     if (setupTime == null) {
    //         localStorage.setItem('setupTime', now);
    //     } else {
    //         if (now - new Date(setupTime) > LIMIT_TIME * 60 * 60 * 1000) {
    //             localStorage.removeItem('attendanced');
    //             localStorage.removeItem('setupTime');
    //             localStorage.setItem('setupTime', now);
    //         }
    //     }
    //     console.log('test', now - new Date(setupTime));
    // }, [now]);

    const reload = () => {
        window.location.reload();
    };
    const takeAttendance = async (studentId) => {
        try {
            let response;
            if (!activityType) {
                response = await adminAttendanceAPI.takeAttendance(studentId, activityData.id, 1);
                if (response.data.length === 0) {
                    enqueueSnackbar(response.message, { variant: 'warning' });
                    return;
                }
            } else {
                response = await adminAttendanceAPI.takeAttendanceEvent(activityData.event.id, studentId, 1);
                if (response.data.length === 0) {
                    enqueueSnackbar(response.message, { variant: 'warning' });
                    return;
                }
            }
            // const response = await userApi.updateUserStatus(studentId);

            let localData = [];

            localData = JSON.parse(localStorage.getItem('attendanced')) || [];
            if (localData.length === 0) {
                localData.push(response.data[0]);
            } else {
                localData.map((item) => {
                    if (item.studentId !== response.data[0].studentId) {
                        return localData.push(response.data[0]);
                    } else {
                        return 0;
                    }
                });
            }

            localStorage.setItem('attendanced', JSON.stringify(localData));

            if (response.data.length !== 0) {
                enqueueSnackbar(
                    'Điểm danh cho ' + response.data[0].studentId + ' - ' + response.data[0].name + ' thành công',
                    {
                        variant: 'success',
                    },
                );
            }
            console.log('data', localData);
            console.log('diem danh thanh cong', response);

            setTest(response.data);
        } catch (error) {
            console.log('error at attendance', error);
        }
    };

    const onQrSuccess = (result, error) => {
        if (!!result) {
            audioPlayer.current.play();

            try {
                let JSONResult = JSON.parse(result?.text);
                let attendancedLocal = JSON.parse(localStorage.getItem('attendanced')) || [];

                let checkStudentId = attendancedLocal.filter(
                    (value, index, self) => index === self.findIndex((t) => t.studentId === value.studentId),
                );

                if (attendancedLocal.filter((item) => item.studentId === JSONResult.studentId).length !== 0) {
                    checkStudentId.filter((item) => {
                        if (item.studentId === JSONResult.studentId) {
                            console.log('da diem danh: ', item.studentId);
                            enqueueSnackbar(item.studentId + ' - ' + item.name + ' đã được điểm danh!', {
                                variant: 'warning',
                                preventDuplicate: true,
                            });
                        }
                    });

                    // setTest('Đã điểm danh cho thằng ' + JSONResult.studentId + 'rồi!');
                } else if (JSONResult.studentId !== undefined) {
                    takeAttendance(JSONResult.studentId);
                } else {
                    enqueueSnackbar('Mã QR không hợp hệ', {
                        variant: 'error',
                    });
                }
            } catch (error) {
                enqueueSnackbar('Mã QR không hợp lệ', {
                    variant: 'warning',
                });
                console.log(error);
                // setAttendanceMessages('Mã QR không hợp lệ');
                // setQrStatus(false);
            }
        }
        if (!!error) {
            console.info(error);
        }
    };

    const handleReset = () => {
        reload();
    };
    return (
        <Fragment>
            {/* {activityData.id}
            {activityType} */}
            <Dialog
                open={!isSessionTime}
                onClose={handleReset}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Hết thời gian sử dụng</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Reset lại tab này để tiếp tục quét QRCode
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReset}>Reset</Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h6" color="initial" sx={{ lineHeight: 1 }}>
                Điểm danh cho buổi tập ngày: {moment(now).format('DD/MM/YYYY')}
            </Typography>
            {/* <button onClick={handleClickVariant('hehehe', 'success')}>hien len di dmm</button> */}

            <audio ref={audioPlayer} src={qrSuccessSound} />
            {isSessionTime ? (
                tabHasFocus ? (
                    <QrReader
                        scanDelay={2000}
                        constraints={{
                            facingMode: 'environment',
                        }}
                        onResult={(result, error) => {
                            onQrSuccess(result, error);
                        }}
                        style={{ width: '100%' }}
                    />
                ) : (
                    <Typography variant="h5" color="initial">
                        Chuyển sang thẻ này để quét QRCode
                    </Typography>
                )
            ) : (
                <Typography variant="h5" color="initial">
                    Hết thời gian sử dụng, vui lòng reset lại tab này
                </Typography>
            )}

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
            {/* <Typography variant="body1" color="initial">
                {JSON.stringify(test)}
            </Typography> */}
        </Fragment>
    );
}

export default QRScanner;
