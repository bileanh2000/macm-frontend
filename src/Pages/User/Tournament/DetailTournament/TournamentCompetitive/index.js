import { Box, Button, FormControl, MenuItem, Select, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import adminTournament from 'src/api/adminTournamentAPI';
import CustomMatchBracket from './CustomMatchBracket';

function TournamentCompetitive({ competitive }) {
    console.log(competitive);
    let { tournamentId } = useParams();
    const [competitiveId, setCompetitiveId] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [listPlayer, setListPlayer] = useState();
    const [rounds, setRounds] = useState();
    // const [tournamentStatus, setTournamentStatus] = useState(-1);

    const handleChangeCompetitiveId = (event) => {
        setCompetitiveId(event.target.value);
        getListPlayerByCompetitiveID(event.target.value);
    };

    const getListPlayerByCompetitiveID = async (competitiveId) => {
        try {
            const response = await adminTournament.listMatchs(competitiveId);
            setListPlayer(response.data);
            console.log('lay data', response.data);
            setRounds(response.totalResult);
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    };

    const fetchTournamentById = async (tournamentId) => {
        try {
            const response = await adminTournament.getAllCompetitiveType(tournamentId);
            console.log(response.data[0]);
            setListWeightRange(response.data[0]);
            setCompetitiveId(response.data[0][0].id);
            getListPlayerByCompetitiveID(response.data[0][0].id);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        fetchTournamentById(tournamentId);
    }, [tournamentId]);

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Bảng đấu
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                <FormControl size="small">
                    <Typography variant="caption">Hạng cân</Typography>
                    <Select
                        id="demo-simple-select"
                        value={competitiveId}
                        displayEmpty
                        onChange={handleChangeCompetitiveId}
                    >
                        {listWeightRange &&
                            listWeightRange.map((range) => (
                                <MenuItem value={range.id} key={range.id}>
                                    {range.gender ? 'Nam: ' : 'Nữ: '} {range.weightMin} - {range.weightMax} Kg
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <Box>
                    {competitive.length > 0 && (
                        <Typography variant="body1">
                            {competitiveId == competitive[0].competitiveTypeId ? 'Bạn thi đấu tại bảng này!' : ''}
                        </Typography>
                    )}
                </Box>
            </Box>

            {listPlayer && listPlayer.length > 0 ? (
                <div>
                    <CustomMatchBracket matches={listPlayer} rounds={rounds} />
                </div>
            ) : (
                <Box sx={{ d: 'flex' }}>
                    <Typography variant="body1" sx={{ m: 'auto' }}>
                        Hạng cân này hiện đang chưa có lịch thi đấu
                    </Typography>
                </Box>
            )}
        </Fragment>
    );
}

export default TournamentCompetitive;
