import React, { Fragment, useEffect, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import CustomMatchBracket from './CustomMatchBracket';
import adminTournament from 'src/api/adminTournamentAPI';
import CreatePreview from './CreatePreview';

function TournamentBracket() {
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [weightRange, setWeightRange] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [matches, setMatches] = useState([]);
    const [rounds, setRounds] = useState();
    const [open, setOpen] = useState(false);
    const [listPlayer, setListPlayer] = useState();

    const handleChangeWeight = (event) => {
        setWeightRange(event.target.value);
        let range;
        if (event.target.value === 0) {
            range = { weightMax: 0, weightMin: 0 };
        } else {
            range = listWeightRange.find((weight) => weight.id === event.target.value);
        }
        // listMatchs(event.target.value);
        getListPlayerByCompetitiveID(event.target.value);
    };

    // const listMatchs = async (competitiveTypeId) => {
    //     try {
    //         const response = await adminTournament.listMatchs(competitiveTypeId);
    //         setMatches(response.data);
    //         setRounds(response.totalResult);
    //     } catch (error) {
    //         console.log('Failed to fetch match: ', error);
    //     }
    // };

    const getListPlayerByCompetitiveID = async (weightRange) => {
        try {
            const response = await adminTournament.previewMatchsPlayer(weightRange);
            console.log(response.data);
            setListPlayer(response.data);
            setRounds(response.totalResult);
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    };

    const spawnMatches = async (weightRange) => {
        try {
            await adminTournament.spawnMatchs(weightRange);
            getListPlayerByCompetitiveID(weightRange);
            // setListPlayer(response.data)
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    };

    const fetchTournamentById = async (tournamentId) => {
        try {
            const response = await adminTournament.getAllCompetitiveType(tournamentId);
            console.log(response.data[0]);
            setListWeightRange(response.data[0]);
            setWeightRange(response.data[0][0].id);
            getListPlayerByCompetitiveID(response.data[0][0].id);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    useEffect(() => {
        fetchTournamentById(tournamentId);
        // listMatchs(weightRange);
    }, [tournamentId]);

    const UpdateResultHandler = (newMatches) => {
        // setMatches(newMatches);
    };
    const handleDialogOpen = () => {
        // if (weightRange == 0) {
        //     enqueueSnackbar('Vui lòng chọn hạng cân trước khi tạo bảng đấu', 'error');
        //     return;
        // }
        // console.log('loz2');
        // console.log(listPlayer);
        // if (listPlayer && listPlayer.length == 0) {
        //     console.log('loz3');
        //     spawnMatches(weightRange);
        // }
        // console.log(listPlayer);
        // if (listPlayer.length > 0) {
        //     setOpen(true);
        // } else {
        //     enqueueSnackbar('Không thể tạo bảng đấu do không đủ người', { error: 'error' });
        //     return;
        // }
        setOpen(true);
    };
    const handleDialogClose = () => {
        setOpen(false);
    };

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
                <Box>
                    <Button variant="outlined" onClick={handleDialogOpen}>
                        Tạo bảng đấu
                    </Button>
                    {/* {listPlayer && listPlayer.length > 0 && (
                        <CreatePreview
                            // DialogOpen={true}
                            title="Tạo bảng đấu"
                            params={{ listPlayer, tournamentId }}
                            isOpen={open}
                            handleClose={handleDialogClose}
                            onSucess={() => {
                                setOpen(false);
                            }}
                        />
                    )} */}
                    <CreatePreview
                        // DialogOpen={true}
                        title="Tạo bảng đấu"
                        // params={{ listPlayer, tournamentId }}
                        isOpen={open}
                        handleClose={handleDialogClose}
                        onSucess={() => {
                            setOpen(false);
                        }}
                    />
                    <FormControl size="small">
                        <Typography variant="caption">Hạng cân</Typography>
                        <Select id="demo-simple-select" value={weightRange} displayEmpty onChange={handleChangeWeight}>
                            {/* <MenuItem value={0}>
                            <em>Tất cả</em>
                        </MenuItem> */}
                            {listWeightRange &&
                                listWeightRange.map((range) => (
                                    <MenuItem value={range.id} key={range.id}>
                                        {range.gender == 0 ? 'Nam: ' : 'Nữ: '} {range.weightMin} - {range.weightMax} Kg
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            {listPlayer && listPlayer.length > 0 ? (
                <CustomMatchBracket matches={listPlayer} rounds={rounds} onUpdareResult={UpdateResultHandler} />
            ) : (
                <Typography variant="body1">Hạng cân này hiện đang chưa có tuyển thủ</Typography>
            )}
        </Fragment>
    );
}

export default TournamentBracket;
