import * as React from 'react';
import classNames from 'classnames/bind';
import Header from '../Components/Header';
import Sidebar from './Sidebar';
import styles from './DefaultLayout.module.scss';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Avatar,
    Badge,
    ClickAwayListener,
    ListItemAvatar,
    Menu,
    MenuItem,
    Pagination,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from '@mui/material';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import notificationApi from 'src/api/notificationApi';
import CircleIcon from '@mui/icons-material/Circle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import CelebrationIcon from '@mui/icons-material/Celebration';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import NotificationsPausedRoundedIcon from '@mui/icons-material/NotificationsPausedRounded';

import moment from 'moment';

const cx = classNames.bind(styles);
const drawerWidth = 270;
function DefaultLayout({ children, onLogout }) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [totalUnRead, setTotalUnRead] = React.useState(0);
    const [newsList, setNews] = React.useState([]);
    const [notiStatus, setNotiStatus] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;
    const [page, setPage] = React.useState(1);
    const [checked, setChecked] = React.useState(false);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    let navigator = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const fetchNewsList = async (studentId, pageNo) => {
        try {
            const response = await notificationApi.getAllNotification(studentId, pageNo);
            console.log('fetch list notifications', response);
            setTotalUnRead(response.totalDeactive);
            setNews(response.data);
            setTotal(response.totalPage);
        } catch (error) {
            console.log('Lấy dữ liệu news thất bại');
        }
    };
    const fetchUnreadNotification = async (studentId, pageNo) => {
        try {
            const response = await notificationApi.getAllNotificationUnread(studentId, pageNo);
            console.log('fetchUnreadNotification', response);
            setNews(response.data);
            setTotal(response.totalPage);
        } catch (error) {
            console.error('Lấy dữ liệu news thất bại');
        }
    };
    const handleMarkAllRead = () => {
        setNews((prev) => {
            return prev.map((item) => {
                console.log(item);
                item.read = true;
                return item;
            });
        });
        setTotalUnRead(0);
        notificationApi.markAllNotificationAsRead(studentId).then((response) => {
            console.log('mark all notification', response);
        });
    };
    const onClickNotification = (news) => {
        if (!news.read) {
            setTotalUnRead((prev) => prev - 1);
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
        if (news.notificationType == 1) {
            navigator({ pathname: `/events/${news.notificationTypeId}` });
            setChecked(false);
        } else if (news.notificationType == 0) {
            navigator({ pathname: `/tournament/${news.notificationTypeId}` });
            setChecked(false);
        } else {
            return;
        }
    };
    const handleClickAway = () => {
        setChecked(false);
    };
    const handleClickNotification = () => {
        setChecked((prev) => !prev);
    };
    const handleChange = (event, value) => {
        setPage(value);
    };
    React.useEffect(() => {
        if (notiStatus) {
            fetchUnreadNotification(studentId, page - 1);
        } else {
            fetchNewsList(studentId, page - 1);
        }
    }, [notiStatus, page]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Box sx={{ padding: '0px 16px 0px 16px' }}>
                    <Toolbar disableGutters>
                        <SportsMartialArtsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/home"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            MACM
                        </Typography>
                        {/* Mobile */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleDrawerToggle}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        <SportsMartialArtsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/home"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            MACM
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {/* {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))} */}
                        </Box>
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <Box>
                                {matches ? (
                                    <IconButton
                                        id="basic-button"
                                        sx={{ color: 'white', mr: 2 }}
                                        // onClick={handleClickNotification}
                                        onClick={handleClickNotification}
                                    >
                                        <Badge
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    backgroundColor: '#FF4444',
                                                },
                                            }}
                                            badgeContent={totalUnRead}
                                        >
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                ) : (
                                    // Mobile ----------------
                                    <IconButton
                                        id="basic-button"
                                        sx={{ color: 'white', mr: 2 }}
                                        component={Link}
                                        to="/notifications"
                                    >
                                        <Badge
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    backgroundColor: '#FF4444',
                                                },
                                            }}
                                            badgeContent={totalUnRead}
                                        >
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                )}

                                {/* <Grow in={checked}> */}
                                {checked ? (
                                    <Paper elevation={3} sx={{ position: 'absolute', top: '58px', right: '0px' }}>
                                        <Box sx={{ padding: '16px 8px 8px 8px' }}>
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
                                                        onClick={handleMarkAllRead}
                                                    >
                                                        <DoneAllIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            <Box className={cx('noti-switch')} sx={{ padding: '8px 8px 5px 8px' }}>
                                                <ToggleButtonGroup
                                                    color="primary"
                                                    value={notiStatus}
                                                    exclusive
                                                    onChange={(event, newNotiStatus) => {
                                                        if (newNotiStatus !== null) {
                                                            setNotiStatus(newNotiStatus);
                                                            console.log(newNotiStatus);
                                                        }
                                                    }}
                                                >
                                                    <ToggleButton
                                                        value={0}
                                                        sx={{
                                                            p: 1,
                                                            borderRadius: '10px !important',
                                                            border: 'none',
                                                            textTransform: 'none',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        Tất cả
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        value={1}
                                                        sx={{
                                                            p: 1,
                                                            borderRadius: '10px !important',
                                                            border: 'none',
                                                            textTransform: 'none',
                                                        }}
                                                    >
                                                        Chưa đọc
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            </Box>

                                            <List sx={{ width: 400 }}>
                                                {newsList.length !== 0 ? null : (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            mb: 2,
                                                        }}
                                                    >
                                                        <NotificationsPausedRoundedIcon
                                                            sx={{
                                                                fontSize: '8rem',
                                                                transform: 'rotate(354deg)',
                                                                color: '#c1cfdb',
                                                            }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontSize: '1.2rem',
                                                                color: '#747b82',
                                                            }}
                                                        >
                                                            Opps, Bạn đã đọc tất cả các thông báo!
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {newsList.map((news, index) => (
                                                    <React.Fragment key={index}>
                                                        <ListItemButton
                                                            onClick={() => onClickNotification(news)}
                                                            sx={{ whiteSpace: 'normal' }}
                                                        >
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
                                                            <Tooltip
                                                                title={moment(news.createdOn).format(
                                                                    'ddd, DD/MM/YYYY - HH:MM',
                                                                )}
                                                            >
                                                                <ListItemText
                                                                    sx={{ whiteSpace: 'normal' }}
                                                                    primary={news.message}
                                                                    // secondary={moment(news.createdOn).format(
                                                                    //     'DD/MM/YYYY - HH:MM',
                                                                    // )}
                                                                    secondary={moment(news.createdOn).fromNow()}
                                                                />
                                                            </Tooltip>

                                                            {!news.read ? (
                                                                <CircleIcon
                                                                    sx={{ fontSize: '0.9rem', color: '#2e89ff' }}
                                                                />
                                                            ) : null}
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
                                ) : null}

                                {/* </Grow> */}
                            </Box>
                        </ClickAwayListener>

                        <Box sx={{ flexGrow: 0 }}>
                            {/* <IconButton
                                id="basic-button"
                                sx={{ color: 'white', mr: 2 }}
                                // onClick={handleClickNotification}
                                // onClick={handleClickNotification}
                            >
                                <Badge
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: '#FF4444',
                                        },
                                    }}
                                    badgeContent={0}
                                >
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton> */}

                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="avatar" src={user.image} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <Box sx={{ p: 1.5, mb: 0.8, borderBottom: '1px solid #dddd', textAlign: 'center' }}>
                                    <Typography sx={{ fontWeight: 500 }}>Xin chào, {user.name}</Typography>
                                </Box>
                                <MenuItem
                                    component={Link}
                                    to={`/profile/${user.studentId}`}
                                    // sx={{ height: '64px' }}
                                    onClick={handleCloseUserMenu}
                                >
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText>Thông tin cá nhân</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={onLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText>Đăng xuất</ListItemText>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Box>
            </AppBar>
            <Box sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer
                    // container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {/* {drawer} */}
                    <Sidebar />
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {/* {drawer} */}
                    <Sidebar />
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    position: 'relative',
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}

export default DefaultLayout;
