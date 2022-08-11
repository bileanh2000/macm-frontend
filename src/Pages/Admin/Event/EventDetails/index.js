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
import MenberEvent from '../MenberEvent';
import MemberList from '../MenberEvent/MemberList';
import CelebrationIcon from '@mui/icons-material/Celebration';
import moment from 'moment';
import AdminTournament from './AdminTournament';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateTournamentOverview from './EventOverview/UpdateEventOverview';
import { useSnackbar } from 'notistack';
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

function EventDetails() {
    let { id } = useParams();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [tournament, setTournament] = useState();
    const [scheduleList, setScheduleList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [value, setValue] = useState(0);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    let navigate = useNavigate();

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const getEventById = async (id) => {
        try {
            const response = await eventApi.getEventById(id);
            console.log(response.data);
            setTournament(response.data[0]);
        } catch (error) {
            console.log('Lấy dữ liệu thất bại', error);
        }
    };
    const fetchTournamentSchedule = async (params) => {
        try {
            const response = await eventApi.getEventScheduleByEvent(params);
            console.log('Thanh cong roi: ', response);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };

    useEffect(() => {
        getEventById(id);
        fetchTournamentSchedule(id);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [id]);

    const scheduleData = scheduleList.map((item) => {
        const container = {};
        container['id'] = item.id;
        container['date'] = item.date;
        container['title'] = item.name + ' - ' + item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
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
    const isUpdate = tournament && checkUpdate();

    const handleDelete = useCallback(
        (id) => () => {
            setTimeout(() => {
                eventApi.deleteEvent(id).then((res) => {
                    if (res.data.length !== 0) {
                        console.log('delete', res);
                        console.log('delete', res.data);
                        enqueueSnackbar(res.message, { variant: 'success' });
                        handleCloseDialog();

                        navigate(-1);
                    } else {
                        enqueueSnackbar(res.message, { variant: 'error' });
                        handleCloseDialog();
                    }
                });
            });
        },
        [],
    );
    const handleUpdateTournament = (data) => {
        setTournament(data);
    };

    return (
        <Box sx={{ m: 1, p: 1, height: '80vh' }}>
            {tournament && scheduleList[0] && (
                <UpdateTournamentOverview
                    // DialogOpen={true}
                    data={tournament}
                    title="Cập nhật thông tin sự kiện"
                    isOpen={openEditDialog}
                    handleClose={() => {
                        setOpenEditDialog(false);
                        // reload();
                    }}
                    onSuccess={(newItem) => {
                        // onUpdateTournament(newItem);
                        setOpenEditDialog(false);
                    }}
                    schedule={scheduleList}
                />
            )}
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
                    <Button onClick={handleDelete(id)} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            {tournament && scheduleData.length > 0 && (
                <Fragment>
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
                                {new Date(scheduleData[0].date) > new Date() ? (
                                    <Box>
                                        <Tooltip title="Chỉnh sửa">
                                            <IconButton aria-label="edit" onClick={() => setOpenEditDialog(true)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton aria-label="delete" onClick={() => setOpenDialog(true)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                ) : null}
                            </Box>
                            <Divider />
                            <Box>
                                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
                                    <Tab label="Tổng quan" {...a11yProps(0)} value={0} />
                                    <Tab label="Lịch sự kiện" {...a11yProps(1)} value={1} />
                                    <Tab label="Danh sách thành viên BTC" {...a11yProps(2)} value={2} />
                                    <Tab label="Danh sách thành viên tham gia" {...a11yProps(3)} value={3} />
                                    <Tab label="Chi phí" {...a11yProps(4)} value={4} />
                                    <Tab label="Điểm danh" {...a11yProps(5)} value={5} />
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
                                isUpdate={isUpdate}
                            />
                            <TabPanel value={value} index={1}>
                                <TournamentSchedule isUpdate={isUpdate} />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <AdminTournament isUpdate={isUpdate} user={user} />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <MenberEvent />
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

export default EventDetails;
