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
import adminNewsAPI from 'src/api/adminNewsAPI';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CircleIcon from '@mui/icons-material/Circle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNavigate } from 'react-router-dom';

function Notification() {
    const [newsList, setNews] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const navigator = useNavigate();
    const fetchNewsList = async (pageNo) => {
        try {
            const response = await adminNewsAPI.getAllNotification(pageNo);
            console.log(response);
            setNews(response.data);
            setTotal(response.totalPage);
        } catch (error) {
            console.log('Lấy dữ liệu news thất bại');
        }
    };
    const handleChange = (event, value) => {
        setPage(value);
    };
    React.useEffect(() => {
        fetchNewsList(page - 1);
        // window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [page]);
    const onClickNotification = (news) => {
        if (news.notificationType == 1) {
            navigator({ pathname: `/events/${news.notificationTypeId}` });
        } else if (news.notificationType == 0) {
            navigator({ pathname: `/tournament/${news.notificationTypeId}` });
        } else {
            return;
        }
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
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-haspopup="true"
                            onClick={() => console.log(test)}
                        >
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
                                <CircleIcon sx={{ fontSize: '0.9rem', color: '#2e89ff' }} />
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
