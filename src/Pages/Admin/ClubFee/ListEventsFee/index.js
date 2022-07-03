import {
    Alert,
    Box,
    Grid,
    IconButton,
    MenuItem,
    Pagination,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Delete, Edit } from '@mui/icons-material';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';

import styles from './EventFee.module.scss';
import adminClubFeeAPI from 'src/api/adminClubFeeAPI';
import adminFunAPi from 'src/api/adminFunAPi';
import eventApi from 'src/api/eventApi';
import semesterApi from 'src/api/semesterApi';

const cx = classNames.bind(styles);

function ListEventsFee() {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const history = useNavigate();
    const [funClub, setFunClub] = useState('');
    //Paging
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [semester, setSemester] = useState('Summer2022');
    const [monthInSemester, setMonthInSemester] = useState([]);
    const [month, setMonth] = useState(0);
    const [semesterList, setSemesterList] = useState([]);
    const [events, setEvents] = useState([]);

    const fetchFunClub = async () => {
        try {
            const response = await adminFunAPi.getClubFund();
            console.log(response.data[0].fundAmount);
            setFunClub(response.data[0].fundAmount);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const getListEventsBySemester = async (month, page, semester) => {
        try {
            const response = await eventApi.getEventBySemester(month, page, semester);
            setEvents(response.data);
            console.log('getListEventsBySemester', response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    // console.log(events);
    const fetchMonthInSemester = async (semester) => {
        try {
            const response = await eventApi.getMonthsBySemester(semester);
            setMonthInSemester(response.data);
            console.log('monthsInSemester', response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSemester = async () => {
        try {
            const response = await semesterApi.getTop3Semester();
            console.log('Thanh cong roi, semester: ', response);
            setSemesterList(response.data);
        } catch (error) {
            console.log('That bai roi huhu, semester: ', error);
        }
    };

    useEffect(() => {
        fetchFunClub();
        fetchSemester();
    }, []);

    useEffect(() => {
        fetchMonthInSemester(semester);
        getListEventsBySemester(month, page - 1, semester);
    }, [semester, month, page]);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleChangeSemester = (event) => {
        setSemester(event.target.value);
    };

    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    // const handleClickEvent = (row) => {
    //     console.log(row);
    //     if (row.status === 'Chưa diễn ra' || row.status === 'Đang diễn ra') {
    //         history(
    //             {
    //                 pathname: `/admin/clubfee/event/${row.id}`,
    //             },
    //             { state: { event: row } },
    //         );
    //     } else {
    //         history(
    //             {
    //                 pathname: `/admin/clubfee/event/${row.id}`,
    //             },
    //             { state: { event: row, view: true } },
    //         );
    //         setOpenSnackBar(true);
    //         dynamicAlert(false, 'Event đã kết thúc');
    //     }
    // };

    return (
        <div>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleCloseSnackBar}
                    variant="filled"
                    severity={customAlert.severity || 'success'}
                    sx={{ width: '100%' }}
                >
                    {customAlert.message}
                </Alert>
            </Snackbar>
            <div className={cx('event-container')}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                        Danh sách sự kiện
                    </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <TextField
                        id="outlined-select-currency"
                        select
                        size="small"
                        label="Chọn kỳ"
                        value={semester}
                        onChange={handleChangeSemester}
                        sx={{ mr: 2 }}
                    >
                        {semesterList.map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="outlined-select-currency"
                        select
                        size="small"
                        label="Chọn tháng"
                        value={month}
                        onChange={(e) => {
                            setMonth(e.target.value);
                        }}
                    >
                        <MenuItem value={0}>Tất cả</MenuItem>
                        {monthInSemester.map((option) => (
                            <MenuItem key={option} value={option}>
                                Tháng {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Typography
                        variant="h6"
                        gutterBottom
                        component="div"
                        sx={{ fontWeight: 500, marginBottom: 2, float: 'right' }}
                    >
                        Số dư câu lạc bộ hiện tại:{' '}
                        {funClub.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '80%' }}>
                        {events && events.length === 0 ? (
                            <Typography variant="h5" sx={{ textAlign: 'center', mt: 3 }}>
                                KHÔNG CÓ SỰ KIỆN NÀO
                            </Typography>
                        ) : (
                            ''
                        )}
                        <ul>
                            {events &&
                                events.map((item) => {
                                    return (
                                        <li
                                            key={item.id}
                                            // onClick={() => handleClickEvent(item)}
                                        >
                                            <div className={cx('events')}>
                                                <Box component={Link} to={`${item.id}`}>
                                                    <div className={cx('event-list')}>
                                                        <div className={cx('event-status')}>
                                                            {/* <p className={cx('upcoming')}> */}
                                                            {item.status === 'Chưa diễn ra' ? (
                                                                <p className={cx('upcoming')}>Sắp diễn ra</p>
                                                            ) : item.status === 'Đang diễn ra' ? (
                                                                <p className={cx('going-on')}>Đang diễn ra</p>
                                                            ) : (
                                                                <p className={cx('closed')}>Đã kết thúc</p>
                                                            )}
                                                        </div>
                                                        <div className={cx('event-title')}>{item.name}</div>
                                                        <div className={cx('event-amount')}>
                                                            {item.amountPerMemberRegister.toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })}
                                                        </div>
                                                        <div className={cx('event-date')}>
                                                            {moment(new Date(item.startDate)).format('DD/MM/yyyy')}
                                                        </div>
                                                    </div>
                                                </Box>
                                            </div>
                                        </li>
                                    );
                                })}
                        </ul>
                        <Box>
                            {events && Math.floor(events.length / 5) + 1 > 1 && (
                                <Pagination
                                    count={events && Math.floor(events.length / 5) + 1}
                                    // count={3}
                                    page={page}
                                    color="primary"
                                    sx={{ display: 'flex', mt: 4, justifyContent: 'flex-end' }}
                                    onChange={(event, value) => setPage(value)}
                                />
                            )}
                        </Box>
                    </Box>
                </Box>
            </div>
        </div>
    );
}

export default ListEventsFee;
