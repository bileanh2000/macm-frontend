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
    useEffect(() => {
        const fetchMemberReport = async () => {
            try {
                const response = await dashboardApi.getUserStatus();
                console.log('Member Report', response.data);
                let reverseList = response.data.sort((a, b) => b.id - a.id);
                setMemberReport(reverseList);
            } catch (error) {
                console.log('Failed when fetch member report', error);
            }
        };
        fetchMemberReport();

        getPersentMemberSinceLastSemester();
    }, []);

    const getPersentMemberSinceLastSemester = () => {
        let memberPersent =
            memberReport[0] &&
            Math.floor((memberReport[0].totalNumberUserInSemester / memberReport[1].totalNumberUserInSemester) * 100);
        console.log(memberPersent);
    };

    return (
        <Fragment>
            <Typography variant="h4" color="initial" sx={{ fontWeight: 500, mb: 2 }}>
                Dashboard
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="button" color="initial">
                                Tổng số thành viên
                            </Typography>
                            <Typography variant="h5" color="initial" sx={{ fontWeight: 500, mb: 1 }}>
                                {memberReport[0] && memberReport[0].totalNumberUserInSemester}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CustomPersentStatus
                                    persent={
                                        memberReport[0] &&
                                        Math.floor(
                                            (memberReport[0].totalNumberUserInSemester /
                                                memberReport[1].totalNumberUserInSemester) *
                                                100 -
                                                100,
                                        )
                                    }
                                />
                                <Typography variant="caption" color="initial" sx={{ ml: 1 }}>
                                    so với kỳ trước
                                </Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: '#ff569b', width: 48, height: 48 }}>
                            <PeopleIcon sx={{ fontSize: '2rem' }} />
                        </Avatar>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="button" color="initial">
                                Tổng tiền quỹ
                            </Typography>
                            <Typography variant="h5" color="initial" sx={{ fontWeight: 500, mb: 1 }}>
                                1,200,000 VND
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CustomPersentStatus persent="43" />
                                <Typography variant="caption" color="initial" sx={{ ml: 1 }}>
                                    so với tháng trước
                                </Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: '#16ce8e', width: 48, height: 48 }}>
                            <AttachMoneyRoundedIcon sx={{ fontSize: '2rem' }} />
                        </Avatar>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="button" color="initial">
                                Tổng số thành viên
                            </Typography>
                            <Typography variant="h5" color="initial" sx={{ fontWeight: 500, mb: 1 }}>
                                120 người
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CustomPersentStatus
                                    persent={
                                        memberReport[0] &&
                                        Math.floor(
                                            (memberReport[0].totalNumberUserInSemester /
                                                memberReport[1].totalNumberUserInSemester) *
                                                100,
                                        )
                                    }
                                />
                                <Typography variant="caption" color="initial" sx={{ ml: 1 }}>
                                    so với kỳ trước
                                </Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: '#ff569b', width: 48, height: 48 }}>
                            <PeopleIcon sx={{ fontSize: '2rem' }} />
                        </Avatar>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="button" color="initial">
                                Tổng số thành viên
                            </Typography>
                            <Typography variant="h5" color="initial" sx={{ fontWeight: 500, mb: 1 }}>
                                120 người
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CustomPersentStatus persent="-13" />
                                <Typography variant="caption" color="initial" sx={{ ml: 1 }}>
                                    so với kỳ trước
                                </Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: '#ff569b', width: 48, height: 48 }}>
                            <PeopleIcon sx={{ fontSize: '2rem' }} />
                        </Avatar>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
                    <Paper elevation={2} sx={{ padding: '16px' }}>
                        <MemberChart />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3} order={{ xs: 1, md: 2 }}>
                    <Paper elevation={2} sx={{ padding: '16px' }}>
                        <UpNext />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ padding: '16px' }}>
                        <Attendance />
                    </Paper>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default Home;
