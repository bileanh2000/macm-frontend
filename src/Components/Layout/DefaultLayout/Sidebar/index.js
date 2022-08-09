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
import { Toolbar } from '@mui/material';
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

function Sidebar() {
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
            {/* <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/facility"
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
            >
                <ListItemIcon>
                    <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Cơ Sở Vật Chất" />
            </ListItem> */}
            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/trainingschedules"
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
            >
                <ListItemIcon>
                    <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Lịch Tập" />
            </ListItem>
            <Divider />

            {/* <ListItem
                button
                component={Link}
                to="/admin/attendance"
                selected={selectedIndex === 5}
                onClick={(event) => handleListItemClick(event, 5)}
            ></ListItem> */}
            <ListItem button onClick={handleClickAttendance}>
                <ListItemIcon>
                    <HowToRegIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Điểm danh" />
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
                        selected={selectedIndex === 1}
                        onClick={(event) => handleListItemClick(event, 1)}
                    >
                        <ListItemIcon>
                            <PeopleAltRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Điểm danh hôm nay" />
                    </ListItem>
                    <ListItem
                        button
                        sx={{ pl: 4 }}
                        component={Link}
                        to="/admin/editattendance"
                        selected={selectedIndex === 2}
                        onClick={(event) => handleListItemClick(event, 2)}
                    >
                        <ListItemIcon>
                            <PsychologyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Chỉnh sửa điểm danh" />
                    </ListItem>
                </List>
            </Collapse>

            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/contact"
                selected={selectedIndex === 6}
                onClick={(event) => handleListItemClick(event, 6)}
            >
                <ListItemIcon>
                    <ContactPageIcon />
                </ListItemIcon>
                <ListItemText primary="Trang Liên Hệ" />
            </ListItem>
            <Divider />
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
                        selected={selectedIndex === 1}
                        onClick={(event) => handleListItemClick(event, 1)}
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
                        selected={selectedIndex === 2}
                        onClick={(event) => handleListItemClick(event, 2)}
                    >
                        <ListItemIcon>
                            <Savings />
                        </ListItemIcon>
                        <ListItemText primary="Quỹ câu lạc bộ" />
                    </ListItem>
                </List>
            </Collapse>

            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/rules"
                selected={selectedIndex === 8}
                onClick={(event) => handleListItemClick(event, 8)}
            >
                <ListItemIcon>
                    <RuleIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Nội Quy" />
            </ListItem>
            <Divider />

            <ListItem
                button
                component={Link}
                to="/admin/tournament"
                selected={selectedIndex === 9}
                onClick={(event) => handleListItemClick(event, 9)}
            >
                <ListItemIcon>
                    <EmojiEventsIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Giải Đấu" />
            </ListItem>
            {/* <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/news"
                selected={selectedIndex === 10}
                onClick={(event) => handleListItemClick(event, 10)}
            >
                <ListItemIcon>
                    <FeedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Tin Tức" />
            </ListItem> */}
            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/events"
                selected={selectedIndex === 11}
                onClick={(event) => handleListItemClick(event, 11)}
            >
                <ListItemIcon>
                    <CelebrationIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Sự Kiện" />
            </ListItem>
            <Divider />
        </List>

        // <React.Fragment>
        //     <h2>Sidebar</h2>
        //     <nav>
        //         <ul>
        //             <li>
        //                 <Link to="/admin">Trang chủ</Link>
        //             </li>
        //             <li>
        //                 <Link to="/admin/users">Quản lý thành viên</Link>
        //             </li>
        //         </ul>
        //     </nav>
        // </React.Fragment>
    );
}

export default Sidebar;
