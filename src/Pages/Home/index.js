import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import React, { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Schedule from './Schedule/Schedule';
import PaymentNotification from './PaymentNotification';
import News from './News/News';

import { getAllRole } from 'src/Roles/index';
import { IfAllGranted, IfAuthorized } from 'react-authorization';
import ForbiddenPage from '../ForbiddenPage';
import UpNext from '../Admin/Home/UpNext';
import notificationApi from 'src/api/notificationApi';
import semesterApi from 'src/api/semesterApi';
import ActiveRegister from './ActiveRegister';
import userApi from 'src/api/userApi';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import { useSnackbar } from 'notistack';

let stompClient = null;
function Index() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
    const [isOpenActiveRegisterDialog, setIsOpenActiveRegisterDialog] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState([]);
    const [startDateOfCurrentSemester, setStartDateOfCurrentSemester] = useState([]);
    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;
    const [currentSemesterName, setCurrentSemesterName] = useState('');
    const [attendanceInfor, setAttendanceInfor] = useState([]);
    const [receiverSocket, setReceiverSocket] = useState({
        senderName: '',
        receiverName: '',
        message: '',
        status: '',
    });
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const roleId = JSON.parse(localStorage.getItem('currentUser')).role.id;

    const handleOpenNotificationDialog = () => {
        setOpenNotificationDialog(true);
    };
    const handleOpenActiveRegisterDialog = () => {
        setIsOpenActiveRegisterDialog(true);
    };
    const handleCloseNotificationDialog = () => {
        // setAlreadyVisited(false);
        localStorage.removeItem('toShowPopup');
        setOpenNotificationDialog(false);
    };

    /***
     * Socket connect
     */
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
        console.log(payloadData);
        // console.log(payloadData);
        setReceiverSocket(payloadData);
        enqueueSnackbar('Bạn đã được điểm danh', { variant: 'success' });
    };

    useEffect(() => {
        connect();
    }, []);

    const getCurrentSemester = async () => {
        try {
            const response = await semesterApi.getCurrentSemester();
            console.log('getCurrentSemester', response);
            setStartDateOfCurrentSemester(response.data[0].startDate);
            setCurrentSemesterName(response.data[0].name);
        } catch (error) {
            console.log('failed when getCurrentSemester', error);
        }
    };

    const fetchPaymentNotification = async (studentId) => {
        try {
            const response = await notificationApi.checkPaymentStatus(studentId);
            console.log('fetchPaymentNotification', response);
            setPaymentMessage(response.message);
        } catch (error) {
            console.log('failed when fetchPaymentNotification', error);
        }
    };

    const checkAttendanceStatusByStudentId = async (studentId) => {
        try {
            const response = await userApi.checkAttendanceStatusByStudentId(studentId);
            console.log('checkAttendanceStatusByStudentId', response);
            setAttendanceInfor(response.data);
        } catch (error) {
            console.log('failed when checkAttendanceStatusByStudentId', error);
        }
    };
    useEffect(() => {
        checkAttendanceStatusByStudentId(studentId);
    }, [receiverSocket, studentId]);
    // useEffect(() => {

    // }, [receiverSocket]);
    const getStatusWhenStartSemester = async (studentId) => {
        try {
            const response = await userApi.getStatusWhenStartSemester(studentId);
            console.log('fetchPaymentNotification', response);
            // let isClicked = response.data[0].clicked === true;
            if (!response.data[0].clicked) {
                handleOpenActiveRegisterDialog();
            }

            // setPaymentMessage(response.message);
        } catch (error) {
            console.log('failed when fetchPaymentNotification', error);
        }
    };
    useEffect(() => {
        getCurrentSemester();
        console.log(getAllRole);
        if (
            roleId === 1 ||
            roleId === 2 ||
            roleId === 3 ||
            roleId === 4 ||
            roleId === 5 ||
            roleId === 6 ||
            roleId === 7 ||
            roleId === 8 ||
            roleId === 9
        ) {
            setIsAdmin(true);
        } else {
            getStatusWhenStartSemester(studentId);
        }
        fetchPaymentNotification(studentId);

        let visited = localStorage['toShowPopup'] !== 'true';
        if (!visited) {
            handleOpenNotificationDialog();
        }
    }, [studentId, paymentMessage]);
    useEffect(() => {
        if (paymentMessage === 'Không có khoản nào phải đóng') {
            handleCloseNotificationDialog();
        }
    }, [paymentMessage]);

    return (
        <Fragment>
            <ActiveRegister
                isOpen={isOpenActiveRegisterDialog}
                handleClose={() => setIsOpenActiveRegisterDialog(false)}
                semester={currentSemesterName}
                studentId={JSON.parse(localStorage.getItem('currentUser')).studentId}
            />
            <Dialog
                open={openNotificationDialog}
                onClose={handleCloseNotificationDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description"></DialogContentText> */}
                    <PaymentNotification />
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={handleCloseNotificationDialog}>Disagree</Button> */}
                    <Button onClick={handleCloseNotificationDialog} autoFocus>
                        Thoát
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                {/* <Typography variant="h6">Bạn đéo cần phải đóng tiền kỳ này</Typography> */}
            </Box>
            <Grid container spacing={2}>
                <Grid item md={10} xs={12} order={{ md: 1, xs: 2 }}>
                    <Schedule />
                </Grid>
                <Grid item md={2} xs={12} order={{ md: 2, xs: 1 }}>
                    <Grid item md={12} sx={{ pl: 1, pr: 1 }}>
                        {!attendanceInfor.length ? (
                            <Box
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    backgroundColor: '#b3ecff',
                                    color: '#007399',
                                    borderRadius: '10px',
                                }}
                            >
                                Hôm nay không có hoạt động nào cần điểm danh !
                            </Box>
                        ) : attendanceInfor[0]?.status === 0 ? (
                            <Box
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    backgroundColor: '#ffcccc',
                                    color: '#e01441',
                                    borderRadius: '10px',
                                }}
                            >
                                Vắng mặt !
                            </Box>
                        ) : attendanceInfor[0]?.status === 1 ? (
                            <Box
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    backgroundColor: '#b9f8e2',
                                    color: '#0e8b5f',
                                    borderRadius: '10px',
                                }}
                            >
                                Bạn đã được điểm danh hôm nay !
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    backgroundColor: '#ffe8b3',
                                    color: '#996b00',
                                    borderRadius: '10px',
                                }}
                            >
                                Bạn chưa được điểm danh hôm nay !
                            </Box>
                        )}
                        {/* {receiverSocket.message === 'Bạn đã được điểm danh hôm nay!' ? (
                            <Box
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    backgroundColor: '#16ce8e',
                                    color: 'white',
                                }}
                            >
                                Bạn đã được điểm danh hôm nay!
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    backgroundColor: '#e01441',
                                    color: 'white',
                                }}
                            >
                                Vắng mặt!
                            </Box>
                        )} */}
                        {/* <Box
                            sx={{
                                p: 2,
                                mb: 2,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                backgroundColor: '#1f67ed',
                                color: 'white',
                            }}
                        >
                            Chưa điểm danh
                        </Box> */}
                    </Grid>
                    <Grid item md={12}>
                        <News
                            name={JSON.parse(localStorage.getItem('currentUser')).name}
                            studentId={JSON.parse(localStorage.getItem('currentUser')).studentId}
                            roleName={JSON.parse(localStorage.getItem('currentUser')).role.name}
                            email={JSON.parse(localStorage.getItem('currentUser')).email}
                            isAdmin={isAdmin}
                            isActive={JSON.parse(localStorage.getItem('currentUser')).active}
                        />
                    </Grid>
                    <Grid item md={12}>
                        <Paper sx={{ p: 2 }}>
                            <UpNext />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default Index;
