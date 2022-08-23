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
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import styles from 'src/Pages/Admin/Event/Event.module.scss';
import classNames from 'classnames/bind';
import eventApi from 'src/api/eventApi';
import { Fragment, useEffect, useState } from 'react';
import semesterApi from 'src/api/semesterApi';
import moment from 'moment';
import LoadingProgress from 'src/Components/LoadingProgress';
import Paper from '@mui/material/Paper';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import EventItem from './EventItem';
import MobileEventItem from './EventItem/MobileLayout';

const cx = classNames.bind(styles);

function EventList() {
    const [page, setPage] = useState(1);
    const [events, setEvents] = useState([]);
    const [pageSize, setPageSize] = useState(0);
    const [semester, setSemester] = useState('Summer2022');
    const [monthInSemester, setMonthInSemester] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [semesterList, setSemesterList] = useState([]);
    const [totalResult, setTotalResult] = useState([]);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const [upComingEvents, setUpComingEvents] = useState([]);
    const [goingOnEvents, setGoingOnEvents] = useState([]);
    const [closedEvent, setClosedEvent] = useState([]);

    let navigator = useNavigate();

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const getListEventsBySemester = async (studentId, month, page, semester) => {
        try {
            const response = await eventApi.getEventBySemesterAndStudentId(studentId, month, page, semester);
            setEvents(response.data);
            console.log('getListEventsBySemester', response);
            setPageSize(Math.ceil(response.totalResult / 10));
            setTotalResult(response.totalResult);
            let upComing = response.data.filter((event) => event.eventDto.status === 'Chưa diễn ra');
            let goingOn = response.data.filter((event) => event.eventDto.status === 'Đang diễn ra');
            let closed = response.data.filter((event) => event.eventDto.status === 'Đã kết thúc');
            setEvents(response.data);
            setUpComingEvents(upComing);
            setGoingOnEvents(goingOn);
            setClosedEvent(closed);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };

    const fetchMonthInSemester = async (semester) => {
        try {
            const response = await eventApi.getMonthsBySemester(semester);
            setMonthInSemester(response.data);
            console.log('monthsInSemester', response.data);
        } catch (error) {
            console.log(error);
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
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [page]);
    useEffect(() => {
        fetchSemester();
    }, []);
    useEffect(() => {
        // let currentMonth = new Date().getMonth() + 1;
        // setMonth(currentMonth);
        fetchMonthInSemester(semester);
    }, [semester]);
    useEffect(() => {
        // let currentMonth = new Date().getMonth() + 1;
        // setMonth(currentMonth);
        getListEventsBySemester(JSON.parse(localStorage.getItem('currentUser')).studentId, month, page - 1, semester);
    }, [month, semester, page]);

    if (!events.length && totalResult) {
        return <LoadingProgress />;
    }

    return (
        <Box sx={{ padding: { xs: '10px', md: '0px' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                    Danh sách sự kiện
                </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
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
            <Box sx={{}}>
                <Box>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            {events.length !== 0 ? null : (
                                <Typography sx={{ fontWeight: 'bold', mt: 3, textAlign: 'center', xs: { ml: 3 } }}>
                                    Không có sự kiện nào !
                                </Typography>
                            )}
                            {goingOnEvents.length !== 0 ? (
                                <Box sx={{ mb: 2 }}>
                                    {matches ? (
                                        <>
                                            <Typography sx={{ fontWeight: 'bold', mb: 1, ml: 32 }}>
                                                Đang diễn ra
                                            </Typography>
                                            <ul>
                                                {goingOnEvents &&
                                                    goingOnEvents.map((item) => {
                                                        return <EventItem key={item.id} data={item} />;
                                                    })}
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Đang diễn ra</Typography>
                                            <ul>
                                                {goingOnEvents &&
                                                    goingOnEvents.map((item) => {
                                                        return <MobileEventItem key={item.id} data={item} />;
                                                    })}
                                            </ul>
                                        </>
                                    )}
                                </Box>
                            ) : null}

                            {upComingEvents.length !== 0 ? (
                                <Box>
                                    {matches ? (
                                        <>
                                            <Typography sx={{ fontWeight: 'bold', mb: 1, ml: 32 }}>
                                                Sắp diễn ra
                                            </Typography>
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
                                                            />
                                                        );
                                                    })}
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Sắp diễn ra</Typography>
                                            <ul>
                                                {upComingEvents &&
                                                    upComingEvents.map((item) => {
                                                        return (
                                                            <MobileEventItem
                                                                key={item.id}
                                                                data={item}
                                                                onSuccess={(deletedId) =>
                                                                    setUpComingEvents((prev) =>
                                                                        prev.filter((item) => item.id !== deletedId),
                                                                    )
                                                                }
                                                            />
                                                        );
                                                    })}
                                            </ul>
                                        </>
                                    )}
                                    {/* <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Sắp diễn ra</Typography> */}
                                </Box>
                            ) : null}
                            {closedEvent.length !== 0 ? (
                                <>
                                    {matches ? (
                                        <>
                                            <Typography sx={{ fontWeight: 'bold', mb: 1, ml: 32 }}>
                                                Đã kết thúc
                                            </Typography>
                                            <ul>
                                                {closedEvent &&
                                                    closedEvent.map((item) => {
                                                        return <EventItem key={item.id} data={item} isMember={true} />;
                                                    })}
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Đã kết thúc</Typography>
                                            <Box sx={{ height: '40vh', overflowY: 'overlay' }}>
                                                <ul>
                                                    {closedEvent &&
                                                        closedEvent.map((item) => {
                                                            return (
                                                                <MobileEventItem
                                                                    key={item.id}
                                                                    data={item}
                                                                    isMember={true}
                                                                />
                                                            );
                                                        })}
                                                </ul>
                                            </Box>
                                        </>
                                    )}
                                </>
                            ) : null}
                        </Grid>
                    </Grid>
                    <Box>
                        <Pagination
                            count={pageSize}
                            // count={3}
                            page={page}
                            color="primary"
                            sx={{ display: 'flex', mt: 4, justifyContent: 'flex-end' }}
                            onChange={(event, value) => setPage(value)}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default EventList;
