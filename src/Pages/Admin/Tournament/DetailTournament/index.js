import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    InputAdornment,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { useCallback, useState, Fragment, useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import { Controller, useForm } from 'react-hook-form';
import { Edit, EmojiEvents } from '@mui/icons-material';
import NumberFormat from 'react-number-format';

import TournamentOverview from './TournamentOverview';
import TournamentSchedule from './TournamentSchedule';
import AdminTournament from '../AdminTournament';
import MemberTournament from '../MemberTournament';
import TournamentFee from './TournamentFee';
import TournamentBacket from './TournamentBacket';
import Preview from './TournamentSchedule/preview';
import { IfAnyGranted } from 'react-authorization';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <section
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{ padding: '1rem' }}
        >
            {value === index && children}
        </section>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function DetailTournament() {
    let { tournamentId } = useParams();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [tournament, setTournament] = useState();
    const [scheduleList, setScheduleList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [value, setValue] = useState(0);
    const [isRender, setIsRender] = useState(true);
    const [valueTab, SetValueTabs] = useState(0);
    const [type, SetType] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeTab = (newValue, tab, id) => {
        setValue(newValue);
        SetValueTabs(tab);
        SetType(id);
    };
    let navigate = useNavigate();

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // const fetchAdminInTournament = async (params) => {
    //     try {
    //         const response = await adminTournamentAPI.getAllTournamentOrganizingCommittee(params);
    //         console.log(response);
    //     } catch (error) {
    //         console.log('Failed to fetch admin list: ', error);
    //     }
    // };
    const getTournamentById = async (tournamentId) => {
        try {
            const response = await adminTournamentAPI.getTournamentById(tournamentId);
            console.log(response.data);
            setTournament(response.data[0]);

            setIsRender(false);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };

    const fetchTournamentSchedule = async (params) => {
        try {
            const response = await adminTournamentAPI.getTournamentSchedule(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };

    useEffect(() => {
        isRender && getTournamentById(tournamentId);
        fetchTournamentSchedule(tournamentId);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [tournamentId, tournament, isRender]);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] =
            item.tournament.name + ' - ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';
        return container;
    });
    console.log(tournament);

    const checkUpdate = () => {
        const nowDate = new Date();
        if (
            new Date(tournament.registrationOrganizingCommitteeDeadline) <= nowDate ||
            new Date(tournament.registrationPlayerDeadline) <= nowDate
        ) {
            return true;
        } else {
            return false;
        }
    };

    const checkFinish = () => {
        const nowDate = new Date();
        if (new Date(scheduleList[scheduleList.length - 1].date) <= nowDate) {
            return true;
        } else {
            return false;
        }
    };
    const isFinish = scheduleList.length > 0 && checkFinish();
    const isUpdate = tournament && checkUpdate();

    const handleDelete = useCallback(
        (id) => () => {
            handleCloseDialog();
            setTimeout(() => {
                adminTournamentAPI.deleteTournament(id).then((res) => {
                    console.log('delete', res);
                    console.log('delete', res.data);
                    navigate(-1);
                });
            });
        },
        [],
    );
    const handleUpdateTournament = (data) => {
        setTournament(data);
    };
    useEffect(() => {
        if (user.role.name === 'ROLE_Treasurer') {
            setValue(2);
        }
    }, []);
    return (
        <IfAnyGranted
            expected={['ROLE_HeadTechnique', 'ROLE_HeadClub', 'ROLE_ViceHeadTechnique', 'ROLE_Treasurer']}
            actual={JSON.parse(localStorage.getItem('currentUser')).role.name}
            unauthorized={<Navigate to="/forbidden" />}
        >
            <Box sx={{ m: 1, p: 1, height: '80vh' }}>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{`Bạn muốn xóa sự kiện này ?`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Sự kiện sẽ được xóa khỏi hệ thống !
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                        <Button onClick={handleDelete(tournamentId)} autoFocus>
                            Đồng ý
                        </Button>
                    </DialogActions>
                </Dialog>
                {tournament && scheduleData.length > 0 && (
                    <Fragment>
                        <Paper elevation={3}>
                            <Container maxWidth="lg">
                                <Box sx={{ display: 'flex', pt: 1 }}>
                                    <Box>
                                        <Box
                                            sx={{
                                                backgroundColor: '#F0F0F0',
                                                padding: 0.8,
                                                mr: 2,
                                                borderRadius: '10px',
                                                width: '4em',
                                                height: '4em',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flex: 1,
                                            }}
                                        >
                                            <EmojiEvents fontSize="large" sx={{ color: '#0ACE70' }} />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontSize: 'bold' }}>
                                            {tournament.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: 'bold' }}>
                                            {scheduleData[0].date} - {scheduleData[scheduleData.length - 1].date}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider />
                                <Box>
                                    {user.role.name === 'ROLE_Treasurer' ? (
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                        >
                                            <Tab label="Chi phí" {...a11yProps(2)} value={2} />
                                            <Tab label="Tổng quan" {...a11yProps(0)} value={0} />
                                            <Tab label="Lịch giải đấu" {...a11yProps(1)} value={1} />
                                        </Tabs>
                                    ) : user.role.name === 'ROLE_HeadClub' ||
                                      user.role.name === 'ROLE_HeadTechnique' ||
                                      user.role.name === 'ROLE_ViceHeadTechnique' ? (
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                        >
                                            <Tab label="Tổng quan" {...a11yProps(0)} value={0} />
                                            <Tab label="Lịch giải đấu" {...a11yProps(1)} value={1} />
                                            <Tab label="Chi phí" {...a11yProps(2)} value={2} />
                                            <Tab label="Danh sách ban tổ chức" {...a11yProps(3)} value={3} />
                                            <Tab label="Danh sách vận động viên" {...a11yProps(4)} value={4} />
                                            <Tab label="Bảng đấu" {...a11yProps(5)} value={5} />
                                        </Tabs>
                                    ) : (
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                        >
                                            <Tab label="Tổng quan" {...a11yProps(0)} value={0} />
                                            <Tab label="Lịch giải đấu" {...a11yProps(1)} value={1} />
                                            <Tab label="Chi phí" {...a11yProps(2)} value={2} />
                                            <Tab label="Bảng đấu" {...a11yProps(5)} value={5} />
                                        </Tabs>
                                    )}
                                </Box>
                            </Container>
                        </Paper>
                        <Paper elevation={3} sx={{ mt: 1 }}>
                            <TournamentOverview
                                tournament={tournament}
                                onUpdateTournament={handleUpdateTournament}
                                value={value}
                                index={0}
                                startTime={scheduleList[0].date}
                                isUpdate={isUpdate}
                                onChangeTab={handleChangeTab}
                            />
                            <TabPanel value={value} index={1}>
                                {user.role.name === 'ROLE_HeadClub' ||
                                user.role.name === 'ROLE_HeadTechnique' ||
                                user.role.name === 'ROLE_ViceHeadTechnique' ? (
                                    <TournamentSchedule isUpdate={isUpdate} />
                                ) : (
                                    <Preview />
                                )}
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <TournamentFee
                                    tournament={tournament}
                                    tournamentStatus={tournament.status}
                                    isFinish={isFinish}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <AdminTournament isUpdate={isUpdate} user={user} />
                            </TabPanel>
                            <TabPanel value={value} index={4}>
                                <MemberTournament
                                    tournament={tournament}
                                    tournamentStatus={tournament.status}
                                    isUpdate={isUpdate}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={5}>
                                <TournamentBacket
                                    tournament={tournament}
                                    tournamentStatus={tournament.status}
                                    valueTab={valueTab}
                                    type={type}
                                    endDate={
                                        scheduleList.length > 0 && new Date(scheduleList[scheduleList.length - 1].date)
                                    }
                                />
                            </TabPanel>
                        </Paper>
                    </Fragment>
                )}
            </Box>
        </IfAnyGranted>
    );
}

export default DetailTournament;
