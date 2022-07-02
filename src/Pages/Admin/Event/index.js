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
import styles from './Event.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import { Fragment, useCallback, useEffect, useState } from 'react';
import semesterApi from 'src/api/semesterApi';
import moment from 'moment';
import { EventSeatTwoTone } from '@mui/icons-material';

const cx = classNames.bind(styles);

function Event() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [events, setEvents] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [semester, setSemester] = useState('Summer2022');
    const [monthInSemester, setMonthInSemester] = useState([]);
    const [month, setMonth] = useState(0);
    const [semesterList, setSemesterList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [eventOnclick, SetEventOnclick] = useState({ name: '', id: '' });

    const handleChange = (event) => {
        setSemester(event.target.value);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const getListEventsBySemester = async (month, page, semester) => {
        try {
            const response = await eventApi.getEventBySemester(month, page, semester);
            setEvents(response.data);

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

    const handleDelete = useCallback(
        (id) => () => {
            handleCloseDialog();
            setTimeout(() => {
                // const params = { studentId: id, semester: semester };
                eventApi.deleteEvent(id).then((res) => {
                    setEvents((prev) => prev.filter((item) => item.id !== id));
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
                <DialogTitle id="alert-dialog-title">{`Bạn muốn xóa sự kiện "${eventOnclick.name}"?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        "{eventOnclick.name}" sẽ được xóa khỏi danh sách sự kiện!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Từ chối</Button>
                    <Button onClick={handleDelete(eventOnclick.id)} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
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
                                            <div className={cx('event-action')}>
                                                {item.status === 'Chưa diễn ra' ? (
                                                    <Fragment>
                                                        <IconButton
                                                            aria-label="delete"
                                                            onClick={() => {
                                                                handleOpenDialog();
                                                                SetEventOnclick({ name: item.name, id: item.id });
                                                                // handleDelete(item.id);
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            aria-label="edit"
                                                            component={Link}
                                                            to={`${item.id}/edit`}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Fragment>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
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

export default Event;
