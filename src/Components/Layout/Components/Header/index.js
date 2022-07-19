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
import { ListItemIcon, ListItemText } from '@mui/material';
import RuleIcon from '@mui/icons-material/Rule';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const pages = ['1', '2', '3'];
const settings = ['Tài khoản', 'Đăng xuất'];

function Header({ onLogout }) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

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
    return (
        <header className={cx('wrapper')}>
            <AppBar position="static">
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
                                {/* {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))} */}
                                <MenuItem component={Link} to="/events" onClick={handleCloseNavMenu}>
                                    <ListItemIcon>
                                        <CelebrationIcon />
                                    </ListItemIcon>
                                    <ListItemText>Sự kiện</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <ListItemIcon>
                                        <EmojiEventsIcon />
                                    </ListItemIcon>
                                    <ListItemText>Giải đấu</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
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
                            {/* {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))} */}
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
                            <MenuItem onClick={handleCloseNavMenu} sx={{ height: '64px' }}>
                                <ListItemIcon>
                                    <EmojiEventsIcon sx={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText>Giải đấu</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu} sx={{ height: '64px' }}>
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
                        <Box sx={{ flexGrow: 0 }}>
                            {/* <Tooltip title="Open settings"> */}
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="https://congcaphe.com/_next/static/images/vn-66e76189e15384f6034e56f129991d96.png"
                                />
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
                                <MenuItem onClick={handleCloseUserMenu}>
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
