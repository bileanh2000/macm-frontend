import { Box, Button, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styles from './Event.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import { useEffect, useState } from 'react';
import semesterApi from 'src/api/semesterApi';
import moment from 'moment';

const cx = classNames.bind(styles);

function Event() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [events, setEvents] = useState();
    const [pageSize, setPageSize] = useState(10);
    const [semester, setSemester] = useState('Summer2022');
    const [semesterList, setSemesterList] = useState([]);

    const handleChange = (event) => {
        setSemester(event.target.value);
    };
    const getListEventsBySemester = async (params) => {
        try {
            const response = await eventApi.getEventBySemester(params);
            setEvents(response.data);
            // setTotal(response.totalPage);
            // setPageSize(response.pageSize);
            console.log('hahahaah', response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    console.log(events);

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
        getListEventsBySemester(semester);
    }, [semester]);
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 4 }}>
                    Danh sách sự kiện
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ maxHeight: '50px', minHeight: '50px' }}
                    component={Link}
                    to={'/admin/events/add'}
                    startIcon={<AddCircleIcon />}
                >
                    Thêm sự kiện mới
                </Button>
            </Box>
            <Box>
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
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '80%' }}>
                    <ul>
                        {events &&
                            events.map((item) => {
                                return (
                                    <li key={item.id}>
                                        <div className={cx('events')}>
                                            <Box component={Link} to={`${item.id}`}>
                                                <div className={cx('event-list')}>
                                                    <div className={cx('event-status')}>
                                                        <p className={cx('upcoming')}>
                                                            {item.status === 'Chưa diễn ra'
                                                                ? 'Sắp diễn ra'
                                                                : item.status === 'Đang diễn ra'
                                                                ? 'Đang diễn ra'
                                                                : 'Đã kết thúc'}
                                                        </p>
                                                    </div>
                                                    <div className={cx('event-title')}>{item.name}</div>
                                                    <div className={cx('event-date')}>
                                                        {moment(new Date(item.startDate)).format('DD/MM/yyyy')}
                                                    </div>
                                                </div>
                                            </Box>
                                            <div className={cx('event-action')}>
                                                <IconButton aria-label="delete" onClick={() => console.log('a')}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton aria-label="edit" component={Link} to={`${item.id}/edit`}>
                                                    <EditIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                    </ul>
                </Box>
            </Box>
        </Box>
    );
}

export default Event;
