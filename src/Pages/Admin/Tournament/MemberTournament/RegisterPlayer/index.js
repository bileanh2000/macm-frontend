import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import adminTournament from 'src/api/adminTournamentAPI';
import AddMember from './AddMember';
import { Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function RegisterPlayer({ isOpen, handleClose, onSuccess, onChangeData, competitiveId, genderCompetitive }) {
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [player, setPlayer] = useState([]);
    const [weightRange, setWeightRange] = useState(competitiveId);
    const [gender, setGender] = useState(genderCompetitive);
    const [listWeightRange, setListWeightRange] = useState([]);
    const [minWeight, setMinWeight] = useState();
    const [maxWeight, setMaxWeight] = useState();
    const [allMember, setAllMember] = useState();
    const [isRender, setIsRender] = useState(true);

    const AddPlayerHandler = (data) => {
        setPlayer(data);
    };
    const handleChangeWeight = (event) => {
        setWeightRange(event.target.value);
        setPlayer([]);
        let range;
        if (event.target.value === 0) {
            range = { weightMax: 0, weightMin: 0 };
        } else {
            range = listWeightRange.find((weight) => weight.id === event.target.value);
            setGender(range.gender);
            console.log(range);
            setMinWeight(range.weightMin);
            setMaxWeight(range.weightMax);
        }
        getAllMember(event.target.value);
    };

    const getAllMember = async (weightRange) => {
        try {
            const response = await adminTournament.listUserNotJoinCompetitive(weightRange);
            console.log(response.data);
            setAllMember(response.data);
            // setIsRender(true);
        } catch (error) {
            console.log('khong the lay data');
        }
    };

    const addNewCompetitivePlayer = async (tournamentId, studentId, weight) => {
        try {
            const response = await adminTournament.addNewCompetitivePlayer(tournamentId, studentId, weight);
            let variant = response.data.length > 0 ? 'success' : 'error';
            enqueueSnackbar(response.message, { variant });
            onChangeData && onChangeData();
            setIsRender(true);
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar(error, { variant });
        }
    };

    const handleDelete = (data) => {
        let newData;
        console.log(data);
        newData = player.filter((d) => {
            return d.studentId !== data.studentId;
        });
        console.log(newData);
        setPlayer(newData);
    };

    const handleCloseDialog = () => {
        setPlayer([]);
        // reset({
        //     weight: '',
        // });
        handleClose && handleClose();
    };

    const handleRegister = (data) => {
        // const params = { userId: player[0].id, competitiveTypeId: weightRange, weight: data.weight, tournamentId };
        if (player.length === 0) {
            let variant = 'error';
            enqueueSnackbar('Vui lòng chọn thông tin vận động viên', { variant });
            return;
        }
        addNewCompetitivePlayer(weightRange, player);
        const newPlayer = player.map((p) => {
            return {
                id: p.id,
                tournamentPlayer: { user: { gender: p.gender, name: p.name, studentId: p.studentId } },
                weight: 0,
                competitiveType: { weightMax: maxWeight, weightMin: minWeight },
            };
        });
        onSuccess && onSuccess(newPlayer);
        setPlayer([]);
        // reset({
        //     weight: '',
        // });
        handleClose && handleClose();
    };

    useEffect(() => {
        setGender(genderCompetitive);
        setIsRender(true);
    }, [genderCompetitive]);

    useEffect(() => {
        setWeightRange(competitiveId);
        setIsRender(true);
    }, [competitiveId]);

    useEffect(() => {
        const fetchCompetitiveType = async (tournamentId) => {
            try {
                const response = await adminTournament.getAllCompetitiveType(tournamentId);
                console.log(response.data[0]);
                setListWeightRange(response.data[0]);
                // setWeightRange(response.data[0][0].id);
                console.log('check', gender == null);
                gender == null && setGender(response.data[0][0].gender);
                setMinWeight(response.data[0][0].weightMin);
                setMaxWeight(response.data[0][0].weightMax);
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        fetchCompetitiveType(tournamentId);
    }, [tournamentId, gender]);

    useEffect(() => {
        console.log('type', weightRange);
        isRender && getAllMember(weightRange);
        setIsRender(false);
    }, [weightRange, allMember, isRender]);

    return (
        <Dialog
            open={!!isOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Thêm vận động viên viên vào thi đấu đối kháng</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: 2 }}>
                    {allMember && (
                        <AddMember
                            data={player}
                            onAddPlayer={AddPlayerHandler}
                            allMember={allMember.filter((member) => member.gender === gender)}
                        />
                    )}
                    <FormControl size="small">
                        <Typography variant="caption">{gender ? 'Nam' : 'Nu'}</Typography>
                        <Select id="demo-simple-select" value={weightRange} displayEmpty onChange={handleChangeWeight}>
                            {listWeightRange &&
                                listWeightRange.map((range) => (
                                    <MenuItem value={range.id} key={range.id}>
                                        {range.gender ? 'Nam: ' : 'Nữ: '} {range.weightMin} - {range.weightMax} Kg
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ width: '100%', minHeight: 400 }}>
                            {player.length > 0 && (
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        {/* <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Mã sinh viên</TableCell>
                                                <TableCell align="center">Tên sinh viên</TableCell>
                                                <TableCell align="center">Giới tính</TableCell>
                                                <TableCell align="center"></TableCell>
                                            </TableRow>
                                        </TableHead> */}
                                        <TableBody>
                                            {player.map((data, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="center">{data.studentId}</TableCell>
                                                    <TableCell align="center">{data.name}</TableCell>
                                                    <TableCell align="center">{data.gender ? 'Nam' : 'Nữ'}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            aria-label="delete"
                                                            onClick={() => {
                                                                // handleOpenDialog();
                                                                handleDelete(data);
                                                            }}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleCloseDialog}>
                    Hủy
                </Button>
                <Button variant="contained" onClick={handleRegister} autoFocus disabled={player.length == 0}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RegisterPlayer;
