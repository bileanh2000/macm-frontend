import classNames from 'classnames/bind';
import * as React from 'react';
import styles from './Header.module.scss';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircleIcon from '@mui/icons-material/Circle';
import { useGlobalState, setGlobalState } from 'src/state';
import 'moment/locale/vi';

import {
    Badge,
    Divider,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Pagination,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from '@mui/material';
import RuleIcon from '@mui/icons-material/Rule';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { Link } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import moment from 'moment';
import adminNewsAPI from 'src/api/adminNewsAPI';
import { useNavigate } from 'react-router-dom';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import notificationApi from 'src/api/notificationApi';

const cx = classNames.bind(styles);

function Header({ onLogout }) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [anchorEl, setAnchorEl] = React.useState(false);
    const [newsList, setNews] = React.useState([]);
    const navigator = useNavigate();
    const [checked, setChecked] = React.useState(false);
    const [totalUnRead, setTotalUnRead] = React.useState(0);
    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;
    const [notiStatus, setNotiStatus] = React.useState(0);
    const [totalNotification] = useGlobalState('totalNotification');
    moment().locale('vi');
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const open = Boolean(anchorEl);
    // let notiCount = localStorage.getItem('notiCount');

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

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

    React.useEffect(() => {
        if (notiStatus) {
            fetchUnreadNotification(studentId, page - 1);
        } else {
            fetchNewsList(studentId, page - 1);
        }
    }, [notiStatus, page]);

    const handleClickAway = () => {
        setChecked(false);
    };
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        console.log(index);
    };
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleClickNotification = () => {
        setChecked((prev) => !prev);
    };

    const handleChange = (event, value) => {
        setPage(value);
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
    return (
        <header className={cx('wrapper')}>
            <AppBar position="fixed">
                <Box sx={{ padding: '0px 16px 0px 16px' }}>
                    <Toolbar disableGutters>
                        <SportsMartialArtsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/home"
                            // href="/home"

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
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            {/* mobile */}
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                <MenuItem component={Link} to="/events" onClick={handleCloseNavMenu}>
                                    <ListItemIcon>
                                        <CelebrationIcon />
                                    </ListItemIcon>
                                    <ListItemText>Sự kiện</ListItemText>
                                </MenuItem>
                                <MenuItem component={Link} to="/tournament" onClick={handleCloseNavMenu}>
                                    <ListItemIcon>
                                        <EmojiEventsIcon />
                                    </ListItemIcon>
                                    <ListItemText>Giải đấu</ListItemText>
                                </MenuItem>
                                <MenuItem component={Link} to="/rule" onClick={handleCloseNavMenu}>
                                    <ListItemIcon>
                                        <RuleIcon />
                                    </ListItemIcon>
                                    <ListItemText>Nội quy</ListItemText>
                                </MenuItem>

                                <MenuItem onClick={handleCloseNavMenu}>
                                    <ListItemIcon>
                                        <ContactPageIcon />
                                    </ListItemIcon>
                                    <ListItemText>Liên hệ</ListItemText>
                                </MenuItem>
                            </Menu>
                        </Box>

                        <SportsMartialArtsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            // component="a"
                            // href="/home"
                            component={Link}
                            to="/home"
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
                        <Box
                            sx={{
                                height: '64px',
                                mr: 3,
                                flexGrow: 1,
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                textAlign: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <MenuItem
                                component={Link}
                                to="/events"
                                selected={selectedIndex === 0}
                                onClick={(event) => handleListItemClick(event, 0)}
                                sx={{ height: '64px' }}
                            >
                                <ListItemIcon>
                                    <CelebrationIcon sx={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText>Sự kiện</ListItemText>
                            </MenuItem>
                            <MenuItem
                                component={Link}
                                to="/tournament"
                                selected={selectedIndex === 1}
                                onClick={(event) => handleListItemClick(event, 1)}
                                sx={{ height: '64px' }}
                            >
                                <ListItemIcon>
                                    <EmojiEventsIcon sx={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText>Giải đấu</ListItemText>
                            </MenuItem>
                            <MenuItem
                                component={Link}
                                to="/rule"
                                selected={selectedIndex === 2}
                                onClick={(event) => handleListItemClick(event, 2)}
                                sx={{ height: '64px' }}
                            >
                                <ListItemIcon>
                                    <RuleIcon sx={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText>Nội quy</ListItemText>
                            </MenuItem>

                            <MenuItem onClick={handleCloseNavMenu} sx={{ height: '64px' }}>
                                <ListItemIcon>
                                    <ContactPageIcon sx={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText>Liên hệ</ListItemText>
                            </MenuItem>
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
                                        {totalNotification !== 0 ? (
                                            <Badge
                                                sx={{
                                                    '& .MuiBadge-badge': {
                                                        backgroundColor: '#FF4444',
                                                    },
                                                }}
                                                badgeContent={totalNotification}
                                            >
                                                <NotificationsIcon />
                                            </Badge>
                                        ) : (
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
                                        )}
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
                            {/* <Tooltip title="Open settings"> */}
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="avatar" src={user.image} />
                            </IconButton>
                            {/* </Tooltip> */}
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
                                <MenuItem
                                    component={Link}
                                    to={`/${user.studentId}`}
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
        </header>
    );
}

export default Header;
