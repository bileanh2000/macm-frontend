import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import MemberEvent from '../Event/MenberEvent';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import GroupIcon from '@mui/icons-material/Group';

function EventDetail() {
    let { id } = useParams();
    const [event, setEvent] = useState([]);
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
                eventApi.deleteEvent(id).then((res) => {
                    // setEvents((prev) => prev.filter((item) => item.id !== id));
                    console.log('delete', res);
                    console.log('delete', res.data);
                    navigate(-1);
                });
            });
        },
        [],
    );

    const getListEvents = async () => {
        try {
            // const params = { name: 'Đi chùa' };
            const response = await eventApi.getAll();
            // setEvent(response.data);
            let selectedEvent = response.data.filter((item) => item.id === parseInt(id, 10));
            setEvent(selectedEvent);
            console.log(event);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    const fetchEventSchedule = async (params) => {
        try {
            const response = await eventApi.getEventScheduleByEvent(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };
    useEffect(() => {
        fetchEventSchedule(id);
    }, [id]);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.event.name + ' - ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';

        return container;
    });
    useEffect(() => {
        getListEvents();
        console.log(event);
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
                    <Button onClick={handleDelete(id)} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>

            {/* {scheduleList.map((item) => { */}
            {/* return ( */}
            {scheduleList[0] && (
                <Fragment key={scheduleList[0].id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                            Thông tin sự kiện "{scheduleList[0].event.name}"
                        </Typography>
                        <Box>
                            <Button
                                variant="outlined"
                                component={Link}
                                to={`../admin/events/${id}/members`}
                                startIcon={<GroupIcon />}
                                sx={{ mr: 1 }}
                            >
                                Xem danh sách thành viên tham gia
                            </Button>

                            {new Date(scheduleList[0].date) > new Date() ? (
                                <Fragment>
                                    <Button variant="outlined" startIcon={<EditIcon />} component={Link} to={`edit`}>
                                        Chỉnh sửa thông tin
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleOpenDialog}
                                        sx={{ ml: 1 }}
                                    >
                                        Xóa sự kiện
                                    </Button>
                                </Fragment>
                            ) : (
                                ''
                            )}
                        </Box>
                    </Box>
                    <Grid container columns={12} sx={{ mt: 2 }}>
                        <Grid item xs={5}>
                            <Box sx={{ marginTop: '16px' }}>
                                <div>
                                    <Typography variant="h6">
                                        <strong>Số người ban tổ chức: </strong>
                                        {scheduleList[0].event.maxQuantityComitee}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="h6">
                                        <strong>Tổng chi phí dự kiến: </strong>
                                        {scheduleList[0].event.totalAmount.toLocaleString('en-US')} VND
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="h6">
                                        <strong>Dự kiến số tiền mỗi người phải đóng: </strong>
                                        {scheduleList[0].event.amount_per_register.toLocaleString('en-US')} VND
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="h6">
                                        <strong>Nội dung: </strong>
                                        <p>{scheduleList[0].event.description}</p>
                                    </Typography>
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={7} sx={{ minHeight: '755px' }}>
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
                                    right: 'prev next today',
                                    // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Fragment>
            )}

            {/* ); */}
            {/* })} */}
            {/* <MemberEvent /> */}
        </Fragment>
    );
}

export default EventDetail;
