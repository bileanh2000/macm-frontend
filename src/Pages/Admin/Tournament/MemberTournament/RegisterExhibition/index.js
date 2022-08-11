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
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import adminTournament from 'src/api/adminTournamentAPI';
import AddMember from './AddMember';
import userApi from 'src/api/userApi';
import { Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import LoadingProgress from 'src/Components/LoadingProgress';

function RegisterExhibition({ isOpen, handleClose, onSuccess, onChangeData, exhibitionId }) {
    let { tournamentId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [exhibitionType, setExhibitionType] = useState(exhibitionId);
    const [numberMale, setNumberMale] = useState();
    const [numberFemale, setNumberFemale] = useState();
    const [listExhibitionType, setListExhibitionType] = useState([]);
    const [dataMale, setDataMale] = useState([]);
    const [dataFemale, setDateFemale] = useState([]);

    const [allMember, setAllMember] = useState([]);

    const AddMaleHandler = (data) => {
        setDataMale(data);
    };

    const AddFemaleHandler = (data) => {
        setDateFemale(data);
    };

    const validationSchema = Yup.object().shape({
        teamName: Yup.string().required('Không được để trống trường này'),
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
        setDataMale([]);
        setDateFemale([]);
    };
    const getAllMember = async () => {
        try {
            const response = await userApi.getAllMember();
            setAllMember(response.data);
        } catch (error) {
            console.log('khong the lay data');
        }
    };

    const fetchExhibitionType = async (tournamentId) => {
        try {
            const response = await adminTournament.getAllExhibitionType(tournamentId);
            setListExhibitionType(response.data);
            // setExhibitionType(response.data[0].id);
            setNumberMale(response.data[0].numberMale);
            setNumberFemale(response.data[0].numberFemale);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    const registerTeam = async (exhibitionType, params) => {
        try {
            const response = await adminTournament.registerTeam(exhibitionType, params);
            let variant = response.message.includes('thành công') ? 'success' : 'error';
            enqueueSnackbar(response.message, { variant });
            onChangeData && onChangeData();
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar(error, { variant });
        }
    };

    const handleCloseDialog = () => {
        setDataMale([]);
        setDateFemale([]);
        reset({
            teamName: '',
        });
        handleClose && handleClose();
    };

    const handleRegister = (data) => {
        const teamMember = [...dataMale, ...dataFemale];
        const listStudentId = teamMember.map((student) => student.studentId);

        const params = { listStudentId, teamName: data.teamName, exhibitionTypeId: exhibitionType };
        registerTeam(exhibitionType, params);
        onSuccess && onSuccess();
        handleCloseDialog();
    };

    const handleDelete = (data) => {
        let newData;
        console.log(data, dataMale, dataFemale);
        if (!data.gender) {
            newData = dataMale.filter((d) => {
                return d.studentId !== data.studentId;
            });
            console.log(newData);
            setDataMale(newData);
        } else {
            newData = dataFemale.filter((d) => {
                return d.studentId !== data.studentId;
            });
            setDateFemale(newData);
        }
    };

    useEffect(() => {
        fetchExhibitionType(tournamentId);
    }, [tournamentId]);

    useEffect(() => {
        getAllMember();
    }, []);

    useEffect(() => {
        setExhibitionType(exhibitionId);
    }, [exhibitionId]);

    return (
        <Fragment>
            {allMember.length > 0 ? (
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
                        <Box sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', m: 2 }}>
                            <Box
                                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}
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
                            </Box>
                        </Box>

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
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography sx={{ m: 1 }}>
                                            <strong>Số lượng nam: </strong> {numberMale}
                                        </Typography>
                                        {dataMale.length < numberMale && (
                                            <AddMember
                                                data={dataMale}
                                                onAddMale={AddMaleHandler}
                                                numberMale={numberMale}
                                                gender={0}
                                                allMember={allMember.filter((male) => male.gender === true)}
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
                                                                <TableCell align="center">{data.studentName}</TableCell>
                                                                <TableCell align="center">
                                                                    {data.gender ? 'Nam' : 'Nữ'}
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
                                </Grid>
                                <Grid item xs={12} md={6}>
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
                                                allMember={allMember.filter((male) => male.gender === false)}
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
                                                                <TableCell align="center">{data.studentName}</TableCell>
                                                                <TableCell align="center">
                                                                    {data.gender ? 'Nam' : 'Nữ'}
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
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
                        <Button onClick={handleSubmit(handleRegister)} autoFocus>
                            Đồng ý
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <LoadingProgress />
            )}
        </Fragment>
    );
}

export default RegisterExhibition;
