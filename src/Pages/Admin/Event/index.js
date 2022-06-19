import { Box, Button, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styles from './Event.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
function Event() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [events, setEvents] = useState();
    const [pageSize, setPageSize] = useState(10);
    const getListEvents = async (pageNo) => {
        const params = {};
        try {
            const response = await eventApi.getAll(pageNo);
            setEvents(response.data);
            setTotal(response.totalPage);
            setPageSize(response.pageSize);
            console.log(response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    console.log(events);

    useEffect(() => {
        getListEvents(page - 1);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [page]);
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
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
                                                        <p className={cx('upcoming')}>Upcoming</p>
                                                    </div>
                                                    <div className={cx('event-title')}>{item.name}</div>
                                                    <div className={cx('event-date')}>29-01-2022</div>
                                                </div>
                                            </Box>
                                            <div className={cx('event-action')}>
                                                <IconButton aria-label="delete" onClick={() => console.log('a')}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton aria-label="edit">
                                                    <EditIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        {/* <li>
                            <div className={cx('events')}>
                                <Box component={Link} to="admin/events">
                                    <div className={cx('event-list')}>
                                        <div className={cx('event-status')}>
                                            <p className={cx('upcoming')}>Upcoming</p>
                                        </div>
                                        <div className={cx('event-title')}>hehe</div>
                                        <div className={cx('event-date')}>29-01-2022</div>
                                    </div>
                                </Box>
                                <div className={cx('event-action')}>
                                    <IconButton aria-label="delete" onClick={() => console.log('a')}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </li> */}
                    </ul>
                </Box>
            </Box>
        </Box>
    );
}

export default Event;
