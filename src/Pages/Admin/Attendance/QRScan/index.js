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
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import qrReader from './qrReader.css';

const LIMIT_TIME = 1; //HOURS
const TIME_OUT = 10000000; //ms

let stompClient = null;

export function ViewFinder() {
    return (
        // <svg
        //     width="50px"
        //     viewBox="0 0 100 100"
        //     style={{
        //         top: '0px',
        //         left: '0px',
        //         zIndex: 1,
        //         boxSizing: 'border-box',
        //         border: '50px solid rgba(0, 0, 0, 0.4)',
        //         position: 'absolute',
        //         width: '100%',
        //         height: '100%',
        //     }}
        // >
        //     <path fill="none" d="M13,0 L0,0 L0,13" stroke="rgba(255, 0, 0, 0.5)" strokeWidth="5"></path>
        //     <path fill="none" d="M0,87 L0,100 L13,100" stroke="rgba(255, 0, 0, 0.5)" strokeWidth="5"></path>
        //     <path fill="none" d="M87,100 L100,100 L100,87" stroke="rgba(255, 0, 0, 0.5)" strokeWidth="5"></path>
        //     <path fill="none" d="M100,13 L100,0 87,0" stroke="rgba(255, 0, 0, 0.5)" strokeWidth="5"></path>
        // </svg>
        <>
            <svg
                className="app__scanner-img"
                width="310"
                height="310"
                viewBox="0 0 215 215"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                // xmlns:xlink="http://www.w3.org/1999/xlink"
                // throwIfNamespace:false
                style={{
                    top: '0px',
                    left: '0px',
                    zIndex: 2,
                    boxSizing: 'border-box',
                    border: '50px solid rgba(0, 0, 0, 0.4)',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }}
            >
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Artboard" transform="translate(-146.000000, -58.000000)" fill="#3298fc" fillRule="nonzero">
                        <g id="scanner" transform="translate(146.000000, 58.000000)">
                            <path
                                d="M169.272388,200.559701 L169.272388,194.141791 L169.272388,200.559701 Z M206.977612,169.272388 L213.395522,169.272388 L206.977612,169.272388 Z M197.751866,196.548507 L195.386866,194.380056 L197.751866,196.548507 Z M177.294776,215 C182.766045,215 188.646455,214.846772 193.977332,213.800653 C199.295373,212.757743 204.460187,210.752948 208.139254,206.739347 L203.409254,202.402444 C201.047463,204.977631 197.426959,206.583713 192.741884,207.503078 C188.07125,208.420037 182.731549,208.58209 177.294776,208.58209 L177.294776,215 Z M208.139254,206.739347 C211.515877,203.057071 213.159664,197.946007 214.013246,192.871045 C214.876455,187.740728 215,182.195653 215,177.294776 L208.58209,177.294776 C208.58209,182.153134 208.452127,187.240933 207.684384,191.806474 C206.907015,196.426567 205.543209,200.074347 203.409254,202.402444 L208.139254,206.739347 L208.139254,206.739347 Z M200.559701,37.7052239 L194.141791,37.7052239 L200.559701,37.7052239 Z M196.548507,9.22574627 L194.380056,11.5907463 L196.548507,9.22574627 Z M215,37.7052239 C215,32.2339552 214.846772,26.3535448 213.800653,21.0226679 C212.757743,15.7046269 210.752948,10.5398134 206.739347,6.86074627 L202.402444,11.5907463 C204.977631,13.9525373 206.583713,17.573041 207.503078,22.2581157 C208.420037,26.9295522 208.58209,32.2684515 208.58209,37.7052239 L215,37.7052239 Z M206.739347,6.86074627 C203.057071,3.48412313 197.946007,1.84033582 192.871045,0.986753731 C187.740728,0.123544776 182.195653,5.32907052e-15 177.294776,5.32907052e-15 L177.294776,6.41791045 C182.153134,6.41791045 187.240933,6.54787313 191.806474,7.31561567 C196.426567,8.09298507 200.074347,9.45759328 202.402444,11.5915485 L206.739347,6.86074627 Z M6.41791045,169.272388 L12.8358209,169.272388 L6.41791045,169.272388 Z M37.7052239,206.977612 L37.7052239,213.395522 L37.7052239,206.977612 Z M10.4291045,197.751866 L12.597556,195.386866 L10.4291045,197.751866 Z M-2.39808173e-14,177.294776 C-2.39808173e-14,182.766045 0.152425373,188.646455 1.19934701,193.977332 C2.24225746,199.295373 4.24705224,204.460187 8.26065299,208.139254 L12.597556,203.409254 C10.0223694,201.047463 8.41628731,197.426959 7.49692164,192.741884 C6.57996269,188.07125 6.41791045,182.731549 6.41791045,177.294776 L-2.39808173e-14,177.294776 Z M8.26065299,208.139254 C11.9429291,211.515877 17.0539925,213.159664 22.1289552,214.013246 C27.2600746,214.876455 32.8051493,215 37.7052239,215 L37.7052239,208.58209 C32.8468657,208.58209 27.7590672,208.452127 23.1943284,207.684384 C18.5734328,206.907015 14.925653,205.543209 12.597556,203.409254 L8.26065299,208.139254 L8.26065299,208.139254 Z M37.7052239,6.41791045 L37.7052239,12.8358209 L37.7052239,6.41791045 Z M9.22574627,10.4291045 L11.5907463,12.597556 L9.22574627,10.4291045 Z M37.7052239,0 C32.2339552,0 26.3535448,0.152425373 21.0226679,1.19934701 C15.7046269,2.24225746 10.5398134,4.24705224 6.86074627,8.26065299 L11.5907463,12.597556 C13.9525373,10.0223694 17.573041,8.41628731 22.2581157,7.49692164 C26.9295522,6.57996269 32.2684515,6.41791045 37.7052239,6.41791045 L37.7052239,0 Z M6.86074627,8.26065299 C3.48412313,11.9429291 1.84033582,17.0539925 0.986753731,22.1289552 C0.123544776,27.2600746 -1.42108547e-14,32.8051493 -1.42108547e-14,37.7052239 L6.41791045,37.7052239 C6.41791045,32.8468657 6.54787313,27.7590672 7.31561567,23.1943284 C8.09298507,18.5734328 9.45759328,14.925653 11.5915485,12.597556 L6.86074627,8.26065299 Z"
                                id="Shape"
                            ></path>
                        </g>
                    </g>
                </g>
            </svg>
            <div className="custom-scanner" style={{ display: 'block' }}></div>
        </>
    );
}
function QRScanner({ activityData, activityType }) {
    const { enqueueSnackbar } = useSnackbar();
    const [attendanceMessages, setAttendanceMessages] = useState('');
    const [qrStatus, setQrStatus] = useState(true);
    const [isSessionTime, setIsSessionTime] = useState(true);
    const [test, setTest] = useState('null');
    const audioPlayer = useRef(null);
    const now = new Date();
    const [tabHasFocus, setTabHasFocus] = useState(true);
    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;
    const [attendanceList, setAttendanceList] = useState([]);
    const attendance = JSON.parse(localStorage.getItem('attendanced')) || [];

    const handleClickVariant = (message, variant) => () => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };
    const connect = () => {
        let Sock = new SockJS('https://capstone-project-macm.herokuapp.com/ws');
        stompClient = over(Sock);
        // stompClient.connect({}, onConnected, onError);
        stompClient.connect(
            {},
            function (frame) {
                console.log('Connected: ' + frame);
                setTimeout(function () {
                    onConnected();
                }, 1000);
            },
            onError,
        );
    };
    const onConnected = () => {
        // setUserData({...userData,"connected": true});
        // stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe(`/user/${studentId}/private`, onMessageReceived);
        // userJoin();
    };

    const onError = (err) => {
        console.log(err);
    };

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        console.log(payload.body);
        console.log(payloadData);
    };

    const testSend = (data) => {
        var chatMessage = {
            senderName: studentId,
            receiverName: data.studentId,
            ...(data.status === 0 ? { message: 'Vắng mặt' } : { message: 'Bạn đã được điểm danh hôm nay!' }),

            status: 'MESSAGE',
        };
        stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
    };

    useEffect(() => {
        connect();
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            console.log('Tab has focus');
            setTabHasFocus(true);
        };

        const handleBlur = () => {
            console.log('Tab lost focus');
            setTabHasFocus(true);
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
                testSend(response.data[0]);

                if (response.data.length === 0) {
                    enqueueSnackbar(response.message, { variant: 'warning' });
                    return;
                }
            } else {
                response = await adminAttendanceAPI.takeAttendanceEvent(activityData.event.id, studentId, 1);
                testSend(response.data[0]);

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
                // setAttendanceList([...response.data[0], ...attendanceList]);
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
    let listAttendance = [];
    const testPushMessages = () => {
        let random = Math.random() * 10;
        let a = [
            { te: '1', u: 'q' },
            { te: '2', u: 'e' },
            { te: '3', u: 'r' },
            { te: '4', u: 't' },
            { te: '5', u: 'w' },
            { te: '6', u: 'a' },
        ];

        // a.map((i) => listAttendance.push(i));
        // listAttendance.push({ name: 'hehe', id: random });
        // console.log(listAttendance);
        setAttendanceList([...a, ...attendanceList]);
    };

    useEffect(() => {
        console.log(attendanceList);
    }, [attendanceList]);

    const userTestData = [
        { id: 1, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 2, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 3, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 4, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 5, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 6, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 7, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 8, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 9, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 10, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 11, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 12, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 13, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 14, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 15, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
        { id: 16, studentId: 'HE141277', name: 'Lê Anh Tuấn' },
    ];
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
            {!activityType ? (
                <Typography variant="h6" color="initial" sx={{ lineHeight: 1, mb: 1 }}>
                    Điểm danh cho buổi tập ngày: {moment(now).format('DD/MM/YYYY')}
                </Typography>
            ) : (
                <Typography variant="h6" color="initial" sx={{ lineHeight: 1, mb: 1 }}>
                    Điểm danh cho sự kiện {activityData.event.name}
                </Typography>
            )}

            {/* <button onClick={handleClickVariant('hehehe', 'success')}>hien len di dmm</button> */}

            <audio ref={audioPlayer} src={qrSuccessSound} />
            {isSessionTime ? (
                tabHasFocus ? (
                    <QrReader
                        ViewFinder={ViewFinder}
                        className="qr-image-wrapper"
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
            {/* <button onClick={testPushMessages}>test hehe</button> */}
            {/* <Box>{JSON.stringify(attendanceList)}</Box> */}
            <Box>
                <Typography sx={{ mt: 1 }}>Đã điểm danh cho: {attendance.length} người</Typography>
                <Box sx={{ height: '30vh', overflow: 'auto' }}>
                    <ul>
                        {attendance.map((user) => {
                            return (
                                <li key={user.id}>
                                    {user.studentId} - {user.name}
                                </li>
                            );
                        })}
                    </ul>
                </Box>
                {/* {JSON.stringify(attendance)} */}
            </Box>
            {/* <Box
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
            </Box> */}

            {/* <Typography variant="body1" color="initial">
                {JSON.stringify(test)}
            </Typography> */}
        </Fragment>
    );
}

export default QRScanner;
