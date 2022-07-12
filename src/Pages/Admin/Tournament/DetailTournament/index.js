import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
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
import { Controller, useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

function DetailTournament() {
    let { tournamentId } = useParams();
    const [tournament, setTournament] = useState([]);
    const [active, setActive] = useState(0);
    const [scheduleList, setScheduleList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    let navigate = useNavigate();

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const fetchAdminInTournament = async (params) => {
        try {
            const response = await adminTournamentAPI.getAllTournamentOrganizingCommittee(params);
            console.log(response);
            setActive(response.totalActive);
        } catch (error) {
            console.log('Failed to fetch admin list: ', error);
        }
    };

    const getTournamentById = async (tournamentId) => {
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
        getTournamentById(tournamentId);
        fetchAdminInTournament(tournamentId);
        fetchTournamentSchedule(tournamentId);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
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

    const { control } = useForm({});

    const handleDelete = useCallback(
        (id) => () => {
            handleCloseDialog();
            setTimeout(() => {
                adminTournamentAPI.deleteTournament(id).then((res) => {
                    console.log('delete', res);
                    console.log('delete', res.data);
                    navigate(-1);
                });
            });
        },
        [],
    );

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
                                    variant="h4"
                                    gutterBottom
                                    component="div"
                                    sx={{ fontWeight: 500, marginBottom: 2 }}
                                >
                                    Thông tin giải đấu "{item.name}"
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
                                    <Button variant="outlined" startIcon={<Edit />} component={Link} to={`tournamentbracket`}>
                                        Xem thông tin bảng đấu đối kháng
                                    </Button>
                                </Box>
                            </Box>
                            <Grid container columns={12} sx={{ mt: 2 }} spacing={2}>
                                <Grid item xs={7}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Tên giải đấu"
                                        variant="outlined"
                                        defaultValue={item.name}
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        margin="normal"
                                    />
                                    <TextField
                                        id="outlined-multiline-flexible"
                                        name="description"
                                        label="Nội dung"
                                        defaultValue={item.description}
                                        multiline
                                        rows={4}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Controller
                                        name="cost"
                                        variant="outlined"
                                        control={control}
                                        defaultValue={item.totalAmountEstimate}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <NumberFormat
                                                name="totalAmount"
                                                customInput={TextField}
                                                label="Tổng chi phí tổ chức"
                                                thousandSeparator={true}
                                                variant="outlined"
                                                defaultValue={item.totalAmountEstimate}
                                                value={value}
                                                onValueChange={(v) => {
                                                    onChange(Number(v.value));
                                                }}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
                                                }}
                                                // error={invalid}
                                                helperText={invalid ? error.message : null}
                                                fullWidth
                                                margin="normal"
                                            />
                                        )}
                                    />
                                    <Grid container columns={12} spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                type="number"
                                                id="outlined-basic"
                                                label="Số người dự kiến tham gia ban tổ chức"
                                                variant="outlined"
                                                fullWidth
                                                defaultValue={item.maxQuantityComitee}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                type="number"
                                                id="outlined-basic"
                                                label="Số người trong ban tổ chức hiện tại"
                                                variant="outlined"
                                                fullWidth
                                                defaultValue={active}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                margin="normal"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                                        <Grid item xs={6}>
                                            <Controller
                                                name="amountPerRegister"
                                                variant="outlined"
                                                control={control}
                                                defaultValue={item.feePlayerPay}
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error, invalid },
                                                }) => (
                                                    <NumberFormat
                                                        name="amountPerRegister"
                                                        customInput={TextField}
                                                        label="Số tiền mỗi người chơi cần phải đóng"
                                                        thousandSeparator={true}
                                                        variant="outlined"
                                                        defaultValue={item.feePlayerPay}
                                                        value={value}
                                                        onValueChange={(v) => {
                                                            onChange(Number(v.value));
                                                        }}
                                                        InputProps={{
                                                            readOnly: true,
                                                            endAdornment: (
                                                                <InputAdornment position="end">vnđ</InputAdornment>
                                                            ),
                                                        }}
                                                        error={invalid}
                                                        helperText={invalid ? error.message : null}
                                                        fullWidth
                                                        margin="normal"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Controller
                                                name="amountPerAdmin"
                                                variant="outlined"
                                                control={control}
                                                defaultValue={item.feeOrganizingCommiteePay}
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error, invalid },
                                                }) => (
                                                    <NumberFormat
                                                        name="amountPerAdmin"
                                                        customInput={TextField}
                                                        label="Số tiền thành viên ban tổ chức cần phải đóng"
                                                        thousandSeparator={true}
                                                        variant="outlined"
                                                        defaultValue={item.feeOrganizingCommiteePay}
                                                        value={value}
                                                        onValueChange={(v) => {
                                                            onChange(Number(v.value));
                                                        }}
                                                        InputProps={{
                                                            readOnly: true,
                                                            endAdornment: (
                                                                <InputAdornment position="end">vnđ</InputAdornment>
                                                            ),
                                                        }}
                                                        // error={invalid}
                                                        helperText={invalid ? error.message : null}
                                                        fullWidth
                                                        margin="normal"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
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
                                                                <TableCell align="center">
                                                                    {data.gender === 1 ? 'Nam' : 'Nữ'}
                                                                </TableCell>
                                                                <TableCell align="center">
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
                                                                <TableCell align="center">{data.name}</TableCell>
                                                                <TableCell align="center">
                                                                    {data.numberFemale}
                                                                </TableCell>
                                                                <TableCell align="center">{data.numberMale}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </div>
                                </Grid>
                                <Grid item xs={5} sx={{ minHeight: '755px' }}>
                                    <FullCalendar
                                        // initialDate={new Date('2022-09-01')}
                                        initialDate={scheduleData[0] && new Date(scheduleData[0].date)}
                                        locale="vie"
                                        height="60%"
                                        plugins={[dayGridPlugin, interactionPlugin]}
                                        defaultView="dayGridMonth"
                                        events={scheduleData}
                                        weekends={true}
                                        headerToolbar={{
                                            left: 'title',
                                            center: 'dayGridMonth,dayGridWeek',
                                            right: 'prev next',
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
