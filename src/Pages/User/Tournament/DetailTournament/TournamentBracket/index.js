import React, { useEffect, useState } from 'react';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import TournamentCompetitive from './TournamentCompetitive';
import TournamentExhibition from './TournamentExhibition';
import MyTeam from './MyTeam';
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

function TournamentBracket({ tournament, competitive, exhibition, valueTab, type }) {
    let isDisplay = false;
    if (tournament.competitiveTypes.length > 0 || tournament.exhibitionTypes.length > 0) {
        const competitiveStatus = tournament.competitiveTypes.map((competitive) => competitive.status);
        const exhibitionStatus = tournament.exhibitionTypes.map((exhibition) => exhibition.status);
        isDisplay =
            competitiveStatus.findIndex((status) => status == 3) >= 0 ||
            exhibitionStatus.findIndex((status) => status == 3) >= 0;
        console.log(isDisplay);
    }
    console.log(isDisplay);
    const { tournamentId } = useParams();
    const [value, setValue] = useState(0);
    const [tournamentResult, setTournamentResult] = useState();
    const [isRender, setIsRender] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
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

    console.log(tournamentResult);

    return (
        <Box>
            {tournamentResult && (
                <Box sx={{ width: '100%' }}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
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
                            <Tab label="Đội của tôi" {...a11yProps(2)} />
                        </Tabs>
                    </Box>

                    <TabPanel value={value} index={0}>
                        <TournamentCompetitive
                            competitive={competitive}
                            reload={isRender}
                            result={tournamentResult.listCompetitiveResult}
                            type={valueTab == 0 ? type : 0}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <TournamentExhibition
                            exhibition={exhibition}
                            reload={isRender}
                            result={tournamentResult.listExhibitionResult}
                            type={valueTab == 1 ? type : 0}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <MyTeam competitive={competitive} exhibition={exhibition} />
                    </TabPanel>
                </Box>
            )}
        </Box>
    );
}

export default TournamentBracket;
