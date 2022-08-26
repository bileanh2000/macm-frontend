import { Box, Divider, styled, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import clsx from 'clsx';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import adminAttendanceAPI from 'src/api/adminAttendanceAPI';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
function TakeAttendance() {
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(40);
    const [eventId, setEventId] = useState(0);
    const location = useLocation();
    const [scheduleId, setScheduleId] = useState(0);
    const history = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [title, setTitle] = useState('');
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;
    // const [attendanceResponse, setAttendanceResponse] = useState([]);

    const _type = location.state?.type;
    const _trainingScheduleId = location.state?.id;
    const _nowDate = location.state?.date;

    let attendance = userList.reduce((attendaceCount, user) => {
        return user.status == 1 ? attendaceCount + 1 : attendaceCount;
    }, 0);

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

    const getAttendanceByStudentId = async () => {
        try {
            // const response = await adminAttendanceAPI.getAttendanceByStudentId(_trainingScheduleId);
            // setUserList(response.data);
            // console.log('get from database', response.data);
            // adminAttendanceAPI.getTrainingSessionByDate(_nowDate).then((res) => {
            //     // setActivityId(res.data[0].id);
            //     adminAttendanceAPI.checkAttendanceByScheduleId(res.data[0].id).then((res) => {
            //         setUserList(res.data);
            //         // setTotalActive(res.totalActive);
            //         // setTotalResult(res.totalResult);
            //     });
            // });
            let response;
            if (_type == 0) {
                adminAttendanceAPI.getTrainingSessionByDate(_nowDate).then((res) => {
                    setTitle('buổi tập');
                    setScheduleId(res.data[0].id);
                    adminAttendanceAPI.checkAttendanceByScheduleId(res.data[0].id).then((res) => {
                        setUserList(res.data);
                        // setAttendanceResponse(res.data[0]);
                    });
                });
            }
            if (_type == 1) {
                adminAttendanceAPI.getEventSessionByDate(_nowDate).then((res) => {
                    setTitle(res.data[0].event.name);
                    setEventId(res.data[0].event.id);
                    adminAttendanceAPI.getAttendanceByEventId(res.data[0].event.id).then((res) => {
                        setUserList(res.data);

                        // setAttendanceResponse(res.data[0]);
                    });
                });
            }
        } catch (error) {
            console.log('Không thể lấy dữ liệu người dùng tham gia điểm danh. Error: ', error);
        }
    };

    useEffect(() => {
        getAttendanceByStudentId();
    }, []);

    const columns = [
        { field: 'id', headerName: 'Số thứ tự', flex: 0.5 },
        { field: 'name', headerName: 'Tên', flex: 0.8 },
        { field: 'studentId', headerName: 'Mã sinh viên', width: 150, flex: 0.6 },
        {
            field: 'status',
            headerName: 'Trạng thái',
            flex: 0.5,
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('status-rows', {
                    active: params.value === 'Có mặt',
                    deactive: params.value === 'Vắng mặt',
                    subActive: params.value === 'Chưa điểm danh',
                });
            },
        },
        {
            field: 'Attend',
            type: 'actions',
            headerName: 'Có mặt',
            width: 50,
            flex: 0.3,
            cellClassName: 'actions',
            getActions: (params) => {
                if (params.row.status == 'Có mặt') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonChecked />}
                            label="Có mặt"
                            onClick={() => toggleStatus(params.row.studentId, 1)}
                            color="primary"
                            aria-details="Có mặt"
                        />,
                    ];
                } else if (params.row.status == 'Vắng mặt') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Có mặt"
                            onClick={() => toggleStatus(params.row.studentId, 1)}
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Có mặt"
                        onClick={() => toggleStatus(params.row.studentId, 1)}
                    />,
                ];
            },
        },
        {
            field: 'Absent',
            type: 'actions',
            headerName: 'Vắng mặt',
            width: 50,
            flex: 0.3,
            cellClassName: 'actions',
            getActions: (params) => {
                if (params.row.status == 'Có mặt') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Vắng mặt"
                            onClick={() => toggleStatus(params.row.studentId, 0)}
                        />,
                    ];
                } else if (params.row.status == 'Vắng mặt') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonChecked />}
                            label="Vắng mặt"
                            onClick={() => toggleStatus(params.row.studentId, 0)}
                            color="primary"
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Vắng mặt"
                        onClick={() => toggleStatus(params.row.studentId, 0)}
                        color="primary"
                    />,
                ];
            },
        },
    ];

    const columnsMobile = [
        { field: 'id', headerName: 'STT', width: 5 },
        { field: 'studentId', headerName: 'Mã sinh viên', width: 100 },
        { field: 'name', headerName: 'Tên', width: 150 },
        {
            field: 'Attend',
            type: 'actions',
            headerName: 'Có mặt',
            width: 70,
            // flex: 0.3,
            cellClassName: 'actions',
            getActions: (params) => {
                if (params.row.status == 'Có mặt') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonChecked />}
                            label="Có mặt"
                            onClick={() => toggleStatus(params.row.studentId, 1)}
                            color="primary"
                            aria-details="Có mặt"
                        />,
                    ];
                } else if (params.row.status == 'Vắng mặt') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Có mặt"
                            onClick={() => toggleStatus(params.row.studentId, 1)}
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Có mặt"
                        onClick={() => toggleStatus(params.row.studentId, 1)}
                    />,
                ];
            },
        },
        {
            field: 'Absent',
            type: 'actions',
            headerName: 'Vắng mặt',
            width: 80,
            // flex: 0.3,
            cellClassName: 'actions',
            getActions: (params) => {
                if (params.row.status == 'Có mặt') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonUnchecked />}
                            label="Vắng mặt"
                            onClick={() => toggleStatus(params.row.studentId, 0)}
                        />,
                    ];
                } else if (params.row.status == 'Vắng mặt') {
                    return [
                        <GridActionsCellItem
                            icon={<RadioButtonChecked />}
                            label="Vắng mặt"
                            onClick={() => toggleStatus(params.row.studentId, 0)}
                            color="primary"
                        />,
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<RadioButtonUnchecked />}
                        label="Vắng mặt"
                        onClick={() => toggleStatus(params.row.studentId, 0)}
                        color="primary"
                    />,
                ];
            },
        },
    ];

    const rowsUser = userList.map((item, index) => {
        const container = {};
        container['id'] = index + 1;
        container['name'] = item.name;
        container['studentId'] = item.studentId;
        container['status'] = item.status == 0 ? 'Vắng mặt' : item.status == 1 ? 'Có mặt' : 'Chưa điểm danh';
        return container;
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    const onSubmit = () => {
        history({ pathname: '/admin/attendance' }, { state: { id: _trainingScheduleId, date: _nowDate } });
    };

    const takeAttend = async (id, trainingScheduleId, status) => {
        try {
            const response = await adminAttendanceAPI.takeAttendance(id, trainingScheduleId, status);
            enqueueSnackbar(response.message, { variant: 'success' });
            testSend(response.data[0]);
        } catch (error) {
            console.log('Không thể điểm danh, error: ', error);
        }
    };

    const takeAttendanceEvent = async (eventId, id, status) => {
        try {
            const response = await adminAttendanceAPI.takeAttendanceEvent(eventId, id, status);
            enqueueSnackbar(response.message, { variant: 'success' });
            testSend(response.data[0]);
        } catch (error) {
            console.log('Không thể điểm danh, error: ', error);
        }
    };

    const toggleStatus = (id, status) => {
        if (_type == 0) {
            takeAttend(id, scheduleId, status);
        }
        if (_type == 1) {
            takeAttendanceEvent(eventId, id, status);
        }

        const newUserList = userList.map((user) => {
            return user.studentId === id ? { ...user, status: status } : user;
        });
        console.log(newUserList);
        setUserList(newUserList);
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
                <Box
                    sx={{
                        p: 0.5,
                        pb: 0,
                    }}
                >
                    <GridToolbarQuickFilter />
                </Box>
                <Typography variant="body1">
                    Số người tham gia điểm danh {attendance}/{userList.length}
                </Typography>
            </GridToolbarContainer>
        );
    }

    const StyledGridOverlay = styled('div')(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '& .ant-empty-img-1': {
            fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
        },
        '& .ant-empty-img-2': {
            fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
        },
        '& .ant-empty-img-3': {
            fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
        },
        '& .ant-empty-img-4': {
            fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
        },
        '& .ant-empty-img-5': {
            fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
            fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
        },
    }));
    function CustomNoRowsOverlay() {
        return (
            <StyledGridOverlay>
                <svg width="120" height="100" viewBox="0 0 184 152" aria-hidden focusable="false">
                    <g fill="none" fillRule="evenodd">
                        <g transform="translate(24 31.67)">
                            <ellipse className="ant-empty-img-5" cx="67.797" cy="106.89" rx="67.797" ry="12.668" />
                            <path
                                className="ant-empty-img-1"
                                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                            />
                            <path
                                className="ant-empty-img-2"
                                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                            />
                            <path
                                className="ant-empty-img-3"
                                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                            />
                        </g>
                        <path
                            className="ant-empty-img-3"
                            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                        />
                        <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                        </g>
                    </g>
                </svg>
                <Box sx={{ mt: 1 }}>Danh sách trống</Box>
            </StyledGridOverlay>
        );
    }

    return (
        <Box sx={{}}>
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Điểm danh {_type == 0 ? title : 'sự kiện ' + title} ngày: {_nowDate}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* <button type="button" onClick={() => connect()}>
                connect
            </button> */}
            {/* <button type="button" onClick={() => testSend()}>
                test send
            </button> */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Box
                    sx={{
                        height: '70vh',
                        width: '100%',
                        '& .status-rows': {
                            // justifyContent: 'center !important',
                            // minHeight: '0px !important',
                            // maxHeight: '35px !important',
                            // borderRadius: '100px',
                            // position: 'relative',
                            // top: '9px',
                        },
                        '& .status-rows.active .MuiDataGrid-cellContent': {
                            backgroundColor: '#56f000',
                            color: '#fff',
                            fontWeight: '600',
                            textAlign: 'center',
                            padding: 1,
                            borderRadius: 5,
                        },
                        '& .status-rows.deactive .MuiDataGrid-cellContent': {
                            backgroundColor: '#ff3838',
                            color: '#fff',
                            fontWeight: '600',
                            textAlign: 'center',
                            padding: 1,
                            borderRadius: 5,
                        },
                        '& .status-rows.subActive .MuiDataGrid-cellContent': {
                            backgroundColor: '#cfb2b2',
                            color: '#fff',
                            fontWeight: '600',
                            textAlign: 'center',
                            padding: 1,
                            borderRadius: 5,
                        },
                    }}
                >
                    <DataGrid
                        // loading={!userList.length}
                        disableSelectionOnClick={true}
                        rows={rowsUser}
                        columns={matches ? columns : columnsMobile}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[40, 60, 80]}
                        components={{
                            Toolbar: CustomToolbar,
                            NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                    />
                </Box>
                {/* <Button type="submit" variant="outline">
                    Quay lại
                </Button> */}
            </Box>
        </Box>
    );
}

export default TakeAttendance;
