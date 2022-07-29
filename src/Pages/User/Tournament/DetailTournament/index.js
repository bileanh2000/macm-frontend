import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { useCallback, useState, Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';

import adminTournamentAPI from 'src/api/adminTournamentAPI';
import TournamentOverview from './TournamentOverview';
import TournamentSchedule from './TournamentSchedule';
import TournamentCompetitive from './TournamentCompetitive';
import TournamentExhibition from './TournamentExhibition';
import AdminTournament from './AdminTournament';
import MemberTournament from './MemberTournament';
import RegisterPlayer from './RegisterPlayer';
import userTournamentAPI from 'src/api/userTournamentAPI';
import { useSnackbar } from 'notistack';

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
    const now = new Date();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [tournament, setTournament] = useState();
    const { enqueueSnackbar } = useSnackbar();
    // const [active, setActive] = useState(0);
    const [scheduleList, setScheduleList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogAdmin, setOpenDialogAdmin] = useState(false);
    const [value, setValue] = useState(0);
    const [valueRadio, setValueRadio] = useState(0);
    const [error, setError] = useState(false);
    const [roleInTournament, setRoleInTournament] = useState([]);
    const [helperText, setHelperText] = useState('Vui lòng chọn vai trò');
    const [isJoinCompetitive, setIsJoinCompetitive] = useState([]);
    const [isJoinExhibition, setIsJoinExhibition] = useState([]);
    const [isJoinAdmin, setIsJoinAdmin] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    let navigate = useNavigate();

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialogAdmin = () => {
        setValueRadio();
        setHelperText(' ');
        setOpenDialogAdmin(false);
    };

    const handleOpenDialogAdmin = () => {
        setOpenDialogAdmin(true);
    };

    const handleRadioChange = (event) => {
        setValueRadio(event.target.value);
        setHelperText(' ');
        setError(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (valueRadio) {
            console.log(valueRadio);
            registerToJoinOrganizingCommittee(tournamentId, user.studentId, valueRadio);
            setError(false);
        } else {
            setHelperText('Please select an option.');
            setError(true);
        }
    };

    const registerToJoinOrganizingCommittee = async (tournamentId, studentId, roleId) => {
        try {
            const response = userTournamentAPI.registerToJoinOrganizingCommittee(tournamentId, studentId, roleId);
            let variant = response.data > 0 ? 'success' : 'error';
            enqueueSnackbar(response.message, { variant });
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar(error, { variant });
        }
    };

    const getRoleInTournament = async () => {
        try {
            const response = await userTournamentAPI.getAllOrginizingCommitteeRole();
            setRoleInTournament(response.data);
        } catch (error) {
            console.log('Khong the lay duoc role', error);
        }
    };

    const fetchAdminInTournament = async (params) => {
        try {
            const response = await adminTournamentAPI.getAllTournamentOrganizingCommittee(params);
            console.log(response);
            // setActive(response.totalActive);
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

    const getAllUserCompetitivePlayer = async () => {
        try {
            const response = await userTournamentAPI.getAllUserCompetitivePlayer(tournamentId, user.studentId);
            setIsJoinCompetitive(response.data);
        } catch (error) {
            console.log('Loi roi', error);
        }
    };

    const getAllUserExhibitionPlayer = async () => {
        try {
            const response = await userTournamentAPI.getAllUserExhibitionPlayer(tournamentId, user.studentId);
            setIsJoinExhibition(response.data);
        } catch (error) {
            console.log('Loi roi', error);
        }
    };

    const getAllOrginizingCommitteeRole = async () => {
        try {
            const response = await userTournamentAPI.getAllUserOrganizingCommittee(tournamentId, user.studentId);
            setIsJoinAdmin(response.data);
        } catch (error) {
            console.log('Loi roi', error);
        }
    };

    useEffect(() => {
        getTournamentById(tournamentId);
        fetchAdminInTournament(tournamentId);
        fetchTournamentSchedule(tournamentId);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [tournamentId]);

    useEffect(() => {
        getRoleInTournament();
        getAllUserCompetitivePlayer();
        getAllUserExhibitionPlayer();
        getAllOrginizingCommitteeRole();
    }, []);

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

    const handleRegisterDeadline = (type) => {
        if (tournament) {
            if (type == 0) {
                if (new Date(tournament.registrationPlayerDeadline) > now) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (new Date(tournament.registrationOrganizingCommitteeDeadline) > now) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };

    return (
        <Box sx={{ m: 1, p: 1, height: '80vh' }}>
            <RegisterPlayer
                title="Đăng kí tham gia thi đấu"
                userInformation={user}
                isOpen={openDialog}
                handleClose={() => {
                    setOpenDialog(false);
                }}
            />
            <Dialog
                open={openDialogAdmin}
                onClose={handleCloseDialogAdmin}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Đăng kí tham gia ban tổ chức</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography variant="caption">Bạn muốn đăng kí vào ban nào?</Typography>
                    </DialogContentText>
                    <form onSubmit={handleSubmit}>
                        <FormControl sx={{ m: 3 }} error={error} variant="standard">
                            {roleInTournament && (
                                <RadioGroup
                                    aria-labelledby="demo-error-radios"
                                    name="quiz"
                                    value={valueRadio}
                                    onChange={handleRadioChange}
                                >
                                    {roleInTournament.map((role, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={role.id}
                                            control={<Radio />}
                                            label={role.name}
                                        />
                                    ))}
                                </RadioGroup>
                            )}
                            <FormHelperText>{helperText}</FormHelperText>
                            <Box sx={{ display: 'flex', alignContent: 'space-between' }}>
                                <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
                                    Đăng kí
                                </Button>
                                <Button sx={{ mt: 1, mr: 1 }} onClick={handleCloseDialogAdmin} variant="outlined">
                                    Hủy bỏ
                                </Button>
                            </Box>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={handleCloseDialogAdmin}>Hủy bỏ</Button>
                    <Button onClick={handleRegisterAdmin} autoFocus>
                        Đồng ý
                    </Button> */}
                </DialogActions>
            </Dialog>
            {tournament && scheduleData.length > 0 && (
                <Fragment>
                    <Paper elevation={3}>
                        <Container maxWidth="xl">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                    <Typography variant="h4" sx={{ fontSize: 'bold' }}>
                                        {tournament.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: 'bold' }}>
                                        {scheduleData[0].date} - {scheduleData[scheduleData.length - 1].date}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    {new Date(scheduleList[0].date) > new Date() ? (
                                        <Fragment>
                                            {isJoinAdmin.length == 0 &&
                                                !(isJoinCompetitive.length > 0 && isJoinExhibition.length > 0) && (
                                                    <Button
                                                        variant="outlined"
                                                        // startIcon={<Edit />}
                                                        onClick={() => handleOpenDialog(true)}
                                                        {...(handleRegisterDeadline(0)
                                                            ? { disabled: false }
                                                            : { disabled: true })}
                                                        sx={{ mr: 2 }}
                                                    >
                                                        {handleRegisterDeadline(0)
                                                            ? 'Đăng kí thi đấu'
                                                            : 'Hết hạn đăng ký thi đấu'}
                                                    </Button>
                                                )}

                                            {isJoinAdmin.length == 0 &&
                                                isJoinCompetitive.length == 0 &&
                                                isJoinExhibition.length == 0 && (
                                                    <Button
                                                        variant="outlined"
                                                        // startIcon={<Edit />}
                                                        onClick={() => handleOpenDialogAdmin(true)}
                                                        {...(handleRegisterDeadline(1)
                                                            ? { disabled: false }
                                                            : { disabled: true })}
                                                        // sx={{ float: 'right' }}
                                                    >
                                                        {handleRegisterDeadline(1)
                                                            ? 'Đăng kí vào ban tổ chức'
                                                            : 'Hết hạn đăng ký ban tổ chức'}
                                                    </Button>
                                                )}
                                        </Fragment>
                                    ) : (
                                        ''
                                    )}

                                    {/* {new Date(tournament[0].date) > new Date() ? ( && (
                                        <Box sx={{ display: 'flex', alignContent: 'space-between' }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Edit />}
                                                onClick={() => handleOpenDialog(true)}
                                                sx={{ float: 'right', mr: 2 }}
                                            >
                                                Đăng kí thi đấu
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Edit />}
                                                onClick={() => handleOpenDialogAdmin(true)}
                                                sx={{ float: 'right' }}
                                            >
                                                Đăng kí vào ban tổ chức
                                            </Button>
                                        </Box>
                                    )} */}
                                </Grid>
                            </Grid>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
                                    <Tab label="Tổng quan" {...a11yProps(0)} value={0} />
                                    <Tab label="Lịch thi đấu" {...a11yProps(1)} value={1} />
                                    {(tournament.competitiveTypes.length > 0 || isJoinCompetitive.length > 0) && (
                                        <Tab label="Bảng đấu đối kháng" {...a11yProps(2)} value={2} />
                                    )}
                                    {(tournament.exhibitionTypes.length > 0 || isJoinExhibition.length > 0) && (
                                        <Tab label="Bảng đấu biểu diễn" {...a11yProps(3)} value={3} />
                                    )}
                                    <Tab label="Danh sách ban tổ chức" {...a11yProps(4)} value={4} />
                                    <Tab label="Danh sách người chơi" {...a11yProps(5)} value={5} />
                                </Tabs>
                            </Box>
                        </Container>
                    </Paper>
                    <Paper elevation={3} sx={{ mt: 1 }}>
                        <Container maxWidth="lg">
                            <TournamentOverview tournament={tournament} value={value} index={0} />
                            <TabPanel value={value} index={1}>
                                <TournamentSchedule />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <TournamentCompetitive competitive={isJoinCompetitive} />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <TournamentExhibition exhibition={isJoinExhibition} />
                            </TabPanel>
                            <TabPanel value={value} index={4}>
                                <AdminTournament />
                            </TabPanel>
                            <TabPanel value={value} index={5}>
                                <MemberTournament competitive={isJoinCompetitive} exhibition={isJoinExhibition} />
                            </TabPanel>
                        </Container>
                    </Paper>
                </Fragment>
            )}
        </Box>
    );
}

export default DetailTournament;
