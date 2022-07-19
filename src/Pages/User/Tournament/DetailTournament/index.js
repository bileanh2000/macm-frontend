import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
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

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
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

    const [openDialog, setOpenDialog] = useState(false);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    let navigate = useNavigate();

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

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

    return (
        <Fragment>
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
            <Paper elevation={3}>
                <Container maxWidth>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <Box sx={{ bgcolor: '#c2e2fc', height: '100px', width: '100%' }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ bgcolor: '#b282fc', height: '100px', width: '100%' }} />
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
                <Container maxWidth>
                    <TabPanel value={value} index={0}>
                        <TournamentOverview />
                    </TabPanel>
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
    );
}

export default DetailTournament;
