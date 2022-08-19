import * as React from 'react';
// import { styled, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ListItemIcon from '@mui/material/ListItemIcon';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
// import { Button } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

import PsychologyIcon from '@mui/icons-material/Psychology';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Box, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import PaidIcon from '@mui/icons-material/Paid';
import RuleIcon from '@mui/icons-material/Rule';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FeedIcon from '@mui/icons-material/Feed';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { PriceCheck, Savings } from '@mui/icons-material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Sidebar() {
    const ROLE = JSON.parse(localStorage.getItem('currentUser')).role.name;
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    const [openFee, setOpenFee] = React.useState(false);
    const [openAttendance, setOpenAttendance] = React.useState(false);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handleClick = () => {
        setOpen(!open);
    };

    const handleClickFee = () => {
        setOpenFee(!openFee);
    };

    const handleClickAttendance = () => {
        setOpenAttendance(!openAttendance);
    };

    return (
        <>
            <List>
                <Toolbar />
                <ListItem
                    button
                    component={Link}
                    to="/admin"
                    selected={selectedIndex === 0}
                    onClick={(event) => handleListItemClick(event, 0)}
                >
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Tổng Quan" />
                </ListItem>
                <Divider />
                <ListItem button onClick={handleClick}>
                    <ListItemIcon>
                        <ManageAccountsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản Lý Người Dùng" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem
                            button
                            sx={{ pl: 4 }}
                            component={Link}
                            to="/admin/member"
                            selected={selectedIndex === 1}
                            onClick={(event) => handleListItemClick(event, 1)}
                        >
                            <ListItemIcon>
                                <PeopleAltRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Thành viên và CTV" />
                        </ListItem>
                        <ListItem
                            button
                            sx={{ pl: 4 }}
                            component={Link}
                            to="/admin/headofdepartment"
                            selected={selectedIndex === 2}
                            onClick={(event) => handleListItemClick(event, 2)}
                        >
                            <ListItemIcon>
                                <PsychologyIcon />
                            </ListItemIcon>
                            <ListItemText primary="Ban Chủ Nhiệm" />
                        </ListItem>
                    </List>
                </Collapse>
                <Divider />
                <ListItem button onClick={handleClickAttendance}>
                    <ListItemIcon>
                        <HowToRegIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản Lý Điểm Danh" />
                    {openAttendance ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openAttendance} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem
                            button
                            sx={{ pl: 4 }}
                            component={Link}
                            to="/admin/attendance"
                            state={{
                                id: null,
                                date: null,
                            }}
                            selected={selectedIndex === 4}
                            onClick={(event) => handleListItemClick(event, 4)}
                        >
                            <ListItemIcon>
                                <PeopleAltRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Điểm danh hôm nay" />
                        </ListItem>
                        {ROLE === 'ROLE_HeadClub' ||
                        ROLE === 'ROLE_ViceHeadClub' ||
                        ROLE === 'ROLE_HeadTechnique' ||
                        ROLE === 'ROLE_ViceHeadTechnique' ? (
                            <ListItem
                                button
                                sx={{ pl: 4 }}
                                component={Link}
                                to="/admin/editattendance"
                                selected={selectedIndex === 5}
                                onClick={(event) => handleListItemClick(event, 5)}
                            >
                                <ListItemIcon>
                                    <PsychologyIcon />
                                </ListItemIcon>
                                <ListItemText primary="Chỉnh sửa điểm danh" />
                            </ListItem>
                        ) : null}
                        <ListItem
                            button
                            sx={{ pl: 4 }}
                            component={Link}
                            to="/admin/attendance/report"
                            selected={selectedIndex === 6}
                            onClick={(event) => handleListItemClick(event, 6)}
                        >
                            <ListItemIcon>
                                <AssessmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Báo cáo điểm danh" />
                        </ListItem>
                    </List>
                </Collapse>
                {ROLE !== 'ROLE_Treasurer' ? (
                    <>
                        <Divider />

                        <ListItem
                            button
                            component={Link}
                            to="/admin/trainingschedules"
                            selected={selectedIndex === 3}
                            onClick={(event) => handleListItemClick(event, 3)}
                        >
                            <ListItemIcon>
                                <CalendarMonthIcon />
                            </ListItemIcon>
                            <ListItemText primary="Quản Lý Lịch Tập" />
                        </ListItem>
                        {ROLE === 'ROLE_HeadClub' ||
                        ROLE === 'ROLE_HeadTechnique' ||
                        ROLE === 'ROLE_ViceHeadTechnique' ? (
                            <>
                                <Divider />
                                <ListItem
                                    button
                                    component={Link}
                                    to="/admin/tournament"
                                    selected={selectedIndex === 11}
                                    onClick={(event) => handleListItemClick(event, 11)}
                                >
                                    <ListItemIcon>
                                        <EmojiEventsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Quản Lý Giải Đấu" />
                                </ListItem>
                            </>
                        ) : null}

                        <Divider />
                        <ListItem
                            button
                            component={Link}
                            to="/admin/events"
                            selected={selectedIndex === 12}
                            onClick={(event) => handleListItemClick(event, 12)}
                        >
                            <ListItemIcon>
                                <CelebrationIcon />
                            </ListItemIcon>
                            <ListItemText primary="Quản Lý Sự Kiện" />
                        </ListItem>

                        <Divider />
                    </>
                ) : null}
                {ROLE === 'ROLE_Treasurer' || ROLE === 'ROLE_HeadClub' ? (
                    <>
                        <ListItem button onClick={handleClickFee}>
                            <ListItemIcon>
                                <PaidIcon />
                            </ListItemIcon>
                            <ListItemText primary="Quản Lý Chi Phí CLB" />
                            {openFee ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openFee} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItem
                                    button
                                    sx={{ pl: 4 }}
                                    component={Link}
                                    to="/admin/membership"
                                    selected={selectedIndex === 8}
                                    onClick={(event) => handleListItemClick(event, 8)}
                                >
                                    <ListItemIcon>
                                        <PriceCheck />
                                    </ListItemIcon>
                                    <ListItemText primary="Phí duy trì CLB" />
                                </ListItem>
                                <ListItem
                                    button
                                    sx={{ pl: 4 }}
                                    component={Link}
                                    to="/admin/fund"
                                    selected={selectedIndex === 9}
                                    onClick={(event) => handleListItemClick(event, 9)}
                                >
                                    <ListItemIcon>
                                        <Savings />
                                    </ListItemIcon>
                                    <ListItemText primary="Quỹ câu lạc bộ" />
                                </ListItem>
                                {ROLE === 'ROLE_Treasurer' ? (
                                    <>
                                        <ListItem
                                            button
                                            sx={{ pl: 4 }}
                                            component={Link}
                                            to="/admin/tournament"
                                            selected={selectedIndex === 11}
                                            onClick={(event) => handleListItemClick(event, 11)}
                                        >
                                            <ListItemIcon>
                                                <EmojiEventsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Chi Phí Giải Đấu" />
                                        </ListItem>
                                        <ListItem
                                            button
                                            sx={{ pl: 4 }}
                                            component={Link}
                                            to="/admin/events"
                                            selected={selectedIndex === 12}
                                            onClick={(event) => handleListItemClick(event, 12)}
                                        >
                                            <ListItemIcon>
                                                <CelebrationIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Chi Phí Sự Kiện" />
                                        </ListItem>
                                    </>
                                ) : null}
                            </List>
                        </Collapse>

                        <Divider />
                    </>
                ) : null}
                {ROLE === 'ROLE_HeadClub' ||
                ROLE === 'ROLE_ViceHeadClub' ||
                ROLE === 'ROLE_HeadCulture' ||
                ROLE === 'ROLE_ViceHeadCulture' ? (
                    <>
                        <ListItem
                            button
                            component={Link}
                            to="/admin/rules"
                            selected={selectedIndex === 10}
                            onClick={(event) => handleListItemClick(event, 10)}
                        >
                            <ListItemIcon>
                                <RuleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Danh Sách Nội Quy CLB" />
                        </ListItem>
                        <Divider />
                    </>
                ) : null}
                {ROLE === 'ROLE_HeadClub' ||
                ROLE === 'ROLE_ViceHeadClub' ||
                ROLE === 'ROLE_HeadCommunication' ||
                ROLE === 'ROLE_ViceHeadCommunication' ? (
                    <>
                        <ListItem
                            button
                            component={Link}
                            to="/admin/contact"
                            selected={selectedIndex === 7}
                            onClick={(event) => handleListItemClick(event, 7)}
                        >
                            <ListItemIcon>
                                <ContactPageIcon />
                            </ListItemIcon>
                            <ListItemText primary="Trang Liên Hệ" />
                        </ListItem>
                        <Divider />
                    </>
                ) : null}
            </List>
            <ListItem
                sx={{ position: 'absolute', bottom: 0 }}
                button
                component={Link}
                to="/home"
                selected={selectedIndex === 8}
                onClick={(event) => handleListItemClick(event, 8)}
            >
                <ListItemIcon>
                    <ArrowBackIcon />
                </ListItemIcon>
                <ListItemText primary="Quay về trang chủ" />
            </ListItem>
        </>
    );
}

export default Sidebar;
