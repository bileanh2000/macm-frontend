import React, { Fragment, useEffect, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import moment from 'moment';

import adminTournament from 'src/api/adminTournamentAPI';
import TableMatch from './TableMatch';

function TournamentExhibition() {
    const nowDate = moment(new Date()).format('yyyy-MM-DD');

    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [exhibitionType, setExhibitionType] = useState(0);
    const [exhibitionTeam, setExhibitionTeam] = useState([]);
    const [listExhibitionType, setListExhibitionType] = useState([]);
    const [tournamentStatus, setTournamentStatus] = useState(-1);

    const handleChangeExhibitionType = (event) => {
        console.log(event.target.value);
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
            setListExhibitionType(response.data);
            setExhibitionType(response.data[0].id);
            getExhibitionResult(response.data[0].id, nowDate);
            setTournamentStatus(response.code);
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
            const response = await adminTournament.getExhibitionResult({ exhibitionType, date });
            console.log(response);
            setExhibitionTeam(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const spawnTimeAndArea = async () => {
        try {
            await adminTournament.spawnTimeAndAreaEx(tournamentId);
            getExhibitionResult(exhibitionType, nowDate);
        } catch (error) {
            console.log('Failed to spawn time: ', error);
        }
    };

    useEffect(() => {
        getExhibitionResult(exhibitionType == 0 ? 0 : exhibitionType, nowDate);
        fetchExhibitionType(tournamentId);
    }, [tournamentId]);

    const handleDialogCreate = () => {
        if (exhibitionType == 0) {
            let varian = 'error';
            enqueueSnackbar('Vui lòng chọn hạng cân trước khi tạo bảng đấu', { varian });
            return;
        }
        console.log(exhibitionTeam);
        if (exhibitionTeam && exhibitionTeam.length == 0) {
            console.log('loz3');
            spawnTimeAndArea(exhibitionType);
        }
        console.log(exhibitionTeam);
        if (exhibitionTeam && exhibitionTeam.length > 0) {
        } else {
            enqueueSnackbar('Không thể tạo bảng đấu do không đủ người', { error: 'error' });
            return;
        }
    };
    const handleDialogUpdateTime = () => {
        //spawnTimeAndArea();
    };

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Bảng đấu biểu diễn
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
            {exhibitionTeam && exhibitionTeam.length > 0 ? (
                <div>
                    {tournamentStatus == 2 ? (
                        exhibitionTeam[0].area ? (
                            ''
                        ) : (
                            <Button variant="outlined" onClick={handleDialogUpdateTime} sx={{ mr: 2, float: 'right' }}>
                                Cập nhật thời gian thi đấu
                            </Button>
                        )
                    ) : (
                        ''
                    )}
                    <TableMatch
                        matches={exhibitionTeam}
                        status={tournamentStatus}
                        // areaList={areaList}
                        // onUpdareResult={UpdateResultHandler}
                    />
                </div>
            ) : tournamentStatus == 1 ? (
                <Box sx={{ d: 'flex' }}>
                    <Typography variant="body1">Thể thức thi đấu này hiện đang chưa có tuyển thủ</Typography>
                    <Button variant="outlined" onClick={handleDialogCreate} sx={{ mr: 2, float: 'right' }}>
                        Tạo bảng đấu
                    </Button>
                </Box>
            ) : (
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