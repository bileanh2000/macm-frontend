import { Alert, Box, Button, FormControl, MenuItem, Select, Snackbar, Tab, Tabs, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import adminTournamentAPI from 'src/api/adminTournamentAPI';
import MemberList from './MemberList';

function AddMemberTourament({ tournament, isUpdate, tournamentStage, onChange }) {
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
    const [tournamentStatus, setTournamentStatus] = useState(0);
    const [isRender, setIsRender] = useState(true);
    const [isRenderCompe, setIsRenderCompe] = useState(true);
    const [value, setValue] = React.useState(0);

    const handleChangeType = (event) => {
        setType(event.target.value);
        if (type === 1) {
            getAllRequestToJoinTournamentCompetitiveType(tournamentId);
        } else {
            getAllRequestToJoinTournamentExhibitionType(tournamentId);
        }
    };

    const getAllRequestToJoinTournamentCompetitiveType = async (tournamentId) => {
        try {
            const response = await adminTournamentAPI.getAllRequestToJoinTournamentCompetitiveType(tournamentId);
            console.log('request join competitive', response.data);
            setCompetitivePlayer(response.data);
            // setIsCreate(response.data[0].changed);
            // setTournamentStatus(response.data[0].status);
            setIsRenderCompe(false);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    const getAllRequestToJoinTournamentExhibitionType = async (tournamentId) => {
        try {
            const response = await adminTournamentAPI.getAllRequestToJoinTournamentExhibitionType(tournamentId);
            console.log('request join ExhibitionType', response.data);
            setExhibitionTeam(response.data);
            setIsRender(false);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        isRenderCompe && getAllRequestToJoinTournamentCompetitiveType(tournamentId);
    }, [tournamentId, competitivePlayer, isRenderCompe]);

    useEffect(() => {
        isRender && getAllRequestToJoinTournamentExhibitionType(tournamentId);
    }, [tournamentId, exhibitionTeam, isRender]);

    return (
        <Fragment>
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
            </Box>

            {type == 1 && tournament.competitiveTypes.length > 0 && competitivePlayer && (
                <MemberList
                    data={competitivePlayer}
                    type={type}
                    onChange={() => {
                        onChange && onChange();
                        setIsRender(true);
                        setIsRenderCompe(true);
                    }}
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
                    onChange={() => {
                        onChange && onChange();
                        setIsRender(true);
                        setIsRenderCompe(true);
                    }}
                    isUpdate={isUpdate}
                    tournamentStage={tournamentStage}
                    tournamentStatus={tournamentStatus}
                    listExhibitionType={listExhibitionType}
                />
            )}
        </Fragment>
    );
}

export default AddMemberTourament;
