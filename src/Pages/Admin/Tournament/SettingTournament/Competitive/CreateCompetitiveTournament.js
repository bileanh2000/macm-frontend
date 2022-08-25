import { Fragment, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Select,
    MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import adminTournament from 'src/api/adminTournamentAPI';

function CreateCompetitiveTournament({ isOpen, handleClose, onSucess, data }) {
    const [datas, setDatas] = useState(data);
    const { enqueueSnackbar } = useSnackbar();
    const [gender, setGender] = useState(1);
    const [weightRangeMale, setWeightRangeMale] = useState([]);
    const [weightRangeFemale, setWeightRangeFemale] = useState([]);

    const handleChange = (event) => {
        setGender(event.target.value);
    };

    const getData = (datas) => {
        let weightFemale = [];
        let weightMale = [];
        datas &&
            datas.map((data) => {
                let newWeightRange = [];
                let i;
                for (i = data.weightMin; i < data.weightMax; i = i + 0.5) {
                    newWeightRange.push(i);
                }
                if (!data.gender) {
                    weightFemale = weightFemale.concat(newWeightRange);
                } else {
                    weightMale = weightMale.concat(newWeightRange);
                }
            });
        // console.log(weightFemale, weightMale);
        setWeightRangeFemale(weightFemale);
        setWeightRangeMale(weightMale);
    };

    useEffect(() => {
        getData(data);
    }, [data]);

    function checkContain(arr1, arr2) {
        return arr1.some((item) => arr2.includes(item));
    }

    const checkWeight = (gender, min, max) => {
        let i;
        let newWeightRange = [];
        for (i = min; i < max; i = i + 0.5) {
            newWeightRange.push(i);
        }
        if (gender === 0) {
            if (!checkContain(weightRangeFemale, newWeightRange)) {
                setWeightRangeFemale(weightRangeFemale.concat(newWeightRange));
                return true;
            } else {
                return false;
            }
        } else {
            if (!checkContain(weightRangeMale, newWeightRange)) {
                const newWeight = weightRangeMale.concat(newWeightRange);
                setWeightRangeMale(newWeight);
                return true;
            } else {
                return false;
            }
        }
    };

    const addCompetitiveTypeSample = async (data) => {
        try {
            const response = await adminTournament.addCompetitiveTypeSample(data);
            enqueueSnackbar(response.message, { variant: 'success' });
            onSucess && onSucess();
        } catch (error) {
            console.warn('Failed to create new rule');
        }
    };

    const handleAddCompetition = (data) => {
        if (data.weightMax < data.weightMin) {
            setFocus('weightMax', { shouldSelect: true });
            setError('weightMax', { message: 'Hạng cân tối đa không được nhỏ hơn hạng cân tối thiểu' });
        } else if (data.weightMax == data.weightMin) {
            setFocus('weightMax', { shouldSelect: true });
            setError('weightMax', {
                message: 'Hạng cân tối thiểu và tối đa không được trùng nhau',
            });
        } else if (!data.weightMax.toString().match(/^(\d+(\.(0|5){0,1})?)$/)) {
            setFocus('weightMax', { shouldSelect: true });
            setError('weightMax', {
                message: 'Vui lòng nhập đúng định dạng hạng cân(chữ số sau dấu phẩy là 5), VD: 42 hoặc 42.5',
            });
        } else if (!data.weightMin.toString().match(/^(\d+(\.(0|5){0,1})?)$/)) {
            setFocus('weightMin', { shouldSelect: true });
            setError('weightMin', {
                message: 'Vui lòng nhập đúng định dạng hạng cân(chữ số sau dấu phẩy là 5), VD: 42 hoặc 42.5',
            });
        } else {
            if (checkWeight(gender, data.weightMin, data.weightMax)) {
                const newData = {
                    ...data,
                    gender: gender == 1 ? true : false,
                    id: Math.floor(Math.random() * 1000) + 100,
                };
                addCompetitiveTypeSample(newData);
                setDatas(newData);
                reset({
                    weightMin: '',
                    weightMax: '',
                });
            } else {
                setFocus('weightMin', { shouldSelect: true });
                setError('weightMin', {
                    message: 'Khoảng cân bạn nhập đã tồn tại, vui lòng nhập khoảng cân khác',
                });
                setError('weightMax', {
                    message: 'Khoảng cân bạn nhập đã tồn tại, vui lòng nhập khoảng cân khác',
                });
            }
        }
    };

    const validationSchema = Yup.object().shape({
        weightMin: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(40, 'Vui lòng nhập giá trị lớn hơn 39 Kg')
            .max(85, 'Vui lòng nhập giá trị nhỏ hơn 85 Kg'),
        weightMax: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(40, 'Vui lòng nhập giá trị lớn hơn 39Kg')
            .max(85, 'Vui lòng nhập giá trị nhỏ hơn 85 Kg'),
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
        mode: 'onChange',
    });
    const CreateRoleTournament = async (data) => {
        try {
            const response = await adminTournament.addNewRoleTournament(data.roleName);
            enqueueSnackbar(response.message, { variant: 'success' });
            onSucess && onSucess();
        } catch (error) {
            console.warn('Failed to create new rule');
        }
    };

    const handleCreateRoleTournament = async (data) => {
        CreateRoleTournament(data);
        handleClose && handleClose();
    };
    return (
        <Fragment>
            <Dialog
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    Thêm mới hạng cân thi đấu
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '100%' },
                        }}
                        Validate
                        autoComplete="off"
                    >
                        <Grid container spacing={2} sx={{ p: 1 }}>
                            <Grid item xs={2}>
                                {/* <InputLabel id="demo-simple-select-label">Giới tính</InputLabel> */}
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="gender"
                                    value={gender}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>Nam</MenuItem>
                                    <MenuItem value={0}>Nữ</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={5}>
                                {/* <InputLabel>Hạng cân</InputLabel> */}
                                <TextField
                                    fullWidth
                                    type="number"
                                    id="outlined-basic"
                                    label="Hạng cân tối thiểu"
                                    variant="outlined"
                                    {...register('weightMin')}
                                    error={errors.weightMin ? true : false}
                                    helperText={errors.weightMin?.message}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    type="number"
                                    id="outlined-basic"
                                    label="Hạng cân tối đa"
                                    variant="outlined"
                                    {...register('weightMax')}
                                    error={errors.weightMax ? true : false}
                                    helperText={errors.weightMax?.message}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(handleAddCompetition)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default CreateCompetitiveTournament;
