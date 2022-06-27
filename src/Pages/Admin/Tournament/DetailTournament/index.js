import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useCallback, useState, Fragment, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import GroupIcon from '@mui/icons-material/Group';
import adminTournamentAPI from 'src/api/adminTournamentAPI';

function DetailTournament() {
    let { tournamentId } = useParams();
    const [tournament, setTournament] = useState([]);
    const [eventName, setEventName] = useState();
    const [scheduleList, setScheduleList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    let navigate = useNavigate();

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
                    // setEvents((prev) => prev.filter((item) => item.id !== id));
                    console.log('delete', res);
                    console.log('delete', res.data);
                    navigate(-1);
                });
            });
        },
        [],
    );

    const getTournamentById = async () => {
        try {
            const response = await adminTournamentAPI.getTournamentById(tournamentId);
            console.log(response.data);
            setTournament(response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    const fetchTournamentSchedule = async (params) => {
        try {
            const response = await adminTournamentAPI.getTournamentSchedule(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };
    useEffect(() => {
        fetchTournamentSchedule(tournamentId);
    }, [tournamentId]);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] =
            item.tournament.name + ' - ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';

        return container;
    });
    useEffect(() => {
        getTournamentById();
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, []);

    return (
        <Fragment>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Bạn muốn xóa sự kiện này ?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Sự kiện sẽ được xóa khỏi hệ thống !
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                    <Button onClick={handleDelete(tournamentId)} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            {tournament &&
                tournament.map((item) => {
                    return (
                        <Fragment key={item.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    component="div"
                                    sx={{ fontWeight: 500, marginBottom: 2 }}
                                >
                                    Thông tin sự kiện "{item.name}"
                                </Typography>
                                <Box>
                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        to={`../admin/tournament/${tournamentId}/admin`}
                                        startIcon={<GroupIcon />}
                                        sx={{ mr: 1 }}
                                    >
                                        Xem danh sách ban tổ chức
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        to={`../admin/tournament/${tournamentId}/members`}
                                        startIcon={<GroupIcon />}
                                        sx={{ mr: 1 }}
                                    >
                                        Xem danh sách thành viên tham gia
                                    </Button>
                                    <Button variant="outlined" startIcon={<Edit />} component={Link} to={`update`}>
                                        Chỉnh sửa thông tin
                                    </Button>
                                    {item.status === 'Chưa diễn ra' ? (
                                        <Button
                                            variant="outlined"
                                            startIcon={<Delete />}
                                            onClick={handleOpenDialog}
                                            sx={{ ml: 1 }}
                                        >
                                            Xóa sự kiện
                                        </Button>
                                    ) : (
                                        ''
                                    )}
                                </Box>
                            </Box>
                            <Grid container columns={12} sx={{ mt: 2 }} spacing={2}>
                                <Grid item xs={4}>
                                    <Box sx={{ marginTop: '16px' }}>
                                        <div>
                                            <Typography variant="h6">
                                                <strong>Nội dung: </strong>
                                                <p>{item.description}</p>
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="h6">
                                                <strong>Số thành viên ban tổ chức:</strong> {item.maxQuantityComitee}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="h6">
                                                <strong>Tổng chi phí: </strong>{' '}
                                                {item.totalAmount.toLocaleString('en-US')} vnđ
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="h6">
                                                <strong>Số tiền mỗi người phải đóng: </strong>
                                                {item.amount_per_register.toLocaleString('en-US')} vnđ
                                            </Typography>
                                        </div>

                                        <div>
                                            {item.competitiveTypes.length > 0 && (
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Typography variant="h6">
                                                        <strong>Thi đấu đối kháng: </strong>
                                                    </Typography>
                                                    <Table stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="center">Giới tính</TableCell>
                                                                <TableCell align="center">Hạng cân</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {item.competitiveTypes.map((data) => (
                                                                <TableRow key={data.id}>
                                                                    <TableCell>
                                                                        {data.gender == 1 ? 'Nam' : 'Nữ'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {data.weightMin} - {data.weightMax} Kg
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            )}
                                        </div>
                                        <div>
                                            {item.exhibitionTypes.length > 0 && (
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Typography variant="h6">
                                                        <strong>Thi đấu biểu diễn: </strong>
                                                    </Typography>
                                                    <Table stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="center">Nội dung thi đấu</TableCell>
                                                                <TableCell align="center">Số lượng nữ</TableCell>
                                                                <TableCell align="center">Số lượng nam</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {item.exhibitionTypes.map((data) => (
                                                                <TableRow key={data.id}>
                                                                    <TableCell>{data.name}</TableCell>
                                                                    <TableCell align="center">
                                                                        {data.numberFemale}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {data.numberMale}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            )}
                                        </div>
                                    </Box>
                                </Grid>
                                <Grid item xs={8} sx={{ minHeight: '755px' }}>
                                    <FullCalendar
                                        locale="vie"
                                        height="60%"
                                        plugins={[dayGridPlugin, interactionPlugin]}
                                        initialView="dayGridMonth"
                                        events={scheduleData}
                                        weekends={true}
                                        headerToolbar={{
                                            left: 'title',
                                            center: 'dayGridMonth,dayGridWeek',
                                            right: 'prev next today',
                                            // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Fragment>
                    );
                })}
        </Fragment>
    );
}

export default DetailTournament;
