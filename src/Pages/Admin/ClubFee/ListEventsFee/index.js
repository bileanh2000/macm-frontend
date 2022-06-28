import { Alert, Grid, Pagination, Snackbar, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './EventFee.module.scss';
import { useNavigate } from 'react-router-dom';
import adminClubFeeAPI from 'src/api/adminClubFeeAPI';
import adminFunAPi from 'src/api/adminFunAPi';

const cx = classNames.bind(styles);

function ListEventsFee() {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const history = useNavigate();
    const [funClub, setFunClub] = useState('');
    //Paging
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentSemester, setCurrentSemester] = useState();
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

    const getCurrentSemester = async () => {
        try {
            const response = await adminClubFeeAPI.getCurrentSemester();
            setCurrentSemester(response.data[0]);
        } catch (error) {
            console.log('Không thể lấy dữ liệu kì hiện tại, error: ', error);
        }
    };

    const getEventsBySemester = async (semesterName) => {
        try {
            const response = await adminClubFeeAPI.getEventBySemester(semesterName);
            console.log(response.data);
            setEvents(response.data);
        } catch (error) {
            console.log('Không thể lấy danh sách sự kiện, error: ', error);
        }
    };

    useEffect(() => {
        fetchFunClub();
        getCurrentSemester();
    }, []);

    useEffect(() => {
        if (currentSemester) {
            getEventsBySemester(currentSemester.id);
        }
    }, [currentSemester]);

    const handleChange = (event, value) => {
        setPage(value);
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

    const handleClickEvent = (row) => {
        console.log(row);
        if (row.status === 'Chưa diễn ra' || row.status === 'Đang diễn ra') {
            history(
                {
                    pathname: `/admin/clubfee/event/${row.id}`,
                },
                { state: { event: row } },
            );
        } else {
            history(
                {
                    pathname: `/admin/clubfee/event/${row.id}`,
                },
                { state: { event: row, view: true } },
            );
            setOpenSnackBar(true);
            dynamicAlert(false, 'Event đã kết thúc');
        }
    };

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
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="h3" className={cx('event-header')}>
                        Danh sách sự kiện
                    </Typography>
                </Grid>
                <Grid item xs={6} sx={{ float: 'right' }}>
                    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                        Số dư câu lạc bộ hiện tại: {funClub}
                    </Typography>
                </Grid>
            </Grid>

            <div className={cx('event-container')}>
                {events.length > 0 ? (
                    events.map((row, index) => (
                        <div className={cx('event-item')} key={index} onClick={() => handleClickEvent(row)}>
                            <Grid container spacing={2} style={{ alignItems: 'center', marginTop: 1 }}>
                                <Grid item xs={2}>
                                    {row.status}
                                </Grid>
                                <Grid item xs={6}>
                                    {row.name}
                                </Grid>
                                <Grid item xs={2}>
                                    {row.amountPerMemberRegister}
                                </Grid>
                                <Grid item xs={2}>
                                    {row.startDate}
                                </Grid>
                            </Grid>
                        </div>
                    ))
                ) : (
                    <Typography variant="h5" className={cx('event-header')}>
                        Hiện tại đang không có sự kiện nào
                    </Typography>
                )}

                {total > 1 && (
                    <Stack spacing={2}>
                        <Pagination count={total} page={page} onChange={handleChange} />
                    </Stack>
                )}
            </div>
        </div>
    );
}

export default ListEventsFee;
