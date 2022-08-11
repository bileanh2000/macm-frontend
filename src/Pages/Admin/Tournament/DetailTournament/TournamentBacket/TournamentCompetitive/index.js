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

function TournamentCompetitive({ reload }) {
    let { tournamentId } = useParams();
    const [tournamentStatus, setTournamentStatus] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const [competitiveId, setCompetitiveId] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [listPlayer, setListPlayer] = useState([]);
    const [rounds, setRounds] = useState();
    const [areaList, setAreaList] = useState();
    const [open, setOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(true);
    const [isRender, setIsRender] = useState(true);
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
            if (response.data.length > 0) {
                setListPlayer(response.data[0].listMatchDto);
                setTournamentStatus(response.data[0].status);
                setRounds(response.totalResult);
                setIsCreate(response.data[0].changed);
            } else {
                setListPlayer(response.data);
                setTournamentStatus(0);
                setRounds(0);
                setIsCreate(true);
            }
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    };

    const spawnMatches = async (weightRange) => {
        try {
            const response = await adminTournament.spawnMatchs(weightRange);
            getListPlayerByCompetitiveID(weightRange);
            // setListPlayer(response.data)
            setIsRender(true);
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    };

    const handleDialogCreate = () => {
        if (competitiveId == 0) {
            let varian = 'error';
            enqueueSnackbar('Vui lòng chọn hạng cân trước khi tạo bảng đấu', { varian });
            return;
        }
        console.log('haha');
        spawnMatches(competitiveId);
    };

    const spawnTimeAndArea = async () => {
        try {
            const response = await adminTournament.spawnTimeAndArea(tournamentId);
            setIsRender(true);
            getListPlayerByCompetitiveID(competitiveId);
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {
            console.log('Failed to spawn time: ', error);
        }
    };

    const confirmListMatchsPlayer = async () => {
        try {
            const response = await adminTournament.confirmListMatchsPlayer(competitiveId);
            setIsRender(true);
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
        setIsRender(true);
        // getListPlayerByCompetitiveID(competitiveId);
    };

    useEffect(() => {
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
        isRender && fetchTournamentById(tournamentId);
        getAllArea();
        setIsRender(false);
        console.log('re-render');
    }, [tournamentId, isRender]);

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
                {tournamentStatus == 0 && listPlayer.length > 0 && (
                    <Button variant="outlined" onClick={handleDialogConfirmMatch} sx={{ mr: 2, float: 'right' }}>
                        Xác nhận bảng thi đấu
                    </Button>
                )}
            </Box>
            {listPlayer && areaList && listPlayer.length > 0 ? (
                <div>
                    {/* {tournamentStatus == 2 ? (
                        listPlayer[listPlayer.length - 1].area ? (
                            ''
                        ) : (
                            <Button variant="outlined" onClick={handleDialogUpdateTime} sx={{ mr: 2, float: 'right' }}>
                                Cập nhật thời gian thi đấu
                            </Button>
                        )
                    ) : (
                        ''
                    )} */}
                    <CustomMatchBracket
                        matches={listPlayer}
                        competitiveId={competitiveId}
                        rounds={rounds}
                        status={tournamentStatus}
                        areaList={areaList}
                        onUpdateResult={UpdateResultHandler}
                        isCreate={isCreate}
                        onCreateMatches={handleDialogCreate}
                        onChangeData={() => {
                            console.log('render data bracket');
                            setIsRender(true);
                        }}
                    />
                </div>
            ) : (
                // ) : tournamentStatus == 1 ? (
                //     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                //         <Typography variant="body1" sx={{ m: '0 auto' }}>
                //             Thể thức này chưa có bảng thi đấu
                //         </Typography>
                //         <Button variant="outlined" onClick={handleDialogCreate} sx={{ mr: 2, float: 'right' }}>
                //             Tạo bảng đấu
                //         </Button>
                //     </Box>
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
