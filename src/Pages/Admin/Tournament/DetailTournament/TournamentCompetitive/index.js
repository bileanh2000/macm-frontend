import React, { Fragment, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';

import CustomMatchBracket from './CustomMatchBracket';
import adminTournament from 'src/api/adminTournamentAPI';

function TournamentCompetitive({ tournamentStatus }) {
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [competitiveId, setCompetitiveId] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [listPlayer, setListPlayer] = useState([]);
    const [rounds, setRounds] = useState();
    const [areaList, setAreaList] = useState();
    const [open, setOpen] = useState(false);
    // const [tournamentStatus, setTournamentStatus] = useState(-1);

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
            // setTournamentStatus(response.code);
            setRounds(response.totalResult);
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    };

    const spawnMatches = async (weightRange) => {
        try {
            const response = await adminTournament.spawnMatchs(weightRange);
            getListPlayerByCompetitiveID(weightRange);
            // setListPlayer(response.data)
            enqueueSnackbar(response.message, { variant: 'success' });
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
        // console.log(listPlayer);
        if (listPlayer && listPlayer.length == 0) {
            console.log('loz3');
            spawnMatches(competitiveId);
            console.log('loz4');
        }
        // console.log(listPlayer);
        // if (listPlayer && listPlayer.length > 0) {
        // } else {
        //     enqueueSnackbar('Không thể tạo bảng đấu do không đủ người', { error: 'error' });
        //     return;
        // }
    };

    const spawnTimeAndArea = async () => {
        try {
            const response = await adminTournament.spawnTimeAndArea(tournamentId);
            getListPlayerByCompetitiveID(competitiveId);
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {
            console.log('Failed to spawn time: ', error);
        }
    };

    const confirmListMatchsPlayer = async () => {
        try {
            const response = await adminTournament.confirmListMatchsPlayer(tournamentId);
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {
            console.log('Failed to confirm match: ', error);
        }
    };

    const handleDialogUpdateTime = () => {
        spawnTimeAndArea();
    };

    const handleDialogConfirmMatch = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };

    const handleOk = () => {
        confirmListMatchsPlayer();
        handleCancel();
    };

    const UpdateResultHandler = (newMatches) => {
        setListPlayer(newMatches);
        // getListPlayerByCompetitiveID(competitiveId);
    };

    useEffect(() => {
        fetchTournamentById(tournamentId);
        getAllArea();
    }, []);

    return (
        <Fragment>
            <Dialog maxWidth="xs" open={open}>
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        Bạn có chắc chắn muốn sử dụng thứ tự thi đấu này và cập nhật thời gian?
                    </DialogContentText>
                    <Typography variant="caption">
                        Sau khi xác nhận sẽ không thay đổi vị trí thi đấu của các tuyển thủ nữa!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCancel}>
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleOk}>Đồng ý</Button>
                </DialogActions>
            </Dialog>
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
                {tournamentStatus == 1 && listPlayer.length > 0 && (
                    <Button variant="outlined" onClick={handleDialogConfirmMatch} sx={{ mr: 2, float: 'right' }}>
                        Xác nhận danh sách thi đấu
                    </Button>
                )}
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
                        competitiveId={competitiveId}
                        rounds={rounds}
                        status={tournamentStatus}
                        areaList={areaList}
                        onUpdateResult={UpdateResultHandler}
                    />
                </div>
            ) : tournamentStatus == 1 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" sx={{ m: '0 auto' }}>
                        Thể thức này chưa có bảng thi đấu
                    </Typography>
                    <Button variant="outlined" onClick={handleDialogCreate} sx={{ mr: 2, float: 'right' }}>
                        Tạo bảng đấu
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ m: 'auto' }}>
                        Thể thức này chưa tổ chức
                    </Typography>
                </Box>
            )}
        </Fragment>
    );
}

export default TournamentCompetitive;
