import { Alert, Box, Button, FormControl, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import adminTournamentAPI from 'src/api/adminTournamentAPI';
import MemberList from './MemberList';
import RegisterExhibition from './RegisterExhibition';
import RegisterPlayer from './RegisterPlayer';

function MemberTournament({ tournament, isUpdate }) {
    let { tournamentId } = useParams();
    const [type, setType] = useState(1);
    const { enqueueSnackbar } = useSnackbar();
    const [isCreate, setIsCreate] = useState(false);
    const [competitivePlayer, setCompetitivePlayer] = useState();
    const [exhibitionTeam, setExhibitionTeam] = useState();
    const [weightRange, setWeightRange] = useState(0);
    const [exhibitionType, setExhibitionType] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [listExhibitionType, setListExhibitionType] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogExhibition, setOpenDialogExhibition] = useState(false);
    const [tournamentStatus, setTournamentStatus] = useState(0);
    const [isRender, setIsRender] = useState(true);
    const [isRenderCompe, setIsRenderCompe] = useState(true);

    const handleOpenDialogExhibition = () => {
        setOpenDialogExhibition(true);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleChangeType = (event) => {
        setType(event.target.value);
        if (type === 1) {
            fetchCompetitivePlayer(weightRange);
        } else {
            fetchExhibitionTeam(tournamentId, exhibitionType);
        }
    };

    const handleChangeWeight = (event) => {
        console.log(event.target.value);
        setWeightRange(event.target.value);
        let range;
        if (event.target.value === 0) {
            range = { weightMax: 0, weightMin: 0 };
        } else {
            range = listWeightRange.find((weight) => weight.id === event.target.value);
        }
        fetchCompetitivePlayer(event.target.value);
    };

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
        fetchExhibitionTeam(tournamentId, exType);
    };

    const fetchExhibitionType = async (tournamentId) => {
        try {
            const response = await adminTournamentAPI.getAllExhibitionType(tournamentId);
            setListExhibitionType(response.data);
            setExhibitionType(response.data[0].id);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const getAllCompetitiveType = async (tournamentId) => {
        try {
            const response = await adminTournamentAPI.getAllCompetitiveType(tournamentId);
            setListWeightRange(response.data[0]);
            setWeightRange(response.data[0][0].id);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const fetchCompetitivePlayer = async (weightRange) => {
        try {
            const response = await adminTournamentAPI.getListPlayerBracket(weightRange);
            console.log('fetchCompetitivePlayer', response.data);
            if (response.data.length > 0) {
                setCompetitivePlayer(response.data[0].listPlayers);
                setIsCreate(response.data[0].changed);
                setTournamentStatus(response.data[0].status);
                setIsRenderCompe(false);
            }
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    const fetchExhibitionTeam = async (params, exhibitionType) => {
        try {
            const response = await adminTournamentAPI.getAllExhibitionTeam(params, exhibitionType);

            setExhibitionTeam(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const spawnMatches = async (weightRange) => {
        try {
            const response = await adminTournamentAPI.spawnMatchs(weightRange);
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    };

    const handleCreateMatches = () => {
        if (weightRange == 0) {
            let varian = 'error';
            enqueueSnackbar('Vui lòng chọn hạng cân trước khi tạo bảng đấu', { varian });
            return;
        }
        spawnMatches(weightRange);
    };

    const handleChange = () => {
        setIsRender(true);
    };

    useEffect(() => {
        isRenderCompe && fetchCompetitivePlayer(weightRange);
    }, [weightRange, competitivePlayer, isRenderCompe]);

    useEffect(() => {
        isRender && getAllCompetitiveType(tournamentId);
        isRender && fetchExhibitionType(tournamentId);
        isRender && fetchExhibitionTeam(tournamentId, exhibitionType == 0 ? { exhibitionType: 0 } : exhibitionType);
        setIsRender(false);
    }, [tournamentId, exhibitionType, exhibitionTeam, isRender]);

    return (
        <Fragment>
            {competitivePlayer && exhibitionTeam && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <FormControl size="small">
                            <Typography variant="caption">Nội dung thi đấu</Typography>
                            <Select id="demo-simple-select" value={type} displayEmpty onChange={handleChangeType}>
                                <MenuItem value={1}>Đối kháng</MenuItem>
                                <MenuItem value={2}>Biểu diễn</MenuItem>
                            </Select>
                        </FormControl>
                        {type === 1 ? (
                            tournament.competitiveTypes.length > 0 ? (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    {!isUpdate && tournamentStatus < 2 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-end',
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                sx={{ mr: 2 }}
                                                onClick={() => handleOpenDialog(true)}
                                            >
                                                Thêm vận động viến thi đấu đối kháng
                                            </Button>
                                            {/* <Button
                                                variant="outlined"
                                                sx={{ mr: 2 }}
                                                onClick={() => handleCreateMatches()}
                                                disabled={!isCreate}
                                            >
                                                Tạo bảng thi đấu
                                            </Button> */}
                                        </Box>
                                    )}
                                    {/* <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleOpenDialog(true)}>
                                        Thêm vận động viên thi đấu đối kháng
                                    </Button> */}
                                    <FormControl size="small">
                                        <Typography variant="caption">Hạng cân</Typography>
                                        <Select
                                            id="demo-simple-select"
                                            value={weightRange}
                                            displayEmpty
                                            onChange={handleChangeWeight}
                                        >
                                            {/* <MenuItem value={0}>
                                        <em>Tất cả</em>
                                    </MenuItem> */}
                                            {listWeightRange &&
                                                listWeightRange.map((range) => (
                                                    <MenuItem value={range.id} key={range.id}>
                                                        {range.gender ? 'Nam: ' : 'Nữ: '} {range.weightMin} -{' '}
                                                        {range.weightMax} Kg
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="h5">Không tổ chức thi đấu đối kháng</Typography>
                                </Box>
                            )
                        ) : tournament.exhibitionTypes.length > 0 ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                {!isUpdate && tournamentStatus < 2 && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            sx={{ mr: 2 }}
                                            onClick={() => handleOpenDialogExhibition(true)}
                                        >
                                            Thêm vận động viên thi đấu biểu diễn
                                        </Button>
                                        {/* <Button
                                    variant="outlined"
                                    sx={{ mr: 2 }}
                                    // onClick={() => handleOpenDialogExhibition(true)}
                                >
                                    Tạo bảng thi đấu
                                </Button> */}
                                    </Box>
                                )}
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
                        ) : (
                            <Box>
                                <Typography variant="h5">Không tổ chức thi đấu biểu diễn</Typography>
                            </Box>
                        )}
                    </Box>
                    {type == 1 && tournament.competitiveTypes.length > 0 && competitivePlayer && (
                        <MemberList
                            data={competitivePlayer}
                            type={type}
                            onChange={() => {
                                console.log('change compe');
                                return setIsRenderCompe(true);
                            }}
                            isUpdate={isUpdate}
                            tournamentStatus={tournamentStatus}
                            listExhibitionType={listExhibitionType}
                        />
                    )}
                    {type == 2 && tournament.exhibitionTypes.length > 0 > 0 && exhibitionTeam && (
                        <MemberList
                            data={exhibitionTeam}
                            type={type}
                            onChange={() => {
                                console.log('change exhi');
                                return setIsRender(true);
                            }}
                            isUpdate={isUpdate}
                            tournamentStatus={tournamentStatus}
                            listExhibitionType={listExhibitionType}
                        />
                    )}
                    <RegisterPlayer
                        title="Đăng kí tham gia thi đấu"
                        isOpen={openDialog}
                        competitiveId={weightRange}
                        handleClose={() => {
                            setOpenDialog(false);
                        }}
                        genderCompetitive={listWeightRange.filter((weight) => weight.id === weightRange)[0].gender}
                        onSuccess={(newItem) => {
                            // if (competitivePlayer.find((player) => player.playerStudentId == newItem.playerStudentId)) {
                            //     return;
                            // }
                            setCompetitivePlayer([...newItem, ...competitivePlayer]);
                            setOpenDialog(false);
                        }}
                        onChangeData={() => {
                            console.log('change compe');
                            return setIsRenderCompe(true);
                        }}
                    />
                    <RegisterExhibition
                        title="Đăng kí tham gia biểu diễn"
                        isOpen={openDialogExhibition}
                        exhibitionId={exhibitionType}
                        handleClose={() => {
                            setOpenDialogExhibition(false);
                        }}
                        onSuccess={() => {
                            // fetchExhibitionTeam(tournamentId, exhibitionType);
                            setOpenDialogExhibition(false);
                        }}
                        onChangeData={() => {
                            console.log('change exhi');
                            return setIsRender(true);
                        }}
                    />
                </Box>
            )}
        </Fragment>
    );
}

export default MemberTournament;
