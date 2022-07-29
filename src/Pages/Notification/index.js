import {
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Pagination,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import moment from 'moment';
import React from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CircleIcon from '@mui/icons-material/Circle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNavigate } from 'react-router-dom';
import notificationApi from 'src/api/notificationApi';
import { useGlobalState, setGlobalState } from 'src/state';

function Notification() {
    const [newsList, setNews] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const navigator = useNavigate();
    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;
    const [totalNotification, setTotalNotification] = useGlobalState('totalNotification');

    const fetchNewsList = async (studentId, pageNo) => {
        try {
            const response = await notificationApi.getAllNotification(studentId, pageNo);
            console.log('fetch Notification', response);
            setGlobalState('totalNotification', response.totalDeactive);
            setNews(response.data);
            setTotal(response.totalPage);
        } catch (error) {
            console.log('Lấy dữ liệu Notification thất bại');
        }
    };
    const handleChange = (event, value) => {
        setPage(value);
    };
    React.useEffect(() => {
        fetchNewsList(studentId, page - 1);
        // window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [page]);

    const handleMarkAllRead = () => {
        setNews((prev) => {
            return prev.map((item) => {
                console.log(item);
                item.read = true;
                return item;
            });
        });
        setTotalNotification(0);
        notificationApi.markAllNotificationAsRead(studentId).then((response) => {
            console.log('mark all notification', response);
        });
    };
    const onClickNotification = (news) => {
        if (!news.read) {
            setTotalNotification((prev) => prev - 1);
        }
        notificationApi.markNotificationAsRead(news.id, studentId).then((response) => {
            console.log('mark notification', response);
        });

        news['read'] = true;
        setNews((prev) => {
            return prev.map((prevNew) => {
                if (prevNew.id === news.id) {
                    return {
                        ...prevNew,
                    };
                }
                return prevNew;
            });
        });
        console.log(news);
        // if (news.notificationType == 1) {
        //     navigator({ pathname: `/events/${news.notificationTypeId}` });
        // } else if (news.notificationType == 0) {
        //     navigator({ pathname: `/tournament/${news.notificationTypeId}` });
        // } else {
        //     return;
        // }
    };
    return (
        <Paper elevation={3} sx={{}}>
            <Box sx={{ padding: '16px 0px 8px 0px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h2 style={{ marginLeft: '8px' }}>Thông báo</h2>
                    <Tooltip title="Đánh dấu tất cả đã đọc" placement="left">
                        <IconButton aria-label="more" id="long-button" aria-haspopup="true" onClick={handleMarkAllRead}>
                            <DoneAllIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <List sx={{ width: '100%', height: '100vh' }}>
                    {newsList.map((news, index) => (
                        <React.Fragment key={index}>
                            <ListItemButton onClick={() => onClickNotification(news)} sx={{ whiteSpace: 'normal' }}>
                                <ListItemAvatar>
                                    {news.notificationType === 0 ? (
                                        <Avatar sx={{ backgroundColor: '#f9d441' }}>
                                            <EmojiEventsIcon />
                                        </Avatar>
                                    ) : news.notificationType === 1 ? (
                                        <Avatar sx={{ backgroundColor: '#16ce8e' }}>
                                            <CelebrationIcon />
                                        </Avatar>
                                    ) : news.notificationType === 2 ? (
                                        <Avatar sx={{ backgroundColor: '#409bf5' }}>
                                            <SportsMartialArtsIcon />
                                        </Avatar>
                                    ) : (
                                        <Avatar sx={{ backgroundColor: '#ff4444' }}>
                                            <PriorityHighIcon />
                                        </Avatar>
                                    )}
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{ whiteSpace: 'normal' }}
                                    primary={news.message}
                                    secondary={moment(news.createdOn).format('DD/MM/YYYY - HH:MM')}
                                />
                                {!news.read ? <CircleIcon sx={{ fontSize: '0.9rem', color: '#2e89ff' }} /> : null}
                            </ListItemButton>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
                <Stack spacing={2}>
                    <Pagination count={total} page={page} onChange={handleChange} />
                </Stack>
            </Box>
        </Paper>
    );
}

export default Notification;