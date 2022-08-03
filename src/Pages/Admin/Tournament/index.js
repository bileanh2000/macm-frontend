import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { Delete, Edit, AddCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from '../Tournament/Tournament.module.scss';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import semesterApi from 'src/api/semesterApi';
import moment from 'moment';

const cx = classNames.bind(styles);

function Tournament() {
    const [tournaments, setTournaments] = useState();
    const [semester, setSemester] = useState('Summer2022');
    const [semesterList, setSemesterList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openClosedTournament, setOpenClosedTournament] = useState(false);
    const [tournamentOnclick, setTournamentOnclick] = useState({ name: '', id: '' });
    const [status, setStatus] = useState(0);

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    const getListTournamentBySemester = async (params, status) => {
        try {
            const response = await adminTournamentAPI.getAllTournament(params, status);
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

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleOpenDialogTournament = () => {
        setOpenClosedTournament(true);
    };

    const handleCloseDialogTournament = () => {
        setOpenClosedTournament(false);
    };

    const handleDelete = useCallback(
        (id) => () => {
            handleCloseDialog();
            setTimeout(() => {
                // const params = { studentId: id, semester: semester };
                adminTournamentAPI.deleteTournament(id).then((res) => {
                    setTournaments((prev) => prev.filter((item) => item.id !== id));
                    console.log('delete', res);
                    console.log('delete', res.data);
                });
            });
        },
        [],
    );

    return (
        <Box sx={{ m: 1, p: 1 }}>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Bạn muốn xóa sự kiện "${tournamentOnclick.name}"?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        "{tournamentOnclick.name}" sẽ được xóa khỏi danh sách sự kiện!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Từ chối</Button>
                    <Button onClick={handleDelete(tournamentOnclick.id)} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openClosedTournament}
                onClose={handleCloseDialogTournament}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="alert-dialog-title">Sự kiện đã kết thúc</DialogTitle>
                <DialogContent>
                    {tournaments && tournaments.filter((t) => t.status === 1).length > 0 ? (
                        tournaments
                            .filter((t) => t.status === 1)
                            .map((tournament) => (
                                <Paper elevation={3} key={tournament.id}>
                                    <Box component={Link} to={`${tournament.id}`}>
                                        <div className={cx('tournament-list')}>
                                            <div className={cx('tournament-status')}>
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
                            ))
                    ) : (
                        <DialogContentText>Không có sự kiện đã kết thúc</DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogTournament} autoFocus>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                    Quản lý giải đấu
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ maxHeight: '50px', minHeight: '50px' }}
                    component={Link}
                    to={'./create'}
                    startIcon={<AddCircle />}
                >
                    Tạo giải đấu
                </Button>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 2 }}>
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
            <Container maxWidth="lg">
                {tournaments ? (
                    <Box>
                        {tournaments.filter((t) => t.status === 2).length > 0 ? (
                            <Paper sx={{ backgroundColor: '#fcfeff', p: 2 }}>
                                <Typography variant="body1">Giải đấu đang diễn ra</Typography>
                                <Divider />
                                {tournaments
                                    .filter((t) => t.status === 2)
                                    .map((tournament) => (
                                        <Paper elevation={3} key={tournament.id}>
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
                                    ))}
                            </Paper>
                        ) : (
                            ''
                        )}

                        {tournaments.filter((t) => t.status === 3).length > 0 ? (
                            <Paper sx={{ backgroundColor: '#fcfeff', p: 2 }}>
                                <Typography variant="body1">Giải đấu sắp tới</Typography>
                                <Divider />
                                {tournaments
                                    .filter((t) => t.status === 3)
                                    .map((tournament) => (
                                        <Paper elevation={3} key={tournament.id}>
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
                                    ))}
                            </Paper>
                        ) : (
                            ''
                        )}
                        {status == 0 && (
                            <Button sx={{ float: 'right', m: 1 }} onClick={handleOpenDialogTournament}>
                                Các sự kiện đã kết thúc
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Typography sx={{ textAlign: 'center' }}>Hiện đang không có giải đấu nào</Typography>
                )}
            </Container>
        </Box>
    );
}

export default Tournament;
