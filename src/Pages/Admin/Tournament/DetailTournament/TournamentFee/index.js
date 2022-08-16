import { Box, Tab, Tabs } from '@mui/material';
import React, { Fragment } from 'react';
import OverviewFee from './OverviewFee';
import TournamentFeeReport from './TournamentFeeReport';
import TournamentPayment from './TournamentPayment';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TournamentFee({ tournament, tournamentStatus, isFinish }) {
    const [value, setValue] = React.useState(0);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Fragment>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="basic tabs example"
                    >
                        <Tab label="Tổng quan" {...a11yProps(0)} />
                        <Tab label="Trạng thái đóng tiền" {...a11yProps(1)} />
                        <Tab label="Lịch sử đóng tiền" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                {value == 0 && (
                    <OverviewFee value={value} index={0} tournament={tournament} tournamentStatus={tournamentStatus} />
                )}
                {value == 1 && (
                    <TournamentPayment
                        value={value}
                        index={1}
                        tournament={tournament}
                        tournamentStatus={tournamentStatus}
                        user={user}
                        isFinish={isFinish}
                    />
                )}
                {value == 2 && (
                    <TournamentFeeReport
                        value={value}
                        index={2}
                        tournament={tournament}
                        tournamentStatus={tournamentStatus}
                        user={user}
                        isFinish={isFinish}
                    />
                )}
            </Box>
        </Fragment>
    );
}

export default TournamentFee;
