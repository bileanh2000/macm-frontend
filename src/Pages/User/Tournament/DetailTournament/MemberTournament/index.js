import { Alert, Box, Button, FormControl, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import adminTournamentAPI from 'src/api/adminTournamentAPI';
import MemberList from './MemberList';

function MemberTournament(props) {
    // console.log(props);
    let { tournamentId } = useParams();
    const [type, setType] = useState(1);
    const [competitivePlayer, setCompetitivePlayer] = useState([]);
    const [exhibitionTeam, setExhibitionTeam] = useState([]);
    const [weightRange, setWeightRange] = useState(0);
    const [exhibitionType, setExhibitionType] = useState(0);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [listExhibitionType, setListExhibitionType] = useState([]);

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

    const fetchTournamentById = async (tournamentId) => {
        try {
            const response = await adminTournamentAPI.getAllCompetitiveType(tournamentId);
            console.log(response.data[0]);
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
                // setTournamentStatus(response.data[0].status);
                // setIsRenderCompe(false);
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

    useEffect(() => {
        fetchCompetitivePlayer(weightRange);
    }, [weightRange]);

    useEffect(() => {
        fetchExhibitionTeam(tournamentId, exhibitionType == 0 ? { exhibitionType: 0 } : exhibitionType);
        fetchTournamentById(tournamentId);
        fetchExhibitionType(tournamentId);
    }, [exhibitionType, tournamentId]);

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                    Danh sách thành viên tham gia
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                <FormControl size="small" sx={{ mr: 2 }}>
                    <Typography variant="caption">Nội dung thi đấu</Typography>
                    <Select id="demo-simple-select" value={type} displayEmpty onChange={handleChangeType}>
                        <MenuItem value={1}>Đối kháng</MenuItem>
                        <MenuItem value={2}>Biểu diễn</MenuItem>
                    </Select>
                </FormControl>
                {type === 1 ? (
                    props.tournament.competitiveTypes.length > 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                            <FormControl size="small">
                                <Typography variant="caption">Hạng cân</Typography>
                                <Select
                                    id="demo-simple-select"
                                    value={weightRange}
                                    displayEmpty
                                    onChange={handleChangeWeight}
                                >
                                    {listWeightRange &&
                                        listWeightRange.map((range) => (
                                            <MenuItem value={range.id} key={range.id}>
                                                {range.gender ? 'Nam: ' : 'Nữ: '} {range.weightMin} - {range.weightMax}{' '}
                                                Kg
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex' }}>
                            <Typography variant="body1" sx={{ m: 'auto' }}>
                                Giải đấu không tổ chức thi đấu đối kháng
                            </Typography>
                        </Box>
                    )
                ) : props.tournament.exhibitionTypes.length > 0 ? (
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
                ) : (
                    <Box sx={{ display: 'flex' }}>
                        <Typography variant="body1" sx={{ m: 'auto' }}>
                            Giải đấu không tổ chức thi đấu biểu diễn
                        </Typography>
                    </Box>
                )}
            </Box>
            <MemberList data={type == 1 ? competitivePlayer : exhibitionTeam} type={type} />
        </Fragment>
    );
}

export default MemberTournament;
