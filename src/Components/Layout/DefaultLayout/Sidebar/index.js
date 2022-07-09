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

const cx = classNames.bind(styles);

// const style = {
//     width: '100%',
//     maxWidth: 260,
//     bgcolor: 'background.paper',
// };

function Sidebar() {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <List>
            <Toolbar />
            <ListItem button component={Link} to="/admin">
                <ListItemIcon>
                    <HomeRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Trang Chủ" />
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
                    <ListItem button sx={{ pl: 4 }} component={Link} to="/admin/member">
                        <ListItemIcon>
                            <PeopleAltRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Thành viên và CTV" />
                    </ListItem>
                    <ListItem button sx={{ pl: 4 }} component={Link} to="/admin/headofdepartment">
                        <ListItemIcon>
                            <PsychologyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Ban Chủ Nhiệm" />
                    </ListItem>
                </List>
            </Collapse>
            <Divider />
            <ListItem button component={Link} to="/admin/facility">
                <ListItemIcon>
                    <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Cơ Sở Vật Chất" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/admin/trainingschedules">
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Lịch Tập" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/admin/attendance">
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Điểm danh" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/admin/contact">
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Trang Liên Hệ" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/admin/clubfee">
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Chi Phí CLB" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/admin/rules">
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Nội Quy" />
            </ListItem>
            <Divider />

            <ListItem button component={Link} to="/admin/tournament">
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Giải Đấu" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/admin/news">
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Quản Lý Tin Tức" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/admin/events">
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
