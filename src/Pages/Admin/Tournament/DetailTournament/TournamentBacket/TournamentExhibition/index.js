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
import LoadingProgress from 'src/Components/LoadingProgress';

function TournamentExhibition({ reload, setReload, result, type, endDate, tournamentStage, isUnorganized }) {
    console.log(result);

    const nowDate = moment(new Date()).format('yyyy-MM-DD');

    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [tournamentResult, setTournamentResult] = useState();
    const [exhibitionType, setExhibitionType] = useState(type);
    const [exhibitionTeam, setExhibitionTeam] = useState();
    const [listExhibitionType, setListExhibitionType] = useState([]);
    const [tournamentStatus, setTournamentStatus] = useState();
    const [areaList, setAreaList] = useState();
    const [isRender, setIsRender] = useState(true);
    const [isRenderTotal, setIsRenderTotal] = useState(true);

    const handleChangeExhibitionType = (event) => {
        if (result && result.length > 0) {
            const _result =
                result.find((subResult) =>
                    subResult.data.length > 0
                        ? subResult.data.find((d) => d.exhibitionType.id == event.target.value)
                        : null,
                ) != null
                    ? result.find((subResult) =>
                          subResult.data.length > 0
                              ? subResult.data.find((d) => d.exhibitionType.id == event.target.value)
                              : null,
                      )
                    : null;
            setTournamentResult(_result ? _result.data[0].listResult : null);
        }
        setExhibitionType(event.target.value);
        let exType;
        if (event.target.value === 0) {
            exType = { exhibitionType: 0 };
        } else {
            exType = listExhibitionType.find((type) => type.id === event.target.value);
        }
        getExhibitionResult(exType.id);
    };

    // const fetchExhibitionTeam = async (exhibitionType) => {
    //     try {
    //         const response = await adminTournament.getTeamByType(exhibitionType);
    //         setExhibitionTeam(response.data);
    //     } catch (error) {
    //         console.log('Failed to fetch user list: ', error);
    //     }
    // };

    const getExhibitionResult = async (exhibitionType) => {
        try {
            const response = await adminTournament.getExhibitionResult(exhibitionType);
            console.log('exhi', response.data[0]);
            response.data.length > 0 ? setExhibitionTeam(response.data[0].listResult) : setExhibitionTeam();
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const getAllArea = async () => {
        try {
            const response = await adminTournament.getAllArea();
            setAreaList(response.data);
        } catch (error) {
            console.log('Khong the lay danh sach san dau');
        }
    };

    const spawnTimeAndArea = async () => {
        try {
            const response = await adminTournament.spawnTimeAndAreaEx(tournamentId);
            getExhibitionResult(exhibitionType);
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {
            console.log('Failed to spawn time: ', error);
        }
    };

    useEffect(() => {
        const getExhibitionResult = async (exhibitionType) => {
            try {
                const response = await adminTournament.getExhibitionResult(exhibitionType);
                console.log('exhi', response.data[0]);
                response.data.length > 0 ? setExhibitionTeam(response.data[0].listResult) : setExhibitionTeam();
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        isRender && getExhibitionResult(exhibitionType);
        setIsRender(false);
    }, [isRender, exhibitionType, exhibitionTeam]);

    useEffect(() => {
        const getExhibitionResult = async (exhibitionType) => {
            try {
                const response = await adminTournament.getExhibitionResult(exhibitionType);
                console.log('exhi', response.data[0]);
                response.data.length > 0 ? setExhibitionTeam(response.data[0].listResult) : setExhibitionTeam();
                setReload && setReload();
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        reload && getExhibitionResult(exhibitionType);
    }, [reload, setReload, exhibitionType, exhibitionTeam]);

    useEffect(() => {
        const getExhibitionResult = async (exhibitionType) => {
            try {
                const response = await adminTournament.getExhibitionResult(exhibitionType);
                response.data.length > 0 ? setExhibitionTeam(response.data[0].listResult) : setExhibitionTeam();
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        const fetchExhibitionType = async (tournamentId) => {
            try {
                const response = await adminTournament.getListExhibitionType(tournamentId);
                if (response.data.length > 0) {
                    setTournamentStatus(response.data[0].status);
                    setListExhibitionType(response.data);
                    getExhibitionResult(response.data[0].id);
                    type == 0 && setExhibitionType(response.data[0].id);
                    const _result =
                        result.find((subResult) =>
                            subResult.data.length > 0
                                ? subResult.data.find((d) => d.exhibitionType.id == response.data[0].id)
                                : null,
                        ) != null
                            ? result.find((subResult) =>
                                  subResult.data.length > 0
                                      ? subResult.data.find((d) => d.exhibitionType.id == response.data[0].id)
                                      : null,
                              )
                            : null;
                    setTournamentResult(_result ? _result.data[0].listResult : null);
                    setIsRenderTotal(false);
                } else {
                }
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        isRenderTotal && fetchExhibitionType(tournamentId);
        getAllArea();
    }, [tournamentId, exhibitionType, isRenderTotal, result, type]);

    const UpdateResultHandler = () => {
        setIsRender(true);
    };

    return (
        <Fragment>
            {!isUnorganized ? (
                <>
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
                    {tournamentResult && tournamentResult.length > 0 && (
                        <Paper elevation={3} sx={{ m: 2, p: 2 }}>
                            <Typography variant="h6">Kết quả bảng đấu</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Tooltip title="Huy chương vàng">
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Gold />

                                        <Typography variant="body1">
                                            {tournamentResult.filter((result) => result.rank == 1)[0].teamName}
                                        </Typography>
                                    </Box>
                                </Tooltip>
                                <Tooltip title="Huy chương bạc">
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Sliver />

                                        <Typography variant="body1">
                                            {tournamentResult.filter((result) => result.rank == 2)[0].teamName}
                                        </Typography>
                                    </Box>
                                </Tooltip>
                                <Tooltip title="Huy chương đồng">
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Brone />

                                        <Typography variant="body1">
                                            {tournamentResult.filter((result) => result.rank == 3)[0].teamName}
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            </Box>
                        </Paper>
                    )}
                    {exhibitionTeam && areaList ? (
                        exhibitionTeam.length > 0 ? (
                            <TableMatch
                                matches={exhibitionTeam}
                                status={tournamentStatus}
                                areaList={areaList}
                                stage={tournamentStage}
                                onUpdateResult={UpdateResultHandler}
                                endDate={endDate}
                            />
                        ) : (
                            <Box sx={{ display: 'flex' }}>
                                <Typography variant="body1" sx={{ m: 'auto' }}>
                                    Thể thức này chưa có thời gian và địa điểm thi đấu
                                </Typography>
                            </Box>
                        )
                    ) : (
                        <LoadingProgress />
                    )}
                </>
            ) : (
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ m: 'auto' }}>
                        Giải đấu không tổ chức thi đấu biểu diễn
                    </Typography>
                </Box>
            )}
        </Fragment>
    );
}

export default TournamentExhibition;
