import { Alert, Box, Button, FormControl, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import MemberList from './MemberList';
import RegisterExhibition from './RegisterExhibition';
import RegisterPlayer from './RegisterPlayer';

function MemberTournament({ tournament }) {
    console.log(tournament);
    let { tournamentId } = useParams();
    const [type, setType] = useState(1);
    const [competitivePlayer, setCompetitivePlayer] = useState([]);
    const [exhibitionTeam, setExhibitionTeam] = useState([]);
    const [weightRange, setWeightRange] = useState(0);
    const [exhibitionType, setExhibitionType] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [listExhibitionType, setListExhibitionType] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogExhibition, setOpenDialogExhibition] = useState(false);

    const handleOpenDialogExhibition = () => {
        setOpenDialogExhibition(true);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleChangeType = (event) => {
        setType(event.target.value);
        if (type === 1) {
            fetchCompetitivePlayer(tournamentId, weightRange);
        } else {
            fetchExhibitionTeam(tournamentId, exhibitionType);
        }
    };

    const handleChangeWeight = (event) => {
        setWeightRange(event.target.value);
        let range;
        if (event.target.value === 0) {
            range = { weightMax: 0, weightMin: 0 };
        } else {
            range = listWeightRange.find((weight) => weight.id === event.target.value);
        }
        fetchCompetitivePlayer(tournamentId, range);
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
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const getAllCompetitiveType = async (tournamentId) => {
        try {
            const response = await adminTournamentAPI.getAllCompetitiveType(tournamentId);
            console.log(response.data[0]);
            setListWeightRange(response.data[0]);
            setWeightRange(response.data[0][0].id);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const fetchCompetitivePlayer = async (params, weightRange) => {
        try {
            const response = await adminTournamentAPI.getAllCompetitivePlayer(params, weightRange);
            setCompetitivePlayer(response.data);
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

    useEffect(() => {
        fetchCompetitivePlayer(tournamentId, weightRange == 0 ? { weightMin: 0, weightMax: 0 } : weightRange);
        fetchExhibitionTeam(tournamentId, exhibitionType == 0 ? { exhibitionType: 0 } : exhibitionType);
        getAllCompetitiveType(tournamentId);
        fetchExhibitionType(tournamentId);
    }, [type]);

    return (
        <Fragment>
            <Box>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Danh sách thành viên tham gia
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                <FormControl size="small">
                    <Typography variant="caption">Nội dung thi đấu</Typography>
                    <Select id="demo-simple-select" value={type} displayEmpty onChange={handleChangeType}>
                        <MenuItem value={1}>Đối kháng</MenuItem>
                        <MenuItem value={2}>Biểu diễn</MenuItem>
                    </Select>
                </FormControl>
                {type === 1 ? (
                    tournament.competitiveTypes.length > 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleOpenDialog(true)}>
                                Thêm người chơi thi đấu đối kháng
                            </Button>
                            <FormControl size="small">
                                <Typography variant="caption">Hạng cân</Typography>
                                <Select
                                    id="demo-simple-select"
                                    value={weightRange}
                                    displayEmpty
                                    onChange={handleChangeWeight}
                                >
                                    <MenuItem value={0}>
                                        <em>Tất cả</em>
                                    </MenuItem>
                                    {listWeightRange &&
                                        listWeightRange.map((range) => (
                                            <MenuItem value={range.id} key={range.id}>
                                                {range.gender == 0 ? 'Nam: ' : 'Nữ: '} {range.weightMin} -{' '}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                        <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleOpenDialogExhibition(true)}>
                            Thêm người chơi thi đấu biểu diễn
                        </Button>
                        <FormControl size="small">
                            <Typography variant="caption">Thể thức thi đấu</Typography>
                            <Select
                                id="demo-simple-select"
                                value={exhibitionType}
                                displayEmpty
                                onChange={handleChangeExhibitionType}
                            >
                                <MenuItem value={0}>
                                    <em>Tất cả</em>
                                </MenuItem>
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
                <RegisterPlayer
                    title="Đăng kí tham gia thi đấu"
                    isOpen={openDialog}
                    handleClose={() => {
                        setOpenDialog(false);
                    }}
                    onSucess={(newItem) => {
                        setCompetitivePlayer([newItem, ...competitivePlayer]);
                        setOpenDialog(false);
                    }}
                />
                <RegisterExhibition
                    title="Đăng kí tham gia biểu diễn"
                    isOpen={openDialogExhibition}
                    handleClose={() => {
                        setOpenDialogExhibition(false);
                    }}
                    onSucess={(newItem) => {
                        setExhibitionTeam([newItem, ...exhibitionTeam]);
                        setOpenDialogExhibition(false);
                    }}
                />
            </Box>
            {type == 1 && tournament.competitiveTypes.length > 0 && <MemberList data={competitivePlayer} type={type} />}
            {type == 2 && tournament.exhibitionTypes.length > 0 > 0 && <MemberList data={exhibitionTeam} type={type} />}
            {/* <MemberList data={type == 1 ? competitivePlayer : } type={type} /> */}
        </Fragment>
    );
}

export default MemberTournament;
