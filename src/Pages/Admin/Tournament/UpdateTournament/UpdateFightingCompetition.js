import {
    Button,
    Collapse,
    Fab,
    Grid,
    IconButton,
    InputLabel,
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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Add, DataArray } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

function UpdateFightingCompetition(props) {
    const [datas, setDatas] = useState(props.data);
    const [isChecked, setIsChecked] = useState(false);
    const [gender, setGender] = useState(1);

    const [weightRangeMale, setWeightRangeMale] = useState([]);
    const [weightRangeFemale, setWeightRangeFemale] = useState([]);

    const handleChange = (event) => {
        console.log(event.target.value);
        setGender(event.target.value);
    };

    const getData = (datas) => {
        datas &&
            datas.map((data) => {
                let newWeightRange = [];
                let i;
                for (i = data.weightMin; i < data.weightMax; i = i + 0.5) {
                    newWeightRange.push(i);
                }
                if (data.gender === 0) {
                    setWeightRangeFemale(weightRangeFemale.concat(newWeightRange));
                } else {
                    setWeightRangeMale(weightRangeMale.concat(newWeightRange));
                }
            });
    };
    useEffect(() => {
        getData(props.data);
    }, []);

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

    const handleAddCompetition = (data) => {
        if (data.weightMax < data.weightMin) {
            setFocus('weightMax', { shouldSelect: true });
            setError('weightMax', { message: 'Hạng cân tối đa không được nhỏ hơn hạng cân tối thiểu' });
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
                console.log('female', weightRangeFemale, 'male', weightRangeMale);
                const newData = [...datas, { ...data, gender, id: Math.random() }];
                setDatas(newData);
                props.onAddFightingCompetition(newData);
                console.log(newData);
                setIsChecked(!isChecked);
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

    const handleCancel = () => {
        setIsChecked(!isChecked);
        reset({
            weightMin: '',
            weightMax: '',
        });
    };

    const handleDelete = (id) => {
        const dataDelete = datas.filter((data) => {
            return data.id === id;
        });

        let i;
        let newWeightRange = [];
        for (i = dataDelete[0].weightMin; i < dataDelete[0].weightMax; i = i + 0.5) {
            newWeightRange.push(i);
        }
        if (dataDelete[0].gender == 0) {
            const newRange = weightRangeFemale.filter((val) => !newWeightRange.includes(val));
            setWeightRangeFemale(newRange);
        } else {
            const newRange = weightRangeMale.filter((val) => !newWeightRange.includes(val));
            setWeightRangeMale(newRange);
        }

        const newData = datas.filter((data) => {
            return data.id !== id;
        });
        setDatas(newData);
        props.onAddFightingCompetition(newData);
    };

    const validationSchema = Yup.object().shape({
        weightMin: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(39, 'Vui lòng nhập giá trị lớn hơn 39 Kg')
            .max(85, 'Vui lòng nhập giá trị nhỏ hơn 85 Kg'),
        weightMax: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(39, 'Vui lòng nhập giá trị lớn hơn 39Kg')
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
        mode: 'onBlur',
    });

    return (
        <Paper sx={{ width: '100%' }}>
            {props.data.length > 0 && (
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Giới tính</TableCell>
                                <TableCell align="center">Hạng cân</TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {datas.map((data) => (
                                <TableRow key={data.id}>
                                    <TableCell>{data.gender == 1 ? 'Nam' : 'Nữ'}</TableCell>
                                    <TableCell>
                                        {data.weightMin} - {data.weightMax} Kg
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => {
                                                // handleOpenDialog();
                                                handleDelete(data.id);
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
            <Collapse in={isChecked}>
                <InputLabel id="demo-simple-select-label">Giới tính</InputLabel>
                <Select labelId="demo-simple-select-label" id="gender" value={gender} onChange={handleChange}>
                    <MenuItem value={1}>Nam</MenuItem>
                    <MenuItem value={0}>Nữ</MenuItem>
                </Select>
                <InputLabel>Hạng cân</InputLabel>
                <TextField
                    fullWidth
                    type="number"
                    id="outlined-basic"
                    label="Min"
                    variant="outlined"
                    {...register('weightMin')}
                    error={errors.weightMin ? true : false}
                    helperText={errors.weightMin?.message}
                />
                <TextField
                    type="number"
                    id="outlined-basic"
                    label="Max"
                    variant="outlined"
                    {...register('weightMax')}
                    error={errors.weightMax ? true : false}
                    helperText={errors.weightMax?.message}
                    fullWidth
                />
                <Button variant="contained" color="success" onClick={handleSubmit(handleAddCompetition)}>
                    Thêm
                </Button>
                <Button variant="contained" color="warning" onClick={handleCancel}>
                    Hủy
                </Button>
            </Collapse>

            <Collapse in={!isChecked}>
                <Fab color="primary" aria-label="add" onClick={() => setIsChecked(!isChecked)}>
                    <Add />
                </Fab>
            </Collapse>
        </Paper>
    );
}
export default UpdateFightingCompetition;
