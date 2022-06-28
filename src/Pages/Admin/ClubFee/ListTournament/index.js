import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { Delete, Edit, AddCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './ListTournament.module.scss';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import semesterApi from 'src/api/semesterApi';
import moment from 'moment';

const cx = classNames.bind(styles);

function ListTournament() {
    const [tournaments, setTournaments] = useState();
    const [semester, setSemester] = useState('Summer2022');
    const [semesterList, setSemesterList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [tournamentOnclick, setTournamentOnclick] = useState({ name: '', id: '' });

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const getListTournamentBySemester = async (params) => {
        try {
            const response = await adminTournamentAPI.getAllTournament(params);
            console.log(response.data);
            setTournaments(response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };

    const fetchSemester = async () => {
        try {
            const response = await semesterApi.getTop3Semester();
            setSemesterList(response.data);
        } catch (error) {
            console.log('That bai roi huhu, semester: ', error);
        }
    };

    useEffect(() => {
        getListTournamentBySemester(semester);
    }, [semester]);

    useEffect(() => {
        fetchSemester();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                    Danh sách giải đấu
                </Typography>
            </Box>
            <Box>
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
            </Box>
            {tournaments && tournaments.length === 0 ? (
                <Typography variant="h5" sx={{ textAlign: 'center', mt: 3 }}>
                    KHÔNG CÓ GIẢI ĐẤU NÀO TRONG KỲ
                </Typography>
            ) : (
                ''
            )}
            <Box component="div">
                {tournaments ? (
                    tournaments.map((tournament) => {
                        return (
                            <li key={tournament.id}>
                                <div className={cx('tournaments')}>
                                    <div>
                                        <Box component={Link} to={`${tournament.id}`}>
                                            <div className={cx('tournament-list')}>
                                                <div className={cx('tournament-status')}>
                                                    {/* <p className={cx('upcoming')}> */}
                                                    {tournament.status === 'Chưa diễn ra' ? (
                                                        <p className={cx('upcoming')}>Sắp diễn ra</p>
                                                    ) : tournament.status === 'Đang diễn ra' ? (
                                                        <p className={cx('going-on')}>Đang diễn ra</p>
                                                    ) : (
                                                        <p className={cx('closed')}>Đã kết thúc</p>
                                                    )}
                                                </div>
                                                <div className={cx('tournament-title')}>
                                                    Tên giải đấu: {tournament.name}
                                                </div>
                                                <div className={cx('tournament-title')}>
                                                    Tổng chi phí tổ chức:{' '}
                                                    {tournament.totalAmount.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </div>
                                                <div className={cx('tournament-title')}>
                                                    Chi phí mỗi người phải đóng:{' '}
                                                    {tournament.amount_per_register.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </div>
                                                <div className={cx('tournament-date')}>
                                                    Thời gian diễn ra:{' '}
                                                    {moment(new Date(tournament.startDate)).format('DD/MM/yyyy')}
                                                </div>
                                            </div>
                                        </Box>
                                    </div>
                                </div>
                            </li>
                        );
                    })
                ) : (
                    <Typography sx={{ textAlign: 'center' }}>Hiện đang không có giải đấu nào</Typography>
                )}
            </Box>
        </Box>
    );
}

export default ListTournament;
