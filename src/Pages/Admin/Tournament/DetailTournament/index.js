import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
import { Link, useNavigate, useParams } from 'react-router-dom';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import { Controller, useForm } from 'react-hook-form';
import { Edit } from '@mui/icons-material';
import NumberFormat from 'react-number-format';

import TournamentOverview from './TournamentOverview';
import TournamentSchedule from './TournamentSchedule';
import TournamentCompetitive from './TournamentCompetitive';
import TournamentExhibition from './TournamentExhibition';
import AdminTournament from '../AdminTournament';
import MemberTournament from '../MemberTournament';

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
    const [tournament, setTournament] = useState();
    const [active, setActive] = useState(0);
    const [scheduleList, setScheduleList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    let navigate = useNavigate();

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const fetchAdminInTournament = async (params) => {
        try {
            const response = await adminTournamentAPI.getAllTournamentOrganizingCommittee(params);
            console.log(response);
            setActive(response.totalActive);
        } catch (error) {
            console.log('Failed to fetch admin list: ', error);
        }
    };

    const getTournamentById = async (tournamentId) => {
        try {
            const response = await adminTournamentAPI.getTournamentById(tournamentId);
            console.log(response.data);
            setTournament(response.data[0]);
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
        getTournamentById(tournamentId);
        fetchAdminInTournament(tournamentId);
        fetchTournamentSchedule(tournamentId);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [tournamentId]);

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

    const { control } = useForm({});

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

    return (
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
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                    <Typography variant="h4" sx={{ fontSize: 'bold' }}>
                                        {tournament.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: 'bold' }}>
                                        {scheduleData[0].date} - {scheduleData[scheduleData.length - 1].date}
                                    </Typography>
                                </Grid>
                                {/* <Grid item xs={12} sm={4}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        component={Link}
                                        to={`update`}
                                        sx={{ float: 'right' }}
                                    >
                                        Chỉnh sửa thông tin
                                    </Button>
                                </Grid> */}
                            </Grid>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
                                    <Tab label="Tổng quan" {...a11yProps(0)} />
                                    <Tab label="Lịch thi đấu" {...a11yProps(1)} />
                                    <Tab label="Bảng đấu đối kháng" {...a11yProps(2)} />
                                    <Tab label="Bảng đấu biểu diễn" {...a11yProps(3)} />
                                    <Tab label="Danh sách ban tổ chức" {...a11yProps(4)} />
                                    <Tab label="Danh sách người chơi" {...a11yProps(5)} />
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
                                startTime={scheduleList[0].date}
                            />
                            <TabPanel value={value} index={1}>
                                <TournamentSchedule />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <TournamentCompetitive />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <TournamentExhibition />
                            </TabPanel>
                            <TabPanel value={value} index={4}>
                                <AdminTournament />
                            </TabPanel>
                            <TabPanel value={value} index={5}>
                                <MemberTournament tournament={tournament} />
                            </TabPanel>
                        </Container>
                    </Paper>
                </Fragment>
            )}
        </Box>
    );
}

export default DetailTournament;
