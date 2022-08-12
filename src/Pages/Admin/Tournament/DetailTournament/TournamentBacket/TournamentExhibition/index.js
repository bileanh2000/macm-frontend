import React, { Fragment, useEffect, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Paper, Select, Tooltip, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import moment from 'moment';

import adminTournament from 'src/api/adminTournamentAPI';
import TableMatch from './TableMatch';
import Gold from 'src/Components/Common/Material/Gold';
import Sliver from 'src/Components/Common/Material/Sliver';
import Brone from 'src/Components/Common/Material/Brone';

function TournamentExhibition({ reload, result, type }) {
    console.log(type);
    const nowDate = moment(new Date()).format('yyyy-MM-DD');

    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [tournamentResult, setTournamentResult] = useState();
    const [exhibitionType, setExhibitionType] = useState(type);
    const [exhibitionTeam, setExhibitionTeam] = useState([]);
    const [listExhibitionType, setListExhibitionType] = useState([]);
    const [tournamentStatus, setTournamentStatus] = useState();

    const handleChangeExhibitionType = (event) => {
        console.log(event.target.value);
        if (result && result.length > 0) {
            const _result = result.find((subResult) =>
                subResult.data.find((d) => d.exhibitionType.id == event.target.value),
            ).data[0].listResult;
            setTournamentResult(_result);
            console.log('result', _result);
        }
        setExhibitionType(event.target.value);
        let exType;
        if (event.target.value === 0) {
            exType = { exhibitionType: 0 };
        } else {
            exType = listExhibitionType.find((type) => type.id === event.target.value);
        }
        console.log(exType);
        getExhibitionResult(exType.id, nowDate);
    };

    const fetchExhibitionType = async (tournamentId) => {
        try {
            const response = await adminTournament.getListExhibitionType(tournamentId);
            console.log(response);
            setTournamentStatus(response.data[0].status);
            setListExhibitionType(response.data);
            type == 0 && setExhibitionType(response.data[0].id);
            console.log(response.data[0].id, result);
            const _result = result.find((subResult) =>
                subResult.data.find((d) => d.exhibitionType.id == response.data[0].id),
            ).data[0].listResult;
            setTournamentResult(_result);
            console.log('result', _result);
            console.log(response.data[0].id, nowDate);
            getExhibitionResult(response.data[0].id, nowDate);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    // const fetchExhibitionTeam = async (exhibitionType) => {
    //     try {
    //         const response = await adminTournament.getTeamByType(exhibitionType);
    //         setExhibitionTeam(response.data);
    //     } catch (error) {
    //         console.log('Failed to fetch user list: ', error);
    //     }
    // };

    const getExhibitionResult = async (exhibitionType, date) => {
        try {
            const response = await adminTournament.getExhibitionResult({ date, exhibitionType });
            console.log(response.data);
            setExhibitionTeam(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const spawnTimeAndArea = async () => {
        try {
            const response = await adminTournament.spawnTimeAndAreaEx(tournamentId);
            getExhibitionResult(exhibitionType, nowDate);
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {
            console.log('Failed to spawn time: ', error);
        }
    };

    useEffect(() => {
        fetchExhibitionType(tournamentId);
        getExhibitionResult(exhibitionType, nowDate);
    }, []);

    const handleDialogCreate = () => {
        if (exhibitionType == 0) {
            let varian = 'error';
            enqueueSnackbar('Vui lòng chọn hạng cân trước khi tạo bảng đấu', { varian });
            return;
        }
        if (exhibitionTeam && exhibitionTeam.length == 0) {
            console.log('loz3');
            spawnTimeAndArea(exhibitionType);
        }
    };
    const handleDialogUpdateTime = () => {
        //spawnTimeAndArea();
    };

    const UpdateResultHandler = (newMatches) => {
        setExhibitionTeam(newMatches);
        // getExhibitionResult(exhibitionType, nowDate);
    };

    return (
        <Fragment>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Bảng đấu biểu diễn
                </Typography>
            </Box> */}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                <FormControl size="small">
                    <Typography variant="caption">Thể thức thi đấu</Typography>
                    <Select
                        id="demo-simple-select"
                        value={exhibitionType}
                        displayEmpty
                        onChange={handleChangeExhibitionType}
                    >
                        {listExhibitionType &&
                            listExhibitionType.map((type) => (
                                <MenuItem value={type.id} key={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </Box>
            {tournamentResult != null && (
                <Paper elevation={3} sx={{ m: 2, p: 2 }}>
                    <Typography variant="h6">Kết quả bảng đấu</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Tooltip title="Huy chương vàng">
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Gold />

                                <Typography variant="body1">{tournamentResult[0].teamName}</Typography>
                            </Box>
                        </Tooltip>
                        <Tooltip title="Huy chương bạc">
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Sliver />

                                <Typography variant="body1">{tournamentResult[1].teamName}</Typography>
                            </Box>
                        </Tooltip>
                        <Tooltip title="Huy chương đồng">
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Brone />

                                <Typography variant="body1">{tournamentResult[2].teamName}</Typography>
                            </Box>
                        </Tooltip>
                    </Box>
                </Paper>
            )}
            {exhibitionTeam && exhibitionTeam.length > 0 ? (
                <div>
                    {/* {tournamentStatus == 2 ? (
                        exhibitionTeam[0].area ? (
                            ''
                        ) : (
                            <Button variant="outlined" onClick={handleDialogUpdateTime} sx={{ mr: 2, float: 'right' }}>
                                Cập nhật thời gian thi đấu
                            </Button>
                        )
                    ) : (
                        ''
                    )} */}
                    <TableMatch
                        matches={exhibitionTeam}
                        status={tournamentStatus}
                        onUpdateResult={UpdateResultHandler}
                    />
                </div>
            ) : (
                // ) : tournamentStatus == 1 ? (
                //     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                //         <Typography variant="body1">Thể thức thi đấu đang chưa có lịch thi đấu</Typography>
                //         <Button variant="outlined" onClick={handleDialogCreate} sx={{ mr: 2, float: 'right' }}>
                //             Tạo bảng đấu
                //         </Button>
                //     </Box>
                <Box sx={{ d: 'flex' }}>
                    <Typography variant="body1" sx={{ m: 'auto' }}>
                        Thể thức thi đấu này không tổ chức
                    </Typography>
                </Box>
            )}
        </Fragment>
    );
}

export default TournamentExhibition;
