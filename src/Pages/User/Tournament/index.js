import React, { useEffect, useState } from 'react';
import { Box, Grid, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import moment from 'moment';

import styles from '../Tournament/Tournament.module.scss';
import semesterApi from 'src/api/semesterApi';
import userTournamentAPI from 'src/api/userTournamentAPI';

const cx = classNames.bind(styles);

function Tournament() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [tournaments, setTournaments] = useState();
    const [semester, setSemester] = useState('Summer2022');
    const [semesterList, setSemesterList] = useState([]);
    const [status, setStatus] = useState(0);

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    const getListTournamentBySemester = async (params, status) => {
        try {
            const response = await userTournamentAPI.getAllTournamentByStudentId(user.studentId, params, status);
            setTournaments(response.data);
            console.log('hahahaah', response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
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
        getListTournamentBySemester(semester, status);
    }, [semester, status]);

    useEffect(() => {
        fetchSemester();
    }, []);

    return (
        <Paper elevation={3}>
            <Box sx={{ m: 1, p: 1, height: '80vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                        Giải đấu
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField
                        id="outlined-select-currency"
                        select
                        size="small"
                        label="Chọn kỳ"
                        value={semester}
                        onChange={handleChange}
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
                        label="Trạng thái sự kiện"
                        value={status}
                        onChange={handleChangeStatus}
                    >
                        <MenuItem value={0}>Tất cả</MenuItem>
                        <MenuItem value={1}>Đã kết thúc</MenuItem>
                        <MenuItem value={2}>Đang diễn ra</MenuItem>
                        <MenuItem value={3}>Sắp diễn ra</MenuItem>
                    </TextField>
                </Box>
                {tournaments && tournaments.length === 0 ? (
                    <Typography variant="h5" sx={{ textAlign: 'center', mt: 3 }}>
                        KHÔNG CÓ GIẢI ĐẤU NÀO
                    </Typography>
                ) : (
                    ''
                )}
                <Grid container spacing={2}>
                    {tournaments ? (
                        tournaments.map((tournament) => {
                            return (
                                <Grid item xs={12} sm={6} key={tournament.id}>
                                    <Paper elevation={3}>
                                        <Box component={Link} to={`${tournament.id}`}>
                                            <div className={cx('tournament-list')}>
                                                <div className={cx('tournament-status')}>
                                                    {/* <p className={cx('upcoming')}> */}
                                                    {tournament.status === 3 ? (
                                                        <p className={cx('upcoming')}>Sắp diễn ra</p>
                                                    ) : tournament.status === 2 ? (
                                                        <p className={cx('going-on')}>Đang diễn ra</p>
                                                    ) : (
                                                        <p className={cx('closed')}>Đã kết thúc</p>
                                                    )}
                                                </div>
                                                <div className={cx('tournament-title')}>{tournament.name}</div>
                                                <div className={cx('tournament-date')}>
                                                    {moment(new Date(tournament.startDate)).format('DD/MM/yyyy')}
                                                </div>
                                            </div>
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        })
                    ) : (
                        <Typography sx={{ textAlign: 'center' }}>Hiện đang không có giải đấu nào</Typography>
                    )}
                </Grid>
            </Box>
        </Paper>
    );
}

export default Tournament;
