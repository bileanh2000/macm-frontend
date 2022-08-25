import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
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
import { Delete, Edit, EmojiEvents } from '@mui/icons-material';

import adminTournamentAPI from 'src/api/adminTournamentAPI';
import TournamentOverview from './TournamentOverview';
import TournamentSchedule from './TournamentSchedule';
import AdminTournament from './AdminTournament';
import MemberTournament from './MemberTournament';
import RegisterPlayer from './RegisterPlayer';
import userTournamentAPI from 'src/api/userTournamentAPI';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import TournamentBracket from './TournamentBracket';
import NoValuePage from 'src/Components/NoValuePage';

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
    const [isJoinAdmin, setIsJoinAdmin] = useState();
    const [message, setMessage] = useState('');
    const [valueTab, SetValueTabs] = useState(0);
    const [type, SetType] = useState(0);
    const [isRender, setIsRender] = useState(true);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeTab = (newValue, tab, id) => {
        setValue(newValue);
        SetValueTabs(tab);
        SetType(id);
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
        setValueRadio();
        setHelperText(' ');
        setOpenDialogAdmin(false);
    };

    const registerToJoinOrganizingCommittee = async (tournamentId, studentId, roleId) => {
        try {
            const response = await userTournamentAPI.registerToJoinOrganizingCommittee(tournamentId, studentId, roleId);
            enqueueSnackbar(response.message, { variant: 'success' });
            setIsRender(true);
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar(error, { variant });
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
            setMessage(response.message);
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

    useEffect(() => {
        const getAllOrginizingCommitteeRole = async () => {
            try {
                const response = await userTournamentAPI.getAllUserOrganizingCommittee(tournamentId, user.studentId);
                console.log('admin', response);
                setIsJoinAdmin(response);
            } catch (error) {
                console.log('Loi roi', error);
            }
        };
        const getAllUserCompetitivePlayer = async () => {
            try {
                const response = await userTournamentAPI.getAllUserCompetitivePlayer(tournamentId, user.studentId);
                // console.log(response.data);
                setIsJoinCompetitive(response.data);
            } catch (error) {
                console.log('Loi roi', error);
            }
        };
        const getAllUserExhibitionPlayer = async () => {
            try {
                const response = await userTournamentAPI.getAllUserExhibitionPlayer(tournamentId, user.studentId);
                console.log(response.data);
                setIsJoinExhibition(response.data);
            } catch (error) {
                console.log('Loi roi', error);
            }
        };

        const getRoleInTournament = async () => {
            try {
                const response = await userTournamentAPI.getAllOrginizingCommitteeRole(tournamentId);
                setRoleInTournament(response.data);
            } catch (error) {
                console.log('Khong the lay duoc role', error);
            }
        };

        isRender && getRoleInTournament();
        isRender && getAllUserCompetitivePlayer();
        isRender && getAllUserExhibitionPlayer();
        isRender && getAllOrginizingCommitteeRole();

        setIsRender(false);
    }, [isRender, tournamentId, user.studentId, isJoinCompetitive, isJoinExhibition, isJoinAdmin]);

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

    if (message === 'Giải đấu này đã hủy' || message === 'Không có giải đấu này') {
        return <NoValuePage message="Giải đấu này không tồn tại hoặc đã bị hủy" />;
    }

    return (
        <Box sx={{ m: 1, p: 1 }}>
            <RegisterPlayer
                title="Đăng ký tham gia thi đấu"
                userInformation={user}
                isOpen={openDialog}
                handleClose={() => {
                    setOpenDialog(false);
                }}
                isJoinCompetitive={isJoinCompetitive}
                isJoinExhibition={isJoinExhibition}
                onRegister={() => setIsRender(true)}
            />
            <Dialog
                open={openDialogAdmin}
                onClose={handleCloseDialogAdmin}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Đăng ký tham gia ban tổ chức</DialogTitle>
                {roleInTournament.length > 0 ? (
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="caption">Bạn muốn đăng ký vào ban nào?</Typography>
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
                                                label={`${role.name} - SL còn lại: ${role.availableQuantity} người`}
                                                disabled={role.availableQuantity === 0}
                                            />
                                        ))}
                                    </RadioGroup>
                                )}
                                <FormHelperText>{helperText}</FormHelperText>
                                <Box sx={{ display: 'flex', alignContent: 'space-between' }}>
                                    <Button
                                        sx={{ mt: 1, mr: 1 }}
                                        type="submit"
                                        variant="contained"
                                        disabled={valueRadio == 0}
                                    >
                                        Đăng ký
                                    </Button>
                                    <Button sx={{ mt: 1, mr: 1 }} onClick={handleCloseDialogAdmin} variant="outlined">
                                        Hủy
                                    </Button>
                                </Box>
                            </FormControl>
                        </form>
                    </DialogContent>
                ) : (
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="caption">
                                Giải đấu chưa yêu cầu có ban tổ chức, bạn vui lòng quay lại sau!
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                )}
                {/* <DialogActions></DialogActions> */}
            </Dialog>
            {tournament && scheduleData.length > 0 && (
                <Fragment>
                    <Paper elevation={3}>
                        <Container maxWidth="xl">
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    pt: 1,
                                    pb: 1,
                                }}
                            >
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
                                            {moment(scheduleData[0].date).format('DD/MM/yyyy')} -{' '}
                                            {moment(scheduleData[scheduleData.length - 1].date).format('DD/MM/yyyy')}
                                        </Typography>
                                    </Box>
                                </Box>
                                {new Date(scheduleList[0].date) > new Date() ? (
                                    <Box>
                                        {isJoinAdmin && isJoinAdmin.data.length === 0 ? (
                                            <Box sx={{ display: 'flex', alignContent: 'space-between' }}>
                                                {isJoinAdmin.message &&
                                                isJoinAdmin.message.includes('Đang chờ duyệt') ? (
                                                    ''
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        // startIcon={<Edit />}
                                                        onClick={() => handleOpenDialog(true)}
                                                        {...(handleRegisterDeadline(0)
                                                            ? { disabled: false }
                                                            : { disabled: true })}
                                                        sx={{ mr: 2, float: 'right' }}
                                                    >
                                                        {handleRegisterDeadline(0)
                                                            ? 'Đăng ký thi đấu'
                                                            : 'Hết hạn đăng ký thi đấu'}
                                                    </Button>
                                                )}
                                                {isJoinCompetitive.length === 0 && isJoinExhibition.length === 0 && (
                                                    <Button
                                                        variant="outlined"
                                                        // startIcon={<Edit />}
                                                        onClick={() => handleOpenDialogAdmin(true)}
                                                        {...(handleRegisterDeadline(1)
                                                            ? { disabled: false }
                                                            : { disabled: true })}
                                                        {...(isJoinAdmin.message.includes(
                                                            'Bạn chưa tham gia ban tổ chức giải đấu',
                                                        )
                                                            ? { disabled: false }
                                                            : { disabled: true })}
                                                        sx={{ float: 'right' }}
                                                    >
                                                        {isJoinAdmin.message.includes(
                                                            'Bạn chưa tham gia ban tổ chức giải đấu',
                                                        )
                                                            ? 'Đăng ký vào ban tổ chức'
                                                            : isJoinAdmin.message}
                                                    </Button>
                                                )}
                                            </Box>
                                        ) : (
                                            <Typography variant="h6">Bạn là thành viên ban tổ chức</Typography>
                                        )}
                                    </Box>
                                ) : (
                                    ''
                                )}
                            </Box>
                            <Divider />
                            <Box>
                                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
                                    <Tab label="Tổng quan" {...a11yProps(0)} value={0} />
                                    <Tab label="Lịch thi đấu" {...a11yProps(1)} value={1} />
                                    <Tab label="Danh sách ban tổ chức" {...a11yProps(2)} value={2} />
                                    <Tab label="Danh sách vận động viên" {...a11yProps(3)} value={3} />
                                    <Tab label="Bảng đấu" {...a11yProps(4)} value={4} />
                                </Tabs>
                            </Box>
                        </Container>
                    </Paper>
                    <Paper elevation={3} sx={{ mt: 1 }}>
                        <TournamentOverview
                            tournament={tournament}
                            value={value}
                            index={0}
                            schedule={scheduleList}
                            onChangeTab={handleChangeTab}
                        />
                        <TabPanel value={value} index={1}>
                            <TournamentSchedule />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <AdminTournament />
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <MemberTournament
                                tournament={tournament}
                                competitive={isJoinCompetitive}
                                exhibition={isJoinExhibition}
                            />
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                            <TournamentBracket
                                tournament={tournament}
                                competitive={isJoinCompetitive}
                                exhibition={isJoinExhibition}
                                valueTab={valueTab}
                                type={type}
                            />
                        </TabPanel>
                    </Paper>
                </Fragment>
            )}
        </Box>
    );
}

export default DetailTournament;
