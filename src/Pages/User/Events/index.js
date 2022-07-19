import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    MenuItem,
    Pagination,
    TextField,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styles from 'src/Pages/Admin/Event/Event.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import { Fragment, useCallback, useEffect, useState } from 'react';
import semesterApi from 'src/api/semesterApi';
import moment from 'moment';
import LoadingProgress from 'src/Components/LoadingProgress';
import RegisterEventDialog from './RegisterEventDialog';

const cx = classNames.bind(styles);

function EventList() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [events, setEvents] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [semester, setSemester] = useState('Summer2022');
    const [monthInSemester, setMonthInSemester] = useState([]);
    const [month, setMonth] = useState(0);
    const [semesterList, setSemesterList] = useState([]);

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const getListEventsBySemester = async (month, page, semester) => {
        try {
            const response = await eventApi.getEventBySemester(month, page, semester);
            setEvents(response.data);
            console.log('getListEventsBySemester', response.data);
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
        fetchMonthInSemester(semester);
        getListEventsBySemester(month, page - 1, semester);
    }, [semester, month, page]);

    if (!events) {
        return <LoadingProgress />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                    Danh sách sự kiện
                </Typography>
            </Box>

            <Box sx={{ mb: 1 }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '80%' }}>
                    {events && events.length === 0 ? (
                        <Typography variant="h5" sx={{ textAlign: 'center', mt: 3 }}>
                            KHÔNG CÓ SỰ KIỆN NÀO
                        </Typography>
                    ) : (
                        ''
                    )}
                    <ul>
                        {events &&
                            events.map((item) => {
                                return (
                                    <li key={item.id}>
                                        <div className={cx('events')}>
                                            <Box component={Link} to={`${item.id}`}>
                                                <div className={cx('event-list')}>
                                                    <div className={cx('event-status')}>
                                                        {/* <p className={cx('upcoming')}> */}
                                                        {item.status === 'Chưa diễn ra' ? (
                                                            <p className={cx('upcoming')}>Sắp diễn ra</p>
                                                        ) : item.status === 'Đang diễn ra' ? (
                                                            <p className={cx('going-on')}>Đang diễn ra</p>
                                                        ) : (
                                                            <p className={cx('closed')}>Đã kết thúc</p>
                                                        )}
                                                    </div>
                                                    <div className={cx('event-title')}>{item.name}</div>
                                                    <div className={cx('event-date')}>
                                                        {moment(new Date(item.startDate)).format('DD/MM/yyyy')}
                                                    </div>
                                                </div>
                                            </Box>
                                        </div>
                                    </li>
                                );
                            })}
                    </ul>
                    <Box>
                        <Pagination
                            count={events && Math.floor(events.length / 5) + 1}
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
