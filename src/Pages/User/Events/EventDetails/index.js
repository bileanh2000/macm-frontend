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
    IconButton,
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
    Tooltip,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { useCallback, useState, Fragment, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Edit, EmojiEvents } from '@mui/icons-material';
import NumberFormat from 'react-number-format';

import TournamentOverview from './EventOverview';
import TournamentSchedule from './TournamentSchedule';
import eventApi from 'src/api/eventApi';
import CelebrationIcon from '@mui/icons-material/Celebration';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import NoValuePage from 'src/Components/NoValuePage';
import LoadingProgress from 'src/Components/LoadingProgress';
import RegisterEventDialog from '../RegisterEventDialog';
import ConfirmCancel from '../ConfirmDialog';
// import AdminTournament from '../AdminTournament';
// import MemberTournament from '../MemberTournament';

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

function UserEventDetails() {
    const now = new Date();

    let { id } = useParams();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [tournament, setTournament] = useState();
    const [scheduleList, setScheduleList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [value, setValue] = useState(0);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [isUpdateEvent, setIsUpdateEvent] = useState(false);
    const [dataStatus, setDataStatus] = useState('');
    const [eventJoined, setEventJoined] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    let navigate = useNavigate();

    const getEventById = async (id) => {
        try {
            const response = await eventApi.getEventById(id);
            console.log(response.data);
            setTournament(response.data[0]);
            setDataStatus(response.message);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    const fetchTournamentSchedule = async (params) => {
        try {
            const response = await eventApi.getEventScheduleByEvent(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
            // setDataStatus(response.message);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };
    const getListEventJoined = async (studentId) => {
        try {
            const response = await eventApi.getAllEventByStudentId(studentId);
            console.log(`List event joined by student Id`, response.data);
            setEventJoined(response.data);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    const checkEventJoined = () => {
        if (eventJoined.length !== 0) {
            if (eventJoined.find((item) => item.eventId === parseInt(id))) {
                console.log('dung cmnd', eventJoined);
                return true;
                // setIsJoined(true);
            } else {
                console.log('sai cmnd');
                // setIsJoined(false);
                return false;
            }
        } else {
            return false;
            // setIsJoined(false);
        }
    };
    const handleRegisterEventDeadline = () => {
        if (tournament) {
            if (new Date(tournament.registrationMemberDeadline) > now) {
                return true;
            } else {
                return false;
            }
        }
    };

    useEffect(() => {
        checkEventJoined();
        console.log(checkEventJoined());
        console.log('Event joined in useEffect', eventJoined);
    }, [eventJoined, id]);
    useEffect(() => {
        getEventById(id);
        fetchTournamentSchedule(id);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
        setIsUpdateEvent(false);
        getListEventJoined(user.studentId);
    }, [id, isUpdateEvent]);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.name + ' - ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['display'] = 'background';
        container['backgroundColor'] = '#5ba8f5';
        return container;
    });
    // console.log(tournament);

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
    const isUpdate = tournament && checkUpdate();

    const handleUpdateTournament = (data) => {
        setTournament(data);
    };

    if (dataStatus === 'Sự kiện này đã hủy' || dataStatus === 'Không có sự kiện này') {
        return <NoValuePage message="Hoạt động này không tồn tại hoặc đã bị xóa" />;
    }
    if (!scheduleList[0]) {
        return <LoadingProgress />;
    }
    return (
        <Box sx={{ m: 1, p: 1, height: '80vh' }}>
            {/* {tournament && scheduleList[0] && (
                
            )} */}

            {tournament && scheduleData.length > 0 && (
                <Fragment>
                    {tournament && (
                        <RegisterEventDialog
                            isOpen={openDialog}
                            handleClose={() => {
                                setOpenDialog(false);
                            }}
                            data={tournament}
                            onSucess={(newEvent) => {
                                console.log('newEvent', newEvent);
                                eventJoined && setEventJoined([newEvent, ...eventJoined]);
                            }}
                            onUpdateRoleQuantity={() => {
                                setIsUpdateEvent(true);
                            }}
                        />
                    )}
                    <ConfirmCancel
                        isOpen={openConfirmDialog}
                        handleClose={() => {
                            setOpenConfirmDialog(false);
                        }}
                        onSucess={(deleteEventId) => {
                            console.log('deleteEventId', deleteEventId);
                            eventJoined &&
                                setEventJoined((prev) =>
                                    prev.filter((item) => item.eventId !== parseInt(deleteEventId)),
                                );
                            // setChange(deleteEventId);
                        }}
                    />
                    <Paper elevation={3}>
                        <Container maxWidth="lg">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                                mb: 1,
                                            }}
                                        >
                                            <CelebrationIcon fontSize="large" sx={{ color: '#0ACE70' }} />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontSize: 'bold' }}>
                                            {tournament.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: 'bold' }}>
                                            {moment(scheduleData[0].date).format('DD/MM/yyyy')} -{' '}
                                            {moment(scheduleData[scheduleData.length - 1].date).format('DD/MM/yyyy')}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    {new Date(scheduleList[0].date) > new Date() ? (
                                        !checkEventJoined() ? (
                                            <Fragment>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => setOpenDialog(true)}
                                                    {...(handleRegisterEventDeadline()
                                                        ? { disabled: false }
                                                        : { disabled: true })}
                                                >
                                                    {handleRegisterEventDeadline()
                                                        ? 'Đăng ký tham gia'
                                                        : 'Hết hạn đăng ký'}
                                                </Button>
                                            </Fragment>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => setOpenConfirmDialog(true)}
                                                {...(handleRegisterEventDeadline()
                                                    ? { disabled: false }
                                                    : { disabled: true })}
                                            >
                                                Hủy đăng ký tham gia
                                            </Button>
                                        )
                                    ) : (
                                        ''
                                    )}
                                </Box>
                            </Box>
                            <Divider />
                            <Box>
                                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
                                    <Tab label="Tổng quan" {...a11yProps(0)} value={0} />
                                    <Tab label="Lịch sự kiện" {...a11yProps(1)} value={1} />
                                </Tabs>
                            </Box>
                        </Container>
                    </Paper>
                    <Paper elevation={3} sx={{ mt: 1 }}>
                        <Container maxWidth="lg">
                            <TournamentOverview
                                tournament={tournament}
                                onUpdateTournament={handleUpdateTournament}
                                value={value}
                                index={0}
                                schedule={scheduleList}
                                isUpdate={isUpdateEvent}
                            />
                            <TabPanel value={value} index={1}>
                                <TournamentSchedule isUpdate={isUpdate} />
                            </TabPanel>

                            {/* <TabPanel value={value} index={4}>
                                <AdminTournament isUpdate={isUpdate} user={user} />
                            </TabPanel>
                            <TabPanel value={value} index={5}>
                                <MemberTournament tournament={tournament} isUpdate={isUpdate} />
                            </TabPanel> */}
                        </Container>
                    </Paper>
                </Fragment>
            )}
        </Box>
    );
}

export default UserEventDetails;
