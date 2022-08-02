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

function RegisterPlayer({ title, isOpen, handleClose, userInformation, onSuccess }) {
    console.log(userInformation);
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [type, setType] = useState(1);
    const [weightRange, setWeightRange] = useState(0);
    const [exhibitionType, setExhibitionType] = useState(0);
    const [numnberMale, setNumberMale] = useState();
    const [numberFemale, setNumberFemale] = useState();
    const [listWeightRange, setListWeightRange] = useState([]);
    const [listExhibitionType, setListExhibitionType] = useState([]);
    const [dataMale, setDataMale] = useState([]);
    const [dataFemale, setDateFemale] = useState([]);
    const [minWeight, setMinWeight] = useState();
    const [maxWeight, setMaxWeight] = useState();
    const [allMember, setAllMember] = useState();

    const AddMaleHandler = (data) => {
        setDataMale(data);
    };

    const AddFemaleHandler = (data) => {
        setDateFemale(data);
    };

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    const validationSchema = Yup.object().shape({
        ...(type == 1 && {
            weight: Yup.number()
                .required('Không được để trống trường này')
                .typeError('Vui lòng nhập số')
                .min(minWeight, `Vui lòng nhập hạng cân trong khoảng ${minWeight} - ${maxWeight} Kg`)
                .max(maxWeight, `Vui lòng nhập hạng cân trong khoảng ${minWeight} - ${maxWeight} Kg`),
        }),
        ...(type == 2 && {
            teamName: Yup.string().required('Không được để trống trường này'),
        }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setFocus,
        setError,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    const checkValidWeight = (e) => {
        console.log(e.target.value, minWeight, maxWeight);
    };

    const handleChangeWeight = (event) => {
        setWeightRange(event.target.value);
        let range;
        if (event.target.value === 0) {
            range = { weightMax: 0, weightMin: 0 };
        } else {
            range = listWeightRange.find((weight) => weight.id === event.target.value);
            console.log(range);
            setMinWeight(range.weightMin);
            setMaxWeight(range.weightMax);
        }
    };

    const handleChangeExhibitionType = (event) => {
        console.log(event.target.value);
        setExhibitionType(event.target.value);
        let exType;
        if (event.target.value === 0) {
            exType = { exhibitionType: 0 };
        } else {
            exType = listExhibitionType.find((type) => type.id === event.target.value);
            setNumberMale(exType.numberMale);
            setNumberFemale(exType.numberFemale);
        }
        console.log(exType);
    };
    const getAllMember = async () => {
        try {
            const response = await userApi.getAllMember();
            console.log(response.data);
            setAllMember(response.data);
        } catch (error) {
            console.log('khong the lay data');
        }
    };

    const fetchExhibitionType = async (tournamentId) => {
        try {
            const response = await adminTournament.getAllExhibitionType(tournamentId);
            setListExhibitionType(response.data);
            setExhibitionType(response.data[0].id);
            setNumberMale(response.data[0].numberMale);
            setNumberFemale(response.data[0].numberFemale);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };
    const registerToJoinTournamentCompetitveType = async (tournamentId, studentId, params) => {
        try {
            const response = await userTournamentAPI.registerToJoinTournamentCompetitveType(
                tournamentId,
                studentId,
                params,
            );
            let variant = response.data > 0 ? 'success' : 'error';
            enqueueSnackbar(response.message, { variant });
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar(error, { variant });
        }
    };

    const registerToJoinTournamentExhibitionType = async (ournamentId, studentId, params) => {
        try {
            const response = await userTournamentAPI.registerToJoinTournamentExhibitionType(
                ournamentId,
                studentId,
                params,
            );
            let variant = response.data > 0 ? 'success' : 'error';
            enqueueSnackbar(response.message, { variant });
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar(error, { variant });
        }
    };

    const handleCloseDialog = () => {
        setDataMale([]);
        setDateFemale([]);
        reset({
            weight: '',
            teamName: '',
        });
        handleClose && handleClose();
    };

    const handleRegister = (data) => {
        const teamMember = [...dataMale, ...dataFemale];
        if (type == 1) {
            const params = { ...data, competitiveTypeId: weightRange };
            console.log(params);
            registerToJoinTournamentCompetitveType(tournamentId, userInformation.studentId, params);
        } else {
            const params = { teamMember, teamName: data.teamName, exhibitionTypeId: exhibitionType };
            console.log(params);
            registerToJoinTournamentExhibitionType(tournamentId, userInformation.studentId, params);
        }
        handleClose && handleClose();
    };

    const handleDelete = (data) => {
        let newData;
        console.log(data);
        if (data.gender == 0) {
            newData = dataMale.filter((d) => {
                return d.studentId !== data.studentId;
            });
            console.log(newData);
            setDataMale(newData);
        } else {
            newData = dataFemale.filter((d) => {
                return d.studentId !== data.studentId;
            });
            console.log(newData);
            setDateFemale(newData);
        }
    };

    const fetchCompetitiveType = async (tournamentId) => {
        try {
            const response = await adminTournament.getAllCompetitiveType(tournamentId);
            console.log(response.data[0]);
            setListWeightRange(response.data[0]);
            setWeightRange(response.data[0][0].id);
            setMinWeight(response.data[0][0].weightMin);
            setMaxWeight(response.data[0][0].weightMax);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        fetchCompetitiveType(tournamentId);
        fetchExhibitionType(tournamentId);
        // getAllMember();
    }, [type]);

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
            <DialogTitle id="alert-dialog-title">Đăng kí tham gia giải đấu</DialogTitle>
            <DialogContent>
                <Typography sx={{ m: 1 }}>
                    <strong>Họ và tên: </strong> {userInformation.name}
                </Typography>
                <Typography sx={{ m: 1 }}>
                    <strong>Mã SV: </strong> {userInformation.studentId}
                </Typography>
                <Typography sx={{ m: 1 }}>
                    <strong>Ngày sinh: </strong> {userInformation.dateOfBirth}
                </Typography>
                <Typography sx={{ m: 1 }}>
                    <strong>Giới tính: </strong> {userInformation.gender ? 'Nam' : 'Nữ'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', m: 2 }}>
                    <FormControl size="small" sx={{ mr: 1 }}>
                        <Typography variant="caption">Nội dung thi đấu</Typography>
                        <Select id="demo-simple-select" value={type} displayEmpty onChange={handleChangeType}>
                            <MenuItem value={1}>Đối kháng</MenuItem>
                            <MenuItem value={2}>Biểu diễn</MenuItem>
                        </Select>
                    </FormControl>
                    {type === 1 ? (
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
                                                {range.gender == 0 ? 'Nam: ' : 'Nữ: '} {range.weightMin} -{' '}
                                                {range.weightMax} Kg
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>
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
                {type == 1 && (
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <Typography sx={{ m: 1 }}>
                                <strong>Nhập số cân của bạn: </strong>{' '}
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <TextField
                                fullWidth
                                type="number"
                                id="outlined-basic"
                                label="Cân nặng"
                                variant="outlined"
                                {...register('weight')}
                                onChange={checkValidWeight}
                                error={errors.weight ? true : false}
                                helperText={errors.weight?.message}
                                required
                            />
                        </Grid>
                    </Grid>
                )}
                {type == 2 && (
                    <Box>
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            label="Tên đội"
                            variant="outlined"
                            {...register('teamName')}
                            // onChange={checkValidWeight}
                            error={errors.teamName ? true : false}
                            helperText={errors.teamName?.message}
                            required
                        />
                        <Box>
                            <Typography sx={{ m: 1 }}>
                                <strong>Số lượng nam: </strong> {numnberMale}
                            </Typography>
                            {dataMale.length < numnberMale && (
                                <AddMember
                                    data={dataMale}
                                    onAddMale={AddMaleHandler}
                                    numberMale={numnberMale}
                                    gender={0}
                                    allMember={allMember.filter((male) => male.gender == 0)}
                                />
                            )}
                        </Box>
                        <Paper elevation={3} sx={{ width: '100%' }}>
                            {dataMale.length > 0 && (
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Mã sinh viên</TableCell>
                                                <TableCell align="center">Tên sinh viên</TableCell>
                                                <TableCell align="center">Giới tính</TableCell>
                                                <TableCell align="center"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dataMale.map((data, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="center">{data.studentId}</TableCell>
                                                    <TableCell align="center">{data.name}</TableCell>
                                                    <TableCell align="center">
                                                        {data.gender == 0 ? 'Nam' : 'Nữ'}
                                                    </TableCell>
                                                    <TableCell>
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
                        <Box>
                            <Typography sx={{ m: 1 }}>
                                <strong>Số lượng nữ: </strong> {numberFemale}
                            </Typography>
                            {dataFemale.length < numberFemale && (
                                <AddMember
                                    data={dataFemale}
                                    onAddFemale={AddFemaleHandler}
                                    numberFemale={numberFemale}
                                    gender={1}
                                    allMember={allMember.filter((male) => male.gender == 1)}
                                />
                            )}
                        </Box>
                        <Paper elevation={3} sx={{ width: '100%' }}>
                            {dataFemale.length > 0 && (
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Mã sinh viên</TableCell>
                                                <TableCell align="center">Tên sinh viên</TableCell>
                                                <TableCell align="center">Giới tính</TableCell>
                                                <TableCell align="center"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dataFemale.map((data, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="center">{data.studentId}</TableCell>
                                                    <TableCell align="center">{data.name}</TableCell>
                                                    <TableCell align="center">
                                                        {data.gender == 0 ? 'Nam' : 'Nữ'}
                                                    </TableCell>
                                                    <TableCell>
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
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                <Button onClick={handleSubmit(handleRegister)} autoFocus>
                    {/* <Button onClick={handleSubmit(onSubmit)} autoFocus> */}
                    Đồng ý
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default RegisterPlayer;
