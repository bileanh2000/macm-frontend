import { Box, Button, FormControl, MenuItem, Paper, Select, Tooltip, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import adminTournament from 'src/api/adminTournamentAPI';
import Brone from 'src/Components/Common/Material/Brone';
import Gold from 'src/Components/Common/Material/Gold';
import Sliver from 'src/Components/Common/Material/Sliver';
import LoadingProgress from 'src/Components/LoadingProgress';
import CustomMatchBracket from './CustomMatchBracket';

function TournamentCompetitive({ competitive, result }) {
    let { tournamentId } = useParams();
    const [competitiveId, setCompetitiveId] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [listPlayer, setListPlayer] = useState();
    const [rounds, setRounds] = useState();
    const [tournamentResult, setTournamentResult] = useState();
    // const [tournamentStatus, setTournamentStatus] = useState(-1);

    const handleChangeCompetitiveId = (event) => {
        if (result && result.length > 0) {
            const _result = result.find((subResult) =>
                subResult.data.find((d) => d.competitiveType.id == event.target.value),
            ).data[0].listResult;
            setTournamentResult(_result);
            console.log('result', _result);
        }
        setCompetitiveId(event.target.value);
        getListPlayerByCompetitiveID(event.target.value);
    };

    const getListPlayerByCompetitiveID = async (competitiveId) => {
        try {
            const response = await adminTournament.listMatchs(competitiveId);
            if (response.data.length > 0) {
                setListPlayer(response.data[0].listMatchDto);
                setRounds(response.totalResult);
            } else {
                setListPlayer(response.data);
                setRounds(0);
            }
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    };

    const fetchTournamentById = async (tournamentId) => {
        try {
            const response = await adminTournament.getAllCompetitiveType(tournamentId);
            if (response.data.length > 0) {
                setListWeightRange(response.data[0]);
                setCompetitiveId(response.data[0][0].id);
                console.log(response.data[0][0].id, result);
                const _result = result.find((subResult) =>
                    subResult.data.find((d) => d.competitiveType.id == response.data[0][0].id),
                ).data[0].listResult;
                setTournamentResult(_result);
                console.log('result', _result);

                getListPlayerByCompetitiveID(response.data[0][0].id);
            }
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        const fetchTournamentById = async (tournamentId) => {
            try {
                const response = await adminTournament.getAllCompetitiveType(tournamentId);
                if (response.data.length > 0) {
                    setListWeightRange(response.data[0]);
                    setCompetitiveId(response.data[0][0].id);
                    console.log(response.data[0][0].id, result);
                    const _result = result.find((subResult) =>
                        subResult.data.find((d) => d.competitiveType.id == response.data[0][0].id),
                    ).data[0].listResult;
                    setTournamentResult(_result);
                    console.log('result', _result);

                    getListPlayerByCompetitiveID(response.data[0][0].id);
                }
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        fetchTournamentById(tournamentId);
    }, [tournamentId, result]);

    return (
        <Fragment>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Bảng đấu
                </Typography>
            </Box> */}

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
            {tournamentResult != null && (
                <Paper elevation={3} sx={{ m: 2, p: 2 }}>
                    <Typography variant="h6">Kết quả bảng đấu</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Tooltip title="Huy chương vàng">
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Gold />

                                <Typography variant="body1">{tournamentResult[0].name}</Typography>
                            </Box>
                        </Tooltip>
                        <Tooltip title="Huy chương bạc">
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Sliver />

                                <Typography variant="body1">{tournamentResult[1].name}</Typography>
                            </Box>
                        </Tooltip>
                        <Tooltip title="Huy chương đồng">
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Brone />

                                <Typography variant="body1">{tournamentResult[2].name}</Typography>
                            </Box>
                        </Tooltip>
                    </Box>
                </Paper>
            )}

            {listPlayer ? (
                listPlayer.length > 0 ? (
                    <CustomMatchBracket matches={listPlayer} rounds={rounds} />
                ) : (
                    <Box sx={{ d: 'flex' }}>
                        <Typography variant="body1" sx={{ m: 'auto' }}>
                            Thể thức này chưa có thời gian và địa điểm thi đấu
                        </Typography>
                    </Box>
                )
            ) : (
                <LoadingProgress />
            )}
        </Fragment>
    );
}

export default TournamentCompetitive;
