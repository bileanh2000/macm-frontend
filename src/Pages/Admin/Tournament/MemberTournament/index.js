import { Alert, Box, Button, FormControl, MenuItem, Select, Snackbar, Tab, Tabs, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import adminTournamentAPI from 'src/api/adminTournamentAPI';
import AddMemberTourament from './AddMemberTournament';
import MemberList from './MemberList';
import RegisterExhibition from './RegisterExhibition';
import RegisterPlayer from './RegisterPlayer';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function MemberTournament({ tournament, isUpdate, tournamentStage, user }) {
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

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
        setExhibitionType(event.target.value);
        let exType;
        if (event.target.value === 0) {
            exType = { exhibitionType: 0 };
        } else {
            exType = listExhibitionType.find((type) => type.id === event.target.value);
        }
        fetchExhibitionTeam(tournamentId, event.target.value);
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
            if (response.data.length > 0) {
                console.log(response.data);
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
            setIsRender(false);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        getAllCompetitiveType(tournamentId);
        fetchExhibitionType(tournamentId);
    }, [tournamentId]);

    useEffect(() => {
        isRenderCompe && fetchCompetitivePlayer(weightRange);
    }, [weightRange, competitivePlayer, isRenderCompe]);

    useEffect(() => {
        isRender && fetchExhibitionTeam(tournamentId, exhibitionType);
    }, [tournamentId, exhibitionType, exhibitionTeam, isRender]);

    return (
        <Fragment>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="basic tabs example"
                >
                    <Tab label="Danh sách vận động viên" {...a11yProps(0)} value={0} />
                    {/* <Tab label="Cập nhật vai trò" {...a11yProps(1)} /> */}
                    <Tab label="Xét duyệt yêu cầu tham gia" {...a11yProps(1)} value={1} />
                </Tabs>
                {/* {!isUpdate && (
                        <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleOpenDialogExhibition(true)}>
                            Thêm vận động viên thi đấu biểu diễn
                        </Button>
                    )} */}
            </Box>
            <div role="tabpanel" hidden={value !== 0} id={`simple-tabpanel-${0}`} aria-labelledby={`simple-tab-${0}`}>
                <Box sx={{ minHeight: '60vh' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FormControl size="small" sx={{ mr: 2, minWidth: '10rem' }}>
                            <Typography variant="caption">Nội dung thi đấu</Typography>
                            <Select
                                id="demo-simple-select"
                                value={type}
                                displayEmpty
                                onChange={handleChangeType}
                                sx={{ minWidth: '10rem' }}
                            >
                                <MenuItem value={1}>Đối kháng</MenuItem>
                                <MenuItem value={2}>Biểu diễn</MenuItem>
                            </Select>
                        </FormControl>
                        {type === 1 ? (
                            tournament.competitiveTypes.length > 0 ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-end',
                                    }}
                                >
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
                                    {!isUpdate &&
                                        tournamentStage == 0 &&
                                        tournament.competitiveTypes.length > 0 &&
                                        competitivePlayer && (
                                            <Box
                                                sx={{
                                                    // width: '100%',
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
                                                    Thêm vận động viên thi đấu đối kháng
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
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex' }}>
                                    <Typography variant="body1" sx={{ m: 'auto' }}>
                                        Giải đấu không tổ chức thi đấu đối kháng
                                    </Typography>
                                </Box>
                            )
                        ) : tournament.exhibitionTypes.length > 0 ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end',
                                    width: '100%',
                                }}
                            >
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
                                {!isUpdate &&
                                    tournamentStage == 0 &&
                                    tournament.exhibitionTypes.length > 0 &&
                                    exhibitionTeam && (
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
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex' }}>
                                <Typography variant="body1" sx={{ m: 'auto' }}>
                                    Giải đấu không tổ chức thi đấu biểu diễn
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    {type == 1 && tournament.competitiveTypes.length > 0 && competitivePlayer && (
                        <MemberList
                            data={competitivePlayer}
                            type={type}
                            onChange={() => {
                                return setIsRenderCompe(true);
                            }}
                            user={user}
                            isUpdate={isUpdate}
                            tournamentStatus={tournamentStatus}
                            tournamentStage={tournamentStage}
                            listExhibitionType={listExhibitionType}
                        />
                    )}
                    {type == 2 && tournament.exhibitionTypes.length > 0 && exhibitionTeam && (
                        <MemberList
                            data={exhibitionTeam}
                            type={type}
                            user={user}
                            onChange={() => {
                                return setIsRender(true);
                            }}
                            isUpdate={isUpdate}
                            tournamentStage={tournamentStage}
                            tournamentStatus={tournamentStatus}
                            listExhibitionType={listExhibitionType}
                        />
                    )}
                    {tournament.competitiveTypes.length > 0 && competitivePlayer && (
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
                                setIsRender(true);
                                setIsRenderCompe(true);
                            }}
                        />
                    )}
                    {tournament.exhibitionTypes.length > 0 && exhibitionTeam && (
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
                                setIsRender(true);
                                setIsRenderCompe(true);
                            }}
                        />
                    )}
                </Box>
            </div>
            {value == 1 && (
                <AddMemberTourament
                    value={value}
                    index={1}
                    onChange={() => {
                        setIsRender(true);
                        // onChange && onChange();
                    }}
                    tournament={tournament}
                    isUpdate={isUpdate}
                    tournamentStatus={tournamentStatus}
                    tournamentStage={tournamentStage}
                    listExhibitionType={listExhibitionType}
                />
            )}
        </Fragment>
    );
}

export default MemberTournament;
