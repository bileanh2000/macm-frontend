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
    const [tournaments, setTouraments] = useState();
    const [semester, setSemester] = useState('Summer2022');
    const [semesterList, setSemesterList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
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
            setTouraments(response.data);
            // setTotal(response.totalPage);
            // setPageSize(response.pageSize);
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

    const handleDelete = useCallback(
        (id) => () => {
            handleCloseDialog();
            setTimeout(() => {
                // const params = { studentId: id, semester: semester };
                adminTournamentAPI.deleteTournament(id).then((res) => {
                    setTouraments((prev) => prev.filter((item) => item.id !== id));
                    console.log('delete', res);
                    console.log('delete', res.data);
                });
            });
        },
        [],
    );

    return (
        <Paper elevation={3}>
            <Box sx={{ m: 1, p: 1, height: '80vh' }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
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
                                <Grid item xs={12} sm={12} key={tournament.id}>
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
                                        <div className={cx('tournament-action')}>
                                            {tournament.status === 'Chưa diễn ra' ? (
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        handleOpenDialog();
                                                        setTournamentOnclick({
                                                            name: tournament.name,
                                                            id: tournament.id,
                                                        });
                                                        // handleDelete(item.id);
                                                    }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            ) : (
                                                ''
                                            )}

                                            <IconButton
                                                aria-label="edit"
                                                component={Link}
                                                to={`${tournament.id}/update`}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </div>
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
