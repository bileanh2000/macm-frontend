import { Alert, Grid, Pagination, Snackbar, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './EventFee.module.scss';
import { Link, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const events = [
    {
        id: 1,
        status: 'on going',
        title: 'Team building tam đảo',
        fee: 100000,
        time: '31/05/2022',
    },
    {
        id: 2,
        status: 'closed',
        title: 'Nhậu đầu kỳ',
        fee: 100000,
        time: '31/05/2022',
    },
    {
        id: 3,
        status: 'closed',
        title: 'Teambuilding Ba Vì',
        fee: 100000,
        time: '31/05/2022',
    },
];

function ListEventsFee() {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const history = useNavigate();
    //Paging
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);

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
        if (row.status != 'closed') {
            history(
                {
                    pathname: `/admin/clubfee/event/${row.id}`,
                },
                { state: { event: row } },
            );
        } else {
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
            <Typography variant="h3" className={cx('event-header')}>
                Danh sách sự kiện
            </Typography>
            <div className={cx('event-container')}>
                {events.map((row, index) => (
                    <div className={cx('event-item')} key={index} onClick={() => handleClickEvent(row)}>
                        <Grid container spacing={2} style={{ alignItems: 'center', marginTop: 1 }}>
                            <Grid item xs={2}>
                                {row.status}
                            </Grid>
                            <Grid item xs={6}>
                                {row.title}
                            </Grid>
                            <Grid item xs={2}>
                                {row.fee}
                            </Grid>
                            <Grid item xs={2}>
                                {row.time}
                            </Grid>
                        </Grid>
                    </div>
                ))}
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
