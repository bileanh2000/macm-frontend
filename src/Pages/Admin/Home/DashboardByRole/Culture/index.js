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
import MemberChart from 'src/Pages/Admin/Home/Charts/Member';
import UpNext from 'src/Pages/Admin/Home/UpNext';
import Attendance from 'src/Pages/Admin/Home/Charts/Attendance';
import dashboardApi from 'src/api/dashboardApi';
import FeeReport from 'src/Pages/Admin/Home/Charts/Fee';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import semesterApi from 'src/api/semesterApi';
import LoadingProgress from 'src/Components/LoadingProgress';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { MenuItem, TextField } from '@mui/material';
import SquareIcon from '@mui/icons-material/Square';
import CommonSchedule from './CommonSchedule';
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
function CultureDashboard() {
    const [memberReport, setMemberReport] = useState([]);
    const [currentSemester, setCurrentSemester] = useState([]);
    const [activityReport, setActivityReport] = useState([]);
    const [semesterList, setSemesterList] = useState([]);
    const [semester, setSemester] = useState('Summer2022');
    const currentMonth = new Date().getMonth() + 1;
    const [startDateOfSemester, setStartDateOfSemester] = useState();

    const handleChange = (event) => {
        setSemester(event.target.value);
    };
    const fetchTop3Semester = async () => {
        try {
            const response = await semesterApi.getTop3Semester();
            console.log('fetchTop3Semester', response.data);
            setSemesterList(response.data);
        } catch (error) {
            console.log('Failed when fetch member report', error);
        }
    };

    const fetchActivityReport = async (semester) => {
        try {
            const response = await dashboardApi.getActivityReport(semester);
            console.log('fetchActivityReport', response);
            setActivityReport(response.data);
        } catch (error) {
            console.log('failed when fetchActivityReport', error);
        }
    };
    const getStartDateBySemester = (semester) => {
        let startDateBySemester = semesterList && semesterList.filter((item) => item.name === semester);
        startDateBySemester[0] && setStartDateOfSemester(startDateBySemester[0].startDate);
    };
    useEffect(() => {
        fetchTop3Semester();
    }, []);
    useEffect(() => {
        getStartDateBySemester(semester);
        fetchActivityReport(semester);
        console.log(startDateOfSemester);
    }, [semester, startDateOfSemester]);
    // useEffect(() => {
    //     console.log(balanceInCurrentMonth);
    // }, [balanceInCurrentMonth]);

    const gridContainer = {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
    };
    const gridItem = {
        margin: '8px',
        border: '1px solid red',
    };

    return (
        <Fragment>
            {activityReport[0] ? (
                <Fragment>
                    <Typography variant="h4" color="initial" sx={{ fontWeight: 500, mb: 2 }}>
                        Tổng Quan
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item md={9}>
                            <Paper elevation={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <TextField
                                        sx={{ margin: '16px 0px 0px 16px ' }}
                                        size="small"
                                        variant="outlined"
                                        id="standard-select"
                                        select
                                        label="Chọn kỳ"
                                        value={semester}
                                        onChange={handleChange}
                                    >
                                        {semesterList &&
                                            semesterList.map((semester) => (
                                                <MenuItem key={semester.id} value={semester.name}>
                                                    {semester.name}
                                                </MenuItem>
                                            ))}
                                    </TextField>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {/* <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                            <SquareIcon sx={{ color: '#9fccf9', mr: 0.5 }} />
                                            <span>Tập luyện</span>
                                        </Box> */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                            <SquareIcon sx={{ color: '#80ffc1', mr: 0.5 }} />
                                            <span>Sự kiện</span>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                            <SquareIcon sx={{ color: '#fce99c', mr: 0.5 }} />
                                            <span>Giải đấu</span>
                                        </Box>
                                    </Box>
                                </Box>
                                <CommonSchedule goDate={startDateOfSemester} />
                            </Paper>
                        </Grid>
                        <Grid item md={3}>
                            <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Typography variant="button" color="initial">
                                        Tổng số giải đấu
                                    </Typography>

                                    <Typography variant="h5" color="initial" sx={{ fontWeight: 500, mb: 1 }}>
                                        {activityReport[0].totalTournament}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#f9d441', width: 48, height: 48 }}>
                                    <EmojiEventsIcon sx={{ fontSize: '2rem' }} />
                                </Avatar>
                            </Paper>
                            <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Typography variant="button" color="initial">
                                        Tổng số sự kiện
                                    </Typography>
                                    <Typography variant="h5" color="initial" sx={{ fontWeight: 500, mb: 1 }}>
                                        {activityReport[0].totalEvent}
                                    </Typography>

                                    {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {memberReport[1] === undefined ? (
                                            <CustomPersentStatus persent={0} />
                                        ) : (
                                            <CustomPersentStatus
                                                persent={
                                                    memberReport[1] &&
                                                    Math.floor(
                                                        (memberReport[0].totalNumberUserInSemester /
                                                            memberReport[1].totalNumberUserInSemester) *
                                                            100 -
                                                            100,
                                                    )
                                                }
                                            />
                                        )}
                                        
                                        <Typography variant="caption" color="initial" sx={{ ml: 1 }}>
                                            so với kỳ trước
                                        </Typography>
                                    </Box> */}
                                </Box>
                                <Avatar sx={{ bgcolor: '#16ce8e', width: 48, height: 48 }}>
                                    <CelebrationIcon sx={{ fontSize: '2rem' }} />
                                </Avatar>
                            </Paper>
                            <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Typography variant="button" color="initial">
                                        Tỷ lệ tham gia giải đấu
                                    </Typography>
                                    <Typography variant="h5" color="initial" sx={{ fontWeight: 500, mb: 1 }}>
                                        {activityReport[0].averageJoinEvent}%
                                    </Typography>
                                    {/* {balanceInLastMonth[0] && balanceInLastMonth[0].balance === 0 ? null : (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CustomPersentStatus
                                                persent={
                                                    balanceInLastMonth[0] &&
                                                    balanceInCurrentMonth[0] &&
                                                    Math.floor(
                                                        (balanceInCurrentMonth[0].balance /
                                                            balanceInLastMonth[0].balance) *
                                                            100 -
                                                            100,
                                                    )
                                                }
                                            />
                                            <Typography variant="caption" color="initial" sx={{ ml: 1 }}>
                                                so với tháng trước
                                            </Typography>
                                        </Box>
                                    )} */}
                                </Box>
                                <Avatar sx={{ bgcolor: '#f9d441', width: 48, height: 48 }}>
                                    <HowToRegRoundedIcon sx={{ fontSize: '2rem' }} />
                                </Avatar>
                            </Paper>
                            <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Typography variant="button" color="initial">
                                        Tỷ lệ tham gia sự kiện
                                    </Typography>
                                    <Typography variant="h5" color="initial" sx={{ fontWeight: 500, mb: 1 }}>
                                        {activityReport[0].averageJoinTournament}%
                                    </Typography>

                                    {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CustomPersentStatus
                                            persent={
                                                memberReport[0] &&
                                                memberReport[1] &&
                                                Math.floor(
                                                    (memberReport[0].numberActiveInSemester /
                                                        memberReport[0].totalNumberUserInSemester /
                                                        (memberReport[1].numberActiveInSemester /
                                                            memberReport[1].totalNumberUserInSemester)) *
                                                        100 -
                                                        100,
                                                )
                                            }
                                        />
                                        <Typography variant="caption" color="initial" sx={{ ml: 1 }}>
                                            so với kỳ trước
                                        </Typography>
                                    </Box> */}
                                </Box>
                                <Avatar sx={{ bgcolor: '#16ce8e', width: 48, height: 48 }}>
                                    <HowToRegRoundedIcon sx={{ fontSize: '2rem' }} />
                                </Avatar>
                            </Paper>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={3}>
                           
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                           
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                           
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                            
                        </Grid> */}
                    </Grid>
                </Fragment>
            ) : (
                <LoadingProgress />
            )}
        </Fragment>
    );
}

export default CultureDashboard;
