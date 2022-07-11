import React, { Fragment, useEffect, useState } from 'react';
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import CustomMatchBracket from './CustomMatchBracket';
import adminTournament from 'src/api/adminTournamentAPI';
import { useParams } from 'react-router-dom';

function TournamentBracket() {
    let { tournamentId } = useParams();
    const [weightRange, setWeightRange] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [matches, setMatches] = useState([]);

    const handleChangeWeight = (event) => {
        setWeightRange(event.target.value);
        let range;
        if (event.target.value === 0) {
            range = { weightMax: 0, weightMin: 0 };
        } else {
            range = listWeightRange.find((weight) => weight.id === event.target.value);
        }
        spawnMatchs(event.target.value, 1);
    };

    const spawnMatchs = async (competitiveTypeId, round) => {
        try {
            const response = await adminTournament.spawnMatchs(competitiveTypeId, round);
            console.log(response.data);
            setMatches(response.data);
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    };

    const fetchTournamentById = async (tournamentId) => {
        try {
            const response = await adminTournament.getTournamentById(tournamentId);
            setListWeightRange(response.data[0].competitiveTypes);
            setWeightRange(response.data[0].competitiveTypes[0].id);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        fetchTournamentById(tournamentId);
        spawnMatchs(weightRange, 1);
    }, [tournamentId, weightRange]);

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Bảng đấu
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                <Box>
                    <Typography variant="body1">Nội dung thi đấu đối kháng</Typography>
                </Box>

                <FormControl size="small">
                    <Typography variant="caption">Hạng cân</Typography>
                    <Select id="demo-simple-select" value={weightRange} displayEmpty onChange={handleChangeWeight}>
                        {/* <MenuItem value={0}>
                            <em>Tất cả</em>
                        </MenuItem> */}
                        {listWeightRange &&
                            listWeightRange.map((range) => (
                                <MenuItem value={range.id} key={range.id}>
                                    {range.weightMin} - {range.weightMax} Kg
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Box>
            {matches ? (
                <CustomMatchBracket data={matches} />
            ) : (
                <Typography variant="body1">Hạng cân này hiện đang chưa có tuyển thủ</Typography>
            )}
        </Fragment>
    );
}

export default TournamentBracket;
