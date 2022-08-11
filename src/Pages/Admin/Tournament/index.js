import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
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
import { AddCircle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';

import adminTournamentAPI from 'src/api/adminTournamentAPI';
import semesterApi from 'src/api/semesterApi';
import moment from 'moment';
import TournamentItem from './TournamentItem';
import trainingScheduleApi from 'src/api/trainingScheduleApi';
import CreateTournament from './CreateTournament/CreateTournament';

function Tournament() {
    const [tournaments, setTournaments] = useState();
    const [semester, setSemester] = useState('Summer2022');
    const [semesterList, setSemesterList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openClosedTournament, setOpenClosedTournament] = useState(false);
    const [tournamentOnclick, setTournamentOnclick] = useState({ name: '', id: '' });
    const [status, setStatus] = useState(0);
    const [commonList, setCommonList] = useState([]);
    const calendarComponentRef = useRef(null);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [suggestionRole, setSuggestionRole] = useState([]);

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    const calendarFilter = (date) => {
        let calApi = calendarComponentRef.current.getApi();
        calApi.gotoDate(date);
    };

    const getAllSuggestionRole = async () => {
        try {
            const response = await adminTournamentAPI.getAllSuggestionRole();
            console.log(response);
            setSuggestionRole(response.data);
        } catch (error) {
            console.warn('Failed to get all suggestion role', error);
        }
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

    const fetchCommonScheduleBySemester = async () => {
        try {
            const response = await trainingScheduleApi.commonSchedule();
            console.log('Thanh cong roi: ', response);
            let eventSchedule = response.data.filter((event) => event.type === 2);
            setCommonList(eventSchedule);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };
    const scheduleData = commonList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.title;
        container['display'] = 'background';
        container['type'] = item.type;

        container['backgroundColor'] = '#ccffe6';

        return container;
    });

    useEffect(() => {
        getListTournamentBySemester(semester, status);
        fetchCommonScheduleBySemester();
    }, [semester, status]);

    useEffect(() => {
        fetchSemester();
        getAllSuggestionRole();
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
                            .map((tournament) => <TournamentItem key={tournament.id} data={tournament} />)
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
            <CreateTournament
                title="Tạo giải đấu"
                roles={suggestionRole}
                isOpen={openDialogCreate}
                handleClose={() => {
                    setOpenDialogCreate(false);
                }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                    Danh sách giải đấu
                </Typography>

                <Button
                    variant="outlined"
                    sx={{ maxHeight: '50px', minHeight: '50px' }}
                    // component={Link}
                    // to={'./create'}
                    startIcon={<AddCircle />}
                    onClick={() => {
                        setOpenDialogCreate(true);
                    }}
                >
                    Tạo giải đấu
                </Button>
            </Box>
            <Divider />
            <Box sx={{ m: 2 }}>
                <TextField
                    id="outlined-select-currency"
                    select
                    size="small"
                    label="Chọn kỳ"
                    value={semester}
                    onChange={handleChange}
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
                    label="Trạng thái giải đấu"
                    value={status}
                    onChange={handleChangeStatus}
                    sx={{ minWidth: '10rem' }}
                >
                    <MenuItem value={0}>Tất cả</MenuItem>
                    <MenuItem value={2}>Đang diễn ra</MenuItem>
                    <MenuItem value={3}>Sắp diễn ra</MenuItem>
                </TextField>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    {tournaments && tournaments.length === 0 ? (
                        <Typography variant="h5" sx={{ textAlign: 'center', mt: 3 }}>
                            KHÔNG CÓ GIẢI ĐẤU NÀO
                        </Typography>
                    ) : (
                        ''
                    )}
                    {tournaments ? (
                        <Box>
                            {tournaments.filter((t) => t.status === 2).length > 0 ? (
                                <Paper elevation={1} sx={{ backgroundColor: '#fcfeff', p: 2 }}>
                                    <Typography variant="body1">Giải đấu đang diễn ra</Typography>
                                    <Divider />
                                    {tournaments
                                        .filter((t) => t.status === 2)
                                        .map((tournament) => (
                                            <TournamentItem key={tournament.id} data={tournament} />
                                        ))}
                                </Paper>
                            ) : (
                                ''
                            )}

                            {tournaments.filter((t) => t.status === 3).length > 0 ? (
                                <Paper elevation={1} sx={{ backgroundColor: '#fcfeff', p: 2 }}>
                                    <Typography variant="body1">Giải đấu sắp tới</Typography>
                                    <Divider />
                                    {tournaments
                                        .filter((t) => t.status === 3)
                                        .map((tournament) => (
                                            <TournamentItem key={tournament.id} data={tournament} />
                                        ))}
                                </Paper>
                            ) : (
                                ''
                            )}
                            {status == 0 && (
                                <Button sx={{ float: 'right', m: 1 }} onClick={handleOpenDialogTournament}>
                                    Các giải đấu đã kết thúc
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <Typography sx={{ textAlign: 'center' }}>Hiện đang không có giải đấu nào</Typography>
                    )}
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper elevation={1} sx={{ height: '80vh', p: 1 }}>
                        <FullCalendar
                            // initialDate={new Date(2022, month - 1, 1)}
                            // {...(semester!==2?(initialDate: '2022-10-01'):{})}
                            // initialDate={semester !== 2 ? new Date('2022-10-01') : new Date()}
                            locale="vie"
                            height="100%"
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            // events={[
                            //     {
                            //         id: 1,
                            //         title: 'Teambuiding Tam đảo 18:00-19:00',
                            //         start: '2022-06-24',
                            //         end: '2022-06-27',
                            //         // display: 'background',
                            //         // textColor: 'white',
                            //         // backgroundColor: '#5ba8f5',
                            //         classNames: ['test-css'],
                            //     },
                            // ]}
                            events={scheduleData}
                            weekends={true}
                            headerToolbar={{
                                left: 'title',
                                center: 'dayGridMonth,dayGridWeek',
                                right: 'prev next today',
                                // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                            }}
                            // editable={true}
                            // selectable={true}
                            // datesSet={(dateInfo) => {
                            //     getMonthInCurrentTableView(dateInfo.start);
                            // }}
                            // eventClick={(args) => {
                            //     navigateToUpdate(args.event, args.event.start);
                            //     // console.log(args);
                            // }}
                            dateClick={function (arg) {
                                // console.log(arg.dateStr);
                                // navigateToCreate(arg.dateStr);
                                // swal({
                                //     title: 'Date',
                                //     text: arg.dateStr,
                                //     type: 'success',
                                // });
                            }}
                            ref={calendarComponentRef}
                            // selectable
                            // select={handleEventAdd}
                            // eventDrop={(e) => console.log(e)}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Tournament;
