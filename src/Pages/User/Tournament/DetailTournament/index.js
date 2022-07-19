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
    const [openDialogAdmin, setOpenDialogAdmin] = useState(false);
    const [value, setValue] = useState(0);
    const [valueRadio, setValueRadio] = useState();
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('Vui lòng chọn vai trò');

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

    const handleCloseDialogAdmin = () => {
        setValueRadio();
        setHelperText(' ');
        setOpenDialogAdmin(false);
    };

    const handleOpenDialogAdmin = () => {
        setOpenDialogAdmin(true);
    };

    const handleRegister = () => {
        handleCloseDialog();
    };
    const handleRegisterAdmin = () => {
        handleCloseDialogAdmin();
    };

    const handleRadioChange = (event) => {
        setValueRadio(event.target.value);
        setHelperText(' ');
        setError(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (valueRadio) {
            setHelperText('You got it!');
            setError(false);
        } else {
            setHelperText('Please select an option.');
            setError(true);
        }
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

    return (
        <Box sx={{ m: 1, p: 1, height: '80vh' }}>
            {/* <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Đăng kí tham gia giải đấu</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography sx={{ m: 1 }}>
                            <strong>Họ và tên: </strong> Nguyễn Văn A{' '}
                        </Typography>
                        <Typography sx={{ m: 1 }}>
                            <strong>Mã SV: </strong> HE123456{' '}
                        </Typography>
                        <Typography sx={{ m: 1 }}>
                            <strong>Ngày sinh: </strong> 28-2-2202{' '}
                        </Typography>
                        <Typography sx={{ m: 1 }}>
                            <strong>Giới tính: </strong> Nam{' '}
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                    <Button onClick={handleRegister} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog> */}
            <RegisterPlayer
                title="Cập nhật cơ sở vật chất"
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
                            <RadioGroup
                                aria-labelledby="demo-error-radios"
                                name="quiz"
                                value={valueRadio}
                                onChange={handleRadioChange}
                            >
                                <FormControlLabel value={0} control={<Radio />} label="Ban Văn Hóa" />
                                <FormControlLabel value={1} control={<Radio />} label="Ban Truyền Thông" />
                                <FormControlLabel value={2} control={<Radio />} label="Ban Hậu Cần" />
                            </RadioGroup>
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
                                    {tournament.status === 3 && (
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
                                    )}
                                </Grid>
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
                            <TournamentOverview tournament={tournament} value={value} index={0} />
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
                                <MemberTournament />
                            </TabPanel>
                        </Container>
                    </Paper>
                </Fragment>
            )}
        </Box>
    );
}

export default DetailTournament;
