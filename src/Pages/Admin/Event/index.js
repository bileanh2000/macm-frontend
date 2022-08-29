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
    Pagination,
    Paper,
    SpeedDial,
    SpeedDialAction,
    TextField,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styles from './Event.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import semesterApi from 'src/api/semesterApi';
import moment from 'moment';
import { AdminPanelSettings, EventSeatTwoTone, Settings } from '@mui/icons-material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EventItem from './EventItem';
import trainingScheduleApi from 'src/api/trainingScheduleApi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import AddEventDialog from './AddEventDialog';
import RolesSetting from './SettingEvent/Role/RolesSetting';

const cx = classNames.bind(styles);

function Event() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [events, setEvents] = useState([]);
    const [upComingEvents, setUpComingEvents] = useState([]);
    const [goingOnEvents, setGoingOnEvents] = useState([]);
    const [closedEvent, setClosedEvent] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [semester, setSemester] = useState('Summer2022');
    const [monthInSemester, setMonthInSemester] = useState([]);
    const [suggestionRole, setSuggestionRole] = useState([]);
    // const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [month, setMonth] = useState(0);
    const [semesterList, setSemesterList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [commonList, setCommonList] = useState([]);
    const [startDateOfSemester, setStartDateOfSemester] = useState();
    const calendarComponentRef = useRef(null);
    const [openSettingRole, setOpenSettingRole] = useState(false);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    let navigate = useNavigate();
    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const calendarFilter = (date) => {
        let calApi = calendarComponentRef.current.getApi();
        calApi.gotoDate(date);
    };
    const getStartDateBySemesterName = (name) => {
        let startDateBySemester = semesterList && semesterList.filter((item) => item.name === name);
        startDateBySemester[0] && setStartDateOfSemester(startDateBySemester[0].startDate);
    };
    const getListEventsBySemester = async (month, page, semester) => {
        try {
            const response = await eventApi.getEventBySemester(month, page, semester);
            let upComing = response.data.filter((event) => event.status === 'Chưa diễn ra');
            let goingOn = response.data.filter((event) => event.status === 'Đang diễn ra');
            let closed = response.data.filter((event) => event.status === 'Đã kết thúc');
            setEvents(response.data);
            setUpComingEvents(upComing);
            setGoingOnEvents(goingOn);
            setClosedEvent(closed);

            // setTotal(response.totalPage);
            // setPageSize(response.pageSize);
            console.log('getListEventsBySemester', response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    // console.log(events);
    const fetchMonthInSemester = async (semester) => {
        try {
            const response = await eventApi.getMonthsBySemester(semester);
            setMonthInSemester(response.data);
            console.log('monthsInSemester', response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllSuggestionRole = async () => {
        try {
            const response = await eventApi.getAllRoleEvent();
            const roles = response.data.map((role) => {
                return { ...role, maxQuantity: 5, selected: true };
            });
            console.log('suggestion role: ', roles);
            setSuggestionRole(roles);
        } catch (error) {
            console.warn('Failed to get all suggestion role', error);
        }
    };

    const fetchSemester = async () => {
        try {
            const response = await semesterApi.getTop3Semester();
            console.log('getTop3Semester: ', response);
            setSemesterList(response.data);
            // setSemester(response.data[0].name);
        } catch (error) {
            console.log('Fail when getTop3Semester', error);
        }
    };

    const fetchCommonScheduleBySemester = async () => {
        try {
            const response = await trainingScheduleApi.commonSchedule();
            console.log('Thanh cong roi: ', response);
            let eventSchedule = response.data.filter((event) => event.type === 1);
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
    const navigateToUpdate = (params, date) => {
        let formatDate = moment(date).format('DD/MM/yyyy');
        console.log(formatDate);
        eventApi.getEventByDate(formatDate).then((res) => {
            console.log('selected id', res.data[0].event.id);
            navigate(`/admin/events/${res.data[0].event.id}`);
        });
    };

    useEffect(() => {
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [page]);
    useEffect(() => {
        fetchSemester();
        getAllSuggestionRole();
    }, []);
    useEffect(() => {
        getListEventsBySemester(month, page - 1, semester);
        fetchCommonScheduleBySemester();
    }, [semester, month, page]);

    useEffect(() => {
        fetchMonthInSemester(semester);
        // setMonth(new Date().getMonth() + 1);
    }, [semester]);
    useEffect(() => {
        getStartDateBySemesterName(semester);
        month &&
            startDateOfSemester &&
            calendarFilter(
                new Date(`${startDateOfSemester.split('-')[0]}-${month}-${startDateOfSemester.split('-')[2]}`),
            );
    }, [semester, month, startDateOfSemester]);

    return (
        <Fragment>
            {suggestionRole && (
                <AddEventDialog
                    title="Tạo sự kiện"
                    roles={suggestionRole}
                    isOpen={openDialog}
                    handleClose={() => {
                        setOpenDialog(false);
                    }}
                    user={user}
                />
            )}
            <RolesSetting
                title="Chỉnh sửa gợi ý vai trò ban tổ chức "
                isOpen={openSettingRole}
                handleClose={() => {
                    setOpenSettingRole(false);
                }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                    Danh sách sự kiện
                </Typography>
                {user.role.name !== 'ROLE_Treasurer' ? (
                    <Button
                        variant="outlined"
                        sx={{ maxHeight: '50px', minHeight: '50px' }}
                        // component={Link}
                        // to={'/admin/events/add'}
                        onClick={() => {
                            setOpenDialog(true);
                        }}
                        startIcon={<AddCircleIcon />}
                    >
                        Thêm sự kiện mới
                    </Button>
                ) : null}
            </Box>
            <Box sx={{ mb: 2, display: 'flex' }}>
                <Box>
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
                        label="Chọn tháng"
                        value={month}
                        onChange={(e) => {
                            setMonth(e.target.value);
                        }}
                    >
                        <MenuItem value={0}>Tất cả</MenuItem>
                        {monthInSemester.map((option) => (
                            <MenuItem key={option} value={option}>
                                Tháng {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <SpeedDial
                    ariaLabel="SpeedDial openIcon example"
                    sx={{ transform: 'translateZ(0px)', flexGrow: 1, position: 'absolute', right: 16 }}
                    icon={<Settings />}
                    direction={'left'}
                >
                    {/* <SpeedDialAction
                    key={'area'}
                    icon={<MapTwoTone />}
                    tooltipTitle={'Chỉnh sửa thông tin sân thi đấu'}
                    onClick={() => setOpenSettingArea(true)}
                /> */}
                    <SpeedDialAction
                        key={'role'}
                        icon={<AdminPanelSettings />}
                        tooltipTitle={'Chỉnh sửa thông tin ban tổ chức'}
                        onClick={() => setOpenSettingRole(true)}
                    />
                    {/* <SpeedDialAction
                    key={'competitive'}
                    icon={<SportsGymnastics />}
                    tooltipTitle={'Chỉnh sửa đề xuất thể thức thi đấu đối kháng'}
                    onClick={() => setOpenSettingCompetitive(true)}
                />
                <SpeedDialAction
                    key={'exhibition'}
                    icon={<SportsKabaddi />}
                    tooltipTitle={'Chỉnh sửa đề xuất thể thức thi đấu biểu diễn'}
                    onClick={() => setOpenSettingExhibition(true)}
                /> */}
                </SpeedDial>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={4}>
                    {events.length !== 0 ? null : (
                        <Typography sx={{ fontWeight: 'bold', mt: 3, textAlign: 'center' }}>
                            Không có sự kiện nào !
                        </Typography>
                    )}
                    {goingOnEvents.length !== 0 ? (
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Đang diễn ra</Typography>
                            <ul>
                                {goingOnEvents &&
                                    goingOnEvents.map((item) => {
                                        return <EventItem key={item.id} data={item} />;
                                    })}
                            </ul>
                        </Box>
                    ) : null}

                    {upComingEvents.length !== 0 ? (
                        <Box>
                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Sắp diễn ra</Typography>
                            <ul>
                                {upComingEvents &&
                                    upComingEvents.map((item) => {
                                        return (
                                            <EventItem
                                                key={item.id}
                                                data={item}
                                                onSuccess={(deletedId) =>
                                                    setUpComingEvents((prev) =>
                                                        prev.filter((item) => item.id !== deletedId),
                                                    )
                                                }
                                                user={user}
                                            />
                                        );
                                    })}
                            </ul>
                        </Box>
                    ) : null}
                    {closedEvent.length !== 0 ? (
                        <>
                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Đã kết thúc</Typography>
                            <Box sx={{ height: '40vh', overflowY: 'overlay' }}>
                                <ul>
                                    {closedEvent &&
                                        closedEvent.map((item) => {
                                            return <EventItem key={item.id} data={item} />;
                                        })}
                                </ul>
                            </Box>
                        </>
                    ) : null}
                </Grid>
                <Grid item xs={8}>
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            height: '80vh',
                            padding: 2,
                            borderRadius: '5px',
                            '.fc-day-today': {
                                border: '2px solid #0f80f0',
                            },
                            ' .fc-event-today': {
                                border: '2px solid #0f80f0',
                            },
                        }}
                    >
                        <FullCalendar
                            // initialDate={new Date(2022, month - 1, 1)}
                            // {...(semester!==2?(initialDate: '2022-10-01'):{})}
                            // initialDate={semester !== 2 ? new Date('2022-10-01') : new Date()}
                            locale="vie"
                            height="100%"
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
                            // editable={true}
                            // selectable={true}
                            // datesSet={(dateInfo) => {
                            //     getMonthInCurrentTableView(dateInfo.start);
                            // }}
                            eventClick={(args) => {
                                navigateToUpdate(args.event, args.event.start);
                                // console.log(args);
                            }}
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
                    </Box>
                </Grid>
            </Grid>
            <Box>
                {/* <Pagination
                    count={events && Math.floor(events.length / 5) + 1}
                    // count={3}
                    page={page}
                    color="primary"
                    sx={{ display: 'flex', mt: 4, justifyContent: 'flex-end' }}
                    onChange={(event, value) => setPage(value)}
                /> */}
            </Box>
        </Fragment>
    );
}

export default Event;
