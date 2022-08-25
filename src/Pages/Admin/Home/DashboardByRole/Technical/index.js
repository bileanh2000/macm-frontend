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
import DateRangeIcon from '@mui/icons-material/DateRange';
import PercentIcon from '@mui/icons-material/Percent';
import trainingScheduleApi from 'src/api/trainingScheduleApi';
import notificationApi from 'src/api/notificationApi';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import PaymentNotification from 'src/Pages/Home/PaymentNotification';

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
function TechnicalDashboard() {
    const [memberReport, setMemberReport] = useState([]);
    const [feeReport, setFeeReport] = useState([]);
    const [balanceInCurrentMonth, setBalanceInCurrentMonth] = useState([]);
    const [balanceInLastMonth, setBalanceInLastMonth] = useState([]);
    const [currentSemester, setCurrentSemester] = useState(1);
    const [totalTrainingSchedule, setTotalTrainingSchedule] = useState(1);
    const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState([]);
    const studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;

    const currentMonth = new Date().getMonth() + 1;

    const fetchPaymentNotification = async (studentId) => {
        try {
            const response = await notificationApi.checkPaymentStatus(studentId);
            console.log('fetchPaymentNotification', response);
            setPaymentMessage(response.message);
        } catch (error) {
            console.log('failed when fetchPaymentNotification', error);
        }
    };
    const fetchMemberReport = async () => {
        try {
            const response = await dashboardApi.getUserStatus();
            console.log('Member Report', response.data);
            let reverseList = response.data.sort((a, b) => b.id - a.id);
            // let filterByMonth = response.data.filter((item) => item.month === currentMonth);
            // setBalanceInCurrentMonth(filterByMonth);
            setMemberReport(reverseList);
        } catch (error) {
            console.log('Failed when fetch member report', error);
        }
    };
    const fetchTrainingSchedule = async (currentSemester) => {
        try {
            const response = await trainingScheduleApi.getAllScheduleBySemester(currentSemester);
            console.log('fetchTrainingSchedule', response.data);

            setTotalTrainingSchedule(response.data.length);
            // let filterByMonth = response.data.filter((item) => item.month === currentMonth);
            // setBalanceInCurrentMonth(filterByMonth);
            // setMemberReport(reverseList);
        } catch (error) {
            console.log('Failed when fetch fetchTrainingSchedule', error);
        }
    };
    const handleOpenNotificationDialog = () => {
        setOpenNotificationDialog(true);
    };
    const handleCloseNotificationDialog = () => {
        // setAlreadyVisited(false);
        localStorage.removeItem('toShowPopup');
        setOpenNotificationDialog(false);
    };
    useEffect(() => {
        fetchMemberReport();
        getPersentMemberSinceLastSemester();
        fetchTrainingSchedule(currentSemester);
        fetchPaymentNotification(studentId);
    }, [currentSemester]);

    useEffect(() => {
        let visited = localStorage['toShowPopup'] !== 'true';
        if (!visited) {
            handleOpenNotificationDialog();
        }
        // if (!visited && paymentMessage === 'Không có khoản nào phải đóng') {
        //     handleOpenNotificationDialog();
        // }
    }, []);

    useEffect(() => {
        if (paymentMessage === 'Không có khoản nào phải đóng') {
            handleCloseNotificationDialog();
        }
    }, [paymentMessage]);

    const getPersentMemberSinceLastSemester = () => {
        let memberPersent =
            memberReport[0] &&
            Math.floor((memberReport[0].totalNumberUserInSemester / memberReport[1].totalNumberUserInSemester) * 100);
        console.log(memberPersent);
    };
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
            <Dialog
                open={openNotificationDialog}
                onClose={handleCloseNotificationDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description"></DialogContentText> */}
                    <PaymentNotification />
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={handleCloseNotificationDialog}>Disagree</Button> */}
                    <Button onClick={handleCloseNotificationDialog} autoFocus>
                        Thoát
                    </Button>
                </DialogActions>
            </Dialog>
            {memberReport[0] ? (
                <Fragment>
                    <Typography variant="h4" color="initial" sx={{ fontWeight: 500, mb: 2 }}>
                        Tổng Quan
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={4}>
                            <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="button" color="initial">
                                        Tổng số buổi tập trong kỳ
                                    </Typography>
                                    <Typography variant="h5" color="initial" sx={{ fontWeight: 500, mb: 1 }}>
                                        {totalTrainingSchedule}
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
                                <Avatar sx={{ bgcolor: '#ff569b', width: 48, height: 48 }}>
                                    <DateRangeIcon sx={{ fontSize: '2rem' }} />
                                </Avatar>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="button" color="initial">
                                        Trung bình số người tham gia mỗi buổi
                                    </Typography>
                                    <Typography variant="h5" color="initial" sx={{ fontWeight: 500, mb: 1 }}>
                                        87%
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
                                <Avatar sx={{ bgcolor: '#35C0DE', width: 48, height: 48 }}>
                                    <PercentIcon sx={{ fontSize: '2rem' }} />
                                </Avatar>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
                            <Paper elevation={2} sx={{ padding: '16px' }}>
                                <Attendance />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={3} order={{ xs: 1, md: 2 }}>
                            <Paper elevation={2} sx={{ padding: '16px' }}>
                                <UpNext isAdmin={true} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Fragment>
            ) : (
                <LoadingProgress />
            )}
        </Fragment>
    );
}

export default TechnicalDashboard;
