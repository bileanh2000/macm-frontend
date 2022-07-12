import { Alert, Box, Button, FormControl, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import adminTournament from 'src/api/adminTournamentAPI';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import CreatePreview from './CreatePreview';
import MemberList from './MemberList';


function MemberTournament() {
    let snackBarStatus;
    let { tournamentId } = useParams();
    const [type, setType] = useState(1);
    const [open, setOpen] = useState(false);
    const [competitivePlayer, setCompetitivePlayer] = useState([]);
    const [exhibitionTeam, setExhibitionTeam] = useState([]);
    const [weightRange, setWeightRange] = useState(0);
    const [exhibitionType, setExhibitionType] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [listExhibitionType, setListExhibitionType] = useState([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [listPlayer, setListPlayer] = useState()

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
        getListPlayerByCompetitiveID(event.target.value);
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

    const fetchTournamentById = async (tournamentId) => {
        try {
            const response = await adminTournamentAPI.getTournamentById(tournamentId);
            setListWeightRange(response.data[0].competitiveTypes);
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
        fetchTournamentById(tournamentId);
        fetchExhibitionType(tournamentId);
    }, [type]);

    const getListPlayerByCompetitiveID = async (weightRange) => {
        try {
            const response = await adminTournament.previewMatchsPlayer(weightRange);
            console.log(response.data)
            setListPlayer(response.data)
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    }

    const spawnMatches = async (weightRange) => {
        try {
            await adminTournament.spawnMatchs(weightRange);
            getListPlayerByCompetitiveID(weightRange)
            // setListPlayer(response.data)
        } catch (error) {
            console.log('Failed to fetch match: ', error);
        }
    }

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleDialogOpen = () => {
        if (weightRange == 0) {
            setOpenSnackBar(true);
            // setSnackBarStatus(false);
            snackBarStatus = false;
            dynamicAlert(snackBarStatus, 'Vui lòng chọn hạng cân trước khi tạo bảng đấu');
            return;
        }

        if (listPlayer && listPlayer.length == 0) {
            spawnMatches(weightRange)
        }
        //spawnMatches(weightRange)
        //setOpen(true);
    }

    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });

    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };
    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };
    return (
        <Fragment>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={3000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackBar}
                    variant="filled"
                    severity={customAlert.severity || 'success'}
                    sx={{ width: '100%' }}
                >
                    {customAlert.message}
                </Alert>
            </Snackbar>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                        <Button
                            variant="outlined"
                            // component={Link}
                            // to={`/admin/tournament/${tournamentId}/tournamentbracket`}
                            // sx={{ mr: 2 }}
                            onClick={handleDialogOpen}
                        >
                            Tạo bảng đấu
                        </Button>
                        {listPlayer && <CreatePreview
                            // DialogOpen={true}
                            title="Tạo bảng đấu"
                            params={{ listPlayer }}
                            isOpen={open}
                            handleClose={handleDialogClose}
                            onSucess={() => {
                                setOpen(false);
                            }}
                        />}
                        <FormControl size="small">
                            <Typography variant="caption">Hạng cân</Typography>
                            <Select id="demo-simple-select" value={weightRange} displayEmpty onChange={handleChangeWeight}>
                                <MenuItem value={0}>
                                    <em>Tất cả</em>
                                </MenuItem>
                                {listWeightRange &&
                                    listWeightRange.map((range) => (
                                        <MenuItem value={range.id} key={range.id}>
                                            {range.weightMin} - {range.weightMax} Kg
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl></Box>

                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
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
                )}
            </Box>
            <MemberList data={type == 1 ? competitivePlayer : exhibitionTeam} type={type} />
        </Fragment>
    );
}

export default MemberTournament;
