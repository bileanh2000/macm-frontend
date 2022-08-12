import { Fragment, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import PeopleIcon from '@mui/icons-material/People';
import { Box } from '@mui/system';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import MemberChart from './Charts/Member';
import UpNext from './UpNext';
import Attendance from './Charts/Attendance';
import dashboardApi from 'src/api/dashboardApi';
import FeeReport from './Charts/Fee';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import semesterApi from 'src/api/semesterApi';
import LoadingProgress from 'src/Components/LoadingProgress';
import HeadClubDashboard from './DashboardByRole/Headclub';
import TreasurerDashboard from './DashboardByRole/Treasurer';
import TechnicalDashboard from './DashboardByRole/Technical';
import CultureDashboard from './DashboardByRole/Culture';

export const CustomPersentStatus = ({ persent }) => {
    let bgColor = '#ccf5e7';
    let color = '#0bce89';
    if (Number(persent) < 0) {
        bgColor = '#ffd5e1';
        color = '#ff3e6e';
    }
    return (
        <Box
            component="span"
            sx={{
                bgcolor: bgColor,
                color: color,
                padding: '2px 8px 2px 8px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.8rem',
            }}
        >
            {Number(persent) < 0 ? (
                <ArrowDownwardRoundedIcon sx={{ fontSize: '0.8em' }} />
            ) : (
                <ArrowUpwardRoundedIcon sx={{ fontSize: '0.8em' }} />
            )}{' '}
            {persent}%
        </Box>
    );
};
function Home() {
    const [memberReport, setMemberReport] = useState([]);
    const [feeReport, setFeeReport] = useState([]);
    const [balanceInCurrentMonth, setBalanceInCurrentMonth] = useState([]);
    const [balanceInLastMonth, setBalanceInLastMonth] = useState([]);
    const [currentSemester, setCurrentSemester] = useState([]);
    const ROLE = JSON.parse(localStorage.getItem('currentUser')).role.name;

    const currentMonth = new Date().getMonth() + 1;

    if (ROLE === 'ROLE_HeadClub' || ROLE === 'ROLE_ViceHeadClub') {
        return <HeadClubDashboard />;
    }
    if (ROLE === 'ROLE_Treasurer') {
        return <TreasurerDashboard />;
    }
    if (ROLE === 'ROLE_HeadTechnique' || ROLE === 'ROLE_ViceHeadTechnique') {
        return <TechnicalDashboard />;
    }
    if (
        ROLE === 'ROLE_HeadCulture' ||
        ROLE === 'ROLE_ViceHeadCulture' ||
        ROLE === 'ROLE_HeadCommunication' ||
        ROLE === 'ROLE_ViceHeadCommunication'
    ) {
        return <CultureDashboard />;
    }
}

export default Home;
