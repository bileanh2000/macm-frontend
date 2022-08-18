import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Tab,
    Tabs,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import TournamentCompetitive from './TournamentCompetitive';
import TournamentExhibition from './TournamentExhibition';
import adminTournament from 'src/api/adminTournamentAPI';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

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

function TournamentBacket({ tournament, tournamentStatus, valueTab, type, endDate }) {
    let isDisplay = false;
    if (tournament.competitiveTypes.length > 0 || tournament.exhibitionTypes.length > 0) {
        const competitiveStatus = tournament.competitiveTypes.map((competitive) => competitive.status);
        const exhibitionStatus = tournament.exhibitionTypes.map((exhibition) => exhibition.status);
        isDisplay =
            competitiveStatus.findIndex((status) => status == 3) >= 0 ||
            exhibitionStatus.findIndex((status) => status == 3) >= 0;
        console.log(isDisplay);
    }
    const { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [value, setValue] = useState(valueTab);
    const [open, setOpen] = useState(false);
    const [tournamentResult, setTournamentResult] = useState();
    const [isRender, setIsRender] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // const gettournamentresult = async () => {
    //     try {
    //         const response = await adminTournament.getTournamentResult(tournamentId);
    //         console.log('result', response.data);
    //         setTournamentResult([]);
    //     } catch (error) {
    //         console.warn('Failed to get tournament result', error);
    //     }
    // };

    const spawnTimeAndArea = async () => {
        try {
            const response = await adminTournament.spawnTimeAndArea(tournamentId);
            enqueueSnackbar(response.message, { variant: 'success' });
            setIsRender(true);
        } catch (error) {
            console.warn('Failed to spawn time and area');
        }
    };

    useEffect(() => {
        const getTournamentResult = async () => {
            try {
                const response = await adminTournament.getTournamentResult(tournamentId);
                console.log('result', response.data);
                setTournamentResult(response.data[0]);
            } catch (error) {
                console.warn('Failed to get tournament result', error);
            }
        };
        getTournamentResult();
    }, [tournamentId]);

    const handleDialogConfirmMatch = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const handleOk = () => {
        spawnTimeAndArea();
        handleCancel();
    };

    console.log(tournamentResult);

    return (
        <Box>
            <Dialog maxWidth="xs" open={open}>
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        Bạn có chắc chắn muốn cập nhật thời gian cho toàn bộ thể thức thi đấu?
                    </DialogContentText>
                    <Typography variant="caption">
                        Sau khi xác nhận sẽ không thể thêm đội hoặc tuyển thủ vào thi đấu được nữa!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCancel}>
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleOk}>Đồng ý</Button>
                </DialogActions>
            </Dialog>
            {tournamentResult && (
                <Box sx={{ width: '100%' }}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="basic tabs example"
                        >
                            <Tab label="Đối kháng" {...a11yProps(0)} />
                            <Tab label="Biểu diễn" {...a11yProps(1)} />
                        </Tabs>
                        <Button
                            variant="outlined"
                            onClick={handleDialogConfirmMatch}
                            sx={{ mb: 2, float: 'right' }}
                            disabled={isDisplay}
                        >
                            Cập nhật thời gian thi đấu cho giải đấu
                        </Button>
                    </Box>

                    <TabPanel value={value} index={0}>
                        <TournamentCompetitive
                            tournamentStatus={tournamentStatus}
                            reload={isRender}
                            result={tournamentResult.listCompetitiveResult}
                            type={valueTab == 0 ? type : 0}
                            endDate={endDate}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <TournamentExhibition
                            tournamentStatus={tournamentStatus}
                            reload={isRender}
                            result={tournamentResult.listExhibitionResult}
                            type={valueTab == 1 ? type : 0}
                            endDate={endDate}
                        />
                    </TabPanel>
                </Box>
            )}
        </Box>
    );
}

export default TournamentBacket;
