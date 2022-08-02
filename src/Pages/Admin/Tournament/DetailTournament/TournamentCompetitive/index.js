import React, { Fragment, useEffect, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Paper, Select, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';

import CustomMatchBracket from './CustomMatchBracket';
import adminTournament from 'src/api/adminTournamentAPI';

function TournamentCompetitive() {
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [competitiveId, setCompetitiveId] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [listPlayer, setListPlayer] = useState();
    const [rounds, setRounds] = useState();
    const [areaList, setAreaList] = useState();
    const [tournamentStatus, setTournamentStatus] = useState(-1);

    const handleChangeCompetitiveId = (event) => {
        setCompetitiveId(event.target.value);
        getListPlayerByCompetitiveID(event.target.value);
    };

    const getAllArea = async () => {
        try {
            const response = await adminTournament.getAllArea();
            setAreaList(response.data);
        } catch (error) {
            console.log('Khong the lay danh sach san dau');
        }
    };

    const getListPlayerByCompetitiveID = async (weightRange) => {
        try {
            const response = await adminTournament.listMatchs(weightRange);
            setListPlayer(response.data);
            console.log('lay data', response);
            setTournamentStatus(response.code);
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
            setCompetitiveId(response.data[0][0].id);
            getListPlayerByCompetitiveID(response.data[0][0].id);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const handleDialogCreate = () => {
        if (competitiveId == 0) {
            let varian = 'error';
            enqueueSnackbar('Vui lòng chọn hạng cân trước khi tạo bảng đấu', { varian });
            return;
        }
        console.log(listPlayer);
        if (listPlayer && listPlayer.length == 0) {
            console.log('loz3');
            spawnMatches(competitiveId);
        }
        console.log(listPlayer);
        if (listPlayer && listPlayer.length > 0) {
        } else {
            enqueueSnackbar('Không thể tạo bảng đấu do không đủ người', { error: 'error' });
            return;
        }
    };

    const spawnTimeAndArea = async () => {
        try {
            await adminTournament.spawnTimeAndArea(tournamentId);
            getListPlayerByCompetitiveID(competitiveId);
        } catch (error) {
            console.log('Failed to spawn time: ', error);
        }
    };

    const handleDialogUpdateTime = () => {
        spawnTimeAndArea();
    };

    const UpdateResultHandler = (newMatches) => {
        setListPlayer(newMatches);
        console.log(newMatches);
        console.log('load lai di dm');
        const timer = setTimeout(() => {
            console.log('load lai ddeo');
            getListPlayerByCompetitiveID(competitiveId);
        }, 1000);
        timer();
        console.log('loz');
        clearTimeout(timer);

        // window.location.reload();
    };

    useEffect(() => {
        fetchTournamentById(tournamentId);
        getAllArea();
    }, [tournamentId]);

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Bảng đấu
                </Typography>
            </Box>
            {/* <Box>
                    <Typography variant="body1">Nội dung thi đấu đối kháng</Typography>
                </Box> */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                {/* {tournamentStatus == 0 ? (
                        <Button variant="outlined" onClick={handleDialogCreate} sx={{ mr: 2 }}>
                            Tạo bảng đấu
                        </Button>
                    ) : tournamentStatus == 1 ? (
                        <Button variant="outlined" onClick={handleDialogUpdateBracket} sx={{ mr: 2 }}>
                            Cập nhật bảng đấu
                        </Button>
                    ) : tournamentStatus == 2 ? (
                        <Button variant="outlined" onClick={handleDialogUpdateTime} sx={{ mr: 2 }}>
                            Cập nhật thời gian thi đấu
                        </Button>
                    ) : (
                        ''
                    )} */}
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
            </Box>
            {listPlayer && areaList && listPlayer.length > 0 ? (
                <div>
                    {tournamentStatus == 2 ? (
                        listPlayer[listPlayer.length - 1].area ? (
                            ''
                        ) : (
                            <Button variant="outlined" onClick={handleDialogUpdateTime} sx={{ mr: 2, float: 'right' }}>
                                Cập nhật thời gian thi đấu
                            </Button>
                        )
                    ) : (
                        ''
                    )}
                    <CustomMatchBracket
                        matches={listPlayer}
                        rounds={rounds}
                        status={tournamentStatus}
                        areaList={areaList}
                        onUpdareResult={UpdateResultHandler}
                    />
                </div>
            ) : tournamentStatus == 1 ? (
                <Box sx={{ d: 'flex' }}>
                    <Typography variant="body1">Hạng cân này hiện đang chưa có tuyển thủ</Typography>
                    <Button variant="outlined" onClick={handleDialogCreate} sx={{ mr: 2, float: 'right' }}>
                        Tạo bảng đấu
                    </Button>
                </Box>
            ) : (
                <Box sx={{ d: 'flex' }}>
                    <Typography variant="body1" sx={{ m: 'auto' }}>
                        Hạng cân này không tổ chức
                    </Typography>
                </Box>
            )}
        </Fragment>
    );
}

export default TournamentCompetitive;
