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
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    let navigator = useNavigate();

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const getListEventsBySemester = async (studentId, month, page, semester) => {
        try {
            const response = await eventApi.getEventBySemesterAndStudentId(studentId, month, page, semester);
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
        getListEventsBySemester(JSON.parse(localStorage.getItem('currentUser')).studentId, month, page - 1, semester);
    }, [semester, month, page]);

    if (!events) {
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
                    {events && events.length === 0 ? (
                        <Typography variant="h5" sx={{ textAlign: 'center', mt: 3 }}>
                            KHÔNG CÓ SỰ KIỆN NÀO
                        </Typography>
                    ) : (
                        ''
                    )}

                    <Grid justifyContent="center" container spacing={2}>
                        {events &&
                            events.map((item) => {
                                return matches ? (
                                    <Grid item xs={12} md={8} key={item.eventDto.id}>
                                        <Paper
                                            onClick={() => {
                                                console.log(item.eventDto.id);
                                                navigator(`/events/${item.eventDto.id}`);
                                            }}
                                            elevation={2}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: 2,
                                                flexWrap: 'wrap',
                                                transition: 'box-shadow 100ms linear',
                                                cursor: 'pointer',

                                                '&:hover': {
                                                    boxShadow: '0px 0px 16px 1px rgba(0,0,0,0.2)',
                                                    // opacity: [0.9, 0.8, 0.7],
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex' }}>
                                                <Box
                                                    sx={{
                                                        backgroundColor: '#F0F0F0',
                                                        padding: 0.8,
                                                        mr: 2,
                                                        borderRadius: '10px',
                                                        width: '50px',
                                                        height: '50px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flex: 1,
                                                    }}
                                                >
                                                    <CelebrationIcon fontSize="large" sx={{ color: '#0ACE70' }} />
                                                </Box>
                                                <Box>
                                                    <Box>
                                                        <Typography
                                                            sx={{
                                                                fontSize: '20px',
                                                                lineHeight: '1.2',
                                                                fontWeight: '500',
                                                            }}
                                                        >
                                                            {item.eventDto.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Typography sx={{ fontSize: '14px', lineHeight: '1.2' }}>
                                                            {item.eventDto.amountPerMemberRegister === 0
                                                                ? 'Không thu phí'
                                                                : 'Dự kiến ' +
                                                                  item.eventDto.amountPerMemberRegister.toLocaleString() +
                                                                  ' VND/người'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', flex: 1 }}>
                                                <Box sx={{ mr: 1.5, ml: 2 }}>
                                                    {item.eventDto.status === 'Chưa diễn ra' ? (
                                                        <div className={cx('upcoming')}>Sắp diễn ra</div>
                                                    ) : item.eventDto.status === 'Đang diễn ra' ? (
                                                        <div className={cx('going-on')}>Đang diễn ra</div>
                                                    ) : (
                                                        <div className={cx('closed')}>Đã kết thúc</div>
                                                    )}
                                                </Box>
                                                <Box>
                                                    {item.join ? <div className={cx('joined')}>Đã đăng ký</div> : null}
                                                </Box>
                                            </Box>

                                            <Box sx={{}}>
                                                <Typography
                                                    sx={{ fontSize: '16px', lineHeight: '1.2', fontWeight: '500' }}
                                                >
                                                    {moment(new Date(item.eventDto.startDate)).format('DD/MM/yyyy')}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ) : (
                                    // Mobile --------------------------------

                                    <Grid item xs={12} md={8} key={item.eventDto.id}>
                                        <Paper
                                            onClick={() => {
                                                console.log(item.eventDto.id);
                                                navigator(`/events/${item.eventDto.id}`);
                                            }}
                                            elevation={2}
                                            sx={{
                                                padding: 2,
                                                flexWrap: 'wrap',
                                                transition: 'box-shadow 100ms linear',
                                                cursor: 'pointer',

                                                '&:hover': {
                                                    boxShadow: '0px 0px 16px 1px rgba(0,0,0,0.2)',
                                                    // opacity: [0.9, 0.8, 0.7],
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex' }}>
                                                    <Box
                                                        sx={{
                                                            backgroundColor: '#F0F0F0',
                                                            padding: 0.8,
                                                            mr: 2,
                                                            borderRadius: '10px',
                                                            width: '50px',
                                                            height: '50px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <CelebrationIcon fontSize="large" sx={{ color: '#0ACE70' }} />
                                                    </Box>
                                                    <Box>
                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '20px',
                                                                    lineHeight: '1.2',
                                                                    fontWeight: '500',
                                                                }}
                                                            >
                                                                {item.eventDto.name}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '14px',
                                                                    lineHeight: '1.2',
                                                                    fontWeight: '500',
                                                                }}
                                                            >
                                                                {moment(new Date(item.eventDto.startDate)).format(
                                                                    'DD/MM/yyyy',
                                                                )}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '14px', lineHeight: '1.2' }}>
                                                                {item.eventDto.amountPerMemberRegister === 0
                                                                    ? 'Không thu phí'
                                                                    : 'Dự kiến ' +
                                                                      item.eventDto.amountPerMemberRegister.toLocaleString() +
                                                                      ' VND/người'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', mt: 1, justifyContent: 'flex-end' }}>
                                                <Box sx={{}}>
                                                    {item.eventDto.status === 'Chưa diễn ra' ? (
                                                        <div className={cx('upcoming')}>Sắp diễn ra</div>
                                                    ) : item.eventDto.status === 'Đang diễn ra' ? (
                                                        <div className={cx('going-on')}>Đang diễn ra</div>
                                                    ) : (
                                                        <div className={cx('closed')}>Đã kết thúc</div>
                                                    )}
                                                </Box>
                                                {item.join ? (
                                                    <Box sx={{ ml: 2 }}>
                                                        <div className={cx('joined')}>Đã đăng ký</div>
                                                    </Box>
                                                ) : null}
                                            </Box>

                                            {/* <Box sx={{}}>
                                                <Typography
                                                    sx={{ fontSize: '16px', lineHeight: '1.2', fontWeight: '500' }}
                                                >
                                                    {moment(new Date(item.eventDto.startDate)).format('DD/MM/yyyy')}
                                                </Typography>
                                            </Box> */}
                                        </Paper>
                                    </Grid>
                                );
                            })}
                    </Grid>
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
