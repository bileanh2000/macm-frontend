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

    const getListTournamentBySemester = async (params) => {
        try {
            const response = await adminTournamentAPI.getAllTournament(params);
            setTouraments(response.data);
            // setTotal(response.totalPage);
            // setPageSize(response.pageSize);
            console.log('hahahaah', response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    console.log(tournaments);

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
        getListTournamentBySemester(semester);
    }, [semester]);

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
        <Box>
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
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Typography variant="h3">Quản lý giải đấu</Typography>
                </Grid>
                <Grid item xs={4}>
                    {/* <Button component={Link} to="./create" sx={{ float: 'right', marginRight: 10 }}>
                        Tạo giải đấu
                    </Button> */}
                    <Button
                        variant="outlined"
                        sx={{ maxHeight: '50px', minHeight: '50px' }}
                        component={Link}
                        to={'./create'}
                        startIcon={<AddCircle />}
                    >
                        Tạo giải đấu
                    </Button>
                </Grid>
            </Grid>
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
                                    </div>
                                    <div>
                                        <Button component={Link} to={`${tournament.id}/admin`}>
                                            Danh sách ban tổ chức
                                        </Button>
                                        <Button component={Link} to={`${tournament.id}/members`}>
                                            Danh sách vận động viên
                                        </Button>
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

export default Tournament;
