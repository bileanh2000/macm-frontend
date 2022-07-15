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

function Sidebar() {
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [open, setOpen] = React.useState(false);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handleClick = () => {
        setOpen(!open);
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
                <ListItemText primary="Dashboard" />
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
            </ListItem>
            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/trainingschedules"
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}
            >
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Lịch Tập" />
            </ListItem>
            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/attendance"
                selected={selectedIndex === 5}
                onClick={(event) => handleListItemClick(event, 5)}
            >
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Điểm danh" />
            </ListItem>
            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/contact"
                selected={selectedIndex === 6}
                onClick={(event) => handleListItemClick(event, 6)}
            >
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Trang Liên Hệ" />
            </ListItem>
            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/clubfee"
                selected={selectedIndex === 7}
                onClick={(event) => handleListItemClick(event, 7)}
            >
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Chi Phí CLB" />
            </ListItem>
            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/rules"
                selected={selectedIndex === 8}
                onClick={(event) => handleListItemClick(event, 8)}
            >
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
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
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Giải Đấu" />
            </ListItem>
            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/news"
                selected={selectedIndex === 10}
                onClick={(event) => handleListItemClick(event, 10)}
            >
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Tin Tức" />
            </ListItem>
            <Divider />
            <ListItem
                button
                component={Link}
                to="/admin/events"
                selected={selectedIndex === 11}
                onClick={(event) => handleListItemClick(event, 11)}
            >
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
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
