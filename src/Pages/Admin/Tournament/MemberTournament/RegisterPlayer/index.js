import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
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
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import adminTournament from 'src/api/adminTournamentAPI';
import AddMember from './AddMember';
import userApi from 'src/api/userApi';
import { Delete } from '@mui/icons-material';
import userTournamentAPI from 'src/api/userTournamentAPI';
import { useSnackbar } from 'notistack';

function RegisterPlayer({ isOpen, handleClose, onSuccess }) {
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [player, setPlayer] = useState([]);
    const [weightRange, setWeightRange] = useState(0);
    const [gender, setGender] = useState();
    const [listWeightRange, setListWeightRange] = useState([]);
    const [minWeight, setMinWeight] = useState();
    const [maxWeight, setMaxWeight] = useState();
    const [allMember, setAllMember] = useState();

    const validationSchema = Yup.object().shape({
        weight: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(minWeight, `Vui lòng nhập hạng cân trong khoảng ${minWeight} - ${maxWeight} Kg`)
            .max(maxWeight, `Vui lòng nhập hạng cân trong khoảng ${minWeight} - ${maxWeight} Kg`),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    const AddPlayerHandler = (data) => {
        setPlayer(data);
    };
    const handleChangeWeight = (event) => {
        setWeightRange(event.target.value);
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
    };

    const getAllMember = async () => {
        try {
            const response = await adminTournament.listUserNotJoinCompetitive(tournamentId);
            console.log(response.data);
            setAllMember(response.data);
        } catch (error) {
            console.log('khong the lay data');
        }
    };

    const addNewCompetitivePlayer = async (tournamentId, studentId, weight) => {
        try {
            const response = await adminTournament.addNewCompetitivePlayer(tournamentId, studentId, weight);
            let variant = 'success';
            enqueueSnackbar(response.message, { variant });
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar(error, { variant });
        }
    };

    const handleCloseDialog = () => {
        setPlayer([]);
        reset({
            weight: '',
        });
        handleClose && handleClose();
    };

    const handleRegister = (data) => {
        // const params = { userId: player[0].id, competitiveTypeId: weightRange, weight: data.weight, tournamentId };
        if (player.length === 0) {
            let variant = 'error';
            enqueueSnackbar('Vui lòng chọn thông tin người chơi', { variant });
            return;
        }
        console.log(tournamentId, player[0].id, data.weight);
        addNewCompetitivePlayer(tournamentId, player[0].id, data.weight);
        const newPlayer = {
            playerGender: player[0].gender,
            playerName: player[0].name,
            playerStudentId: player[0].studentId,
            weight: data.weight,
            weightMax: maxWeight,
            weightMin: minWeight,
        };
        onSuccess && onSuccess(newPlayer);
        setPlayer([]);
        reset({
            weight: '',
        });
        handleClose && handleClose();
    };

    const fetchCompetitiveType = async (tournamentId) => {
        try {
            const response = await adminTournament.getAllCompetitiveType(tournamentId);
            console.log(response.data[0]);
            setListWeightRange(response.data[0]);
            setWeightRange(response.data[0][0].id);
            setGender(response.data[0][0].gender);
            setMinWeight(response.data[0][0].weightMin);
            setMaxWeight(response.data[0][0].weightMax);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        fetchCompetitiveType(tournamentId);
    }, [tournamentId]);

    useEffect(() => {
        getAllMember();
    }, []);

    return (
        <Dialog
            open={!!isOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Thêm thành viên vào giải đấu</DialogTitle>
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
                        {/* <Typography variant="caption">Hạng cân</Typography> */}
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
                    <Grid item xs={8}>
                        <Paper elevation={3} sx={{ width: '100%' }}>
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
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            type="number"
                            id="outlined-basic"
                            label="Cân nặng"
                            variant="outlined"
                            {...register('weight')}
                            error={errors.weight ? true : false}
                            helperText={errors.weight?.message}
                            required
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                <Button onClick={handleSubmit(handleRegister)} autoFocus>
                    Đồng ý
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RegisterPlayer;
