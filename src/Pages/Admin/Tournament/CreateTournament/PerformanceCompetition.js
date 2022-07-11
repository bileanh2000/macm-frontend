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
import { Add, Delete } from '@mui/icons-material';
import { Box } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

function PerformanceCompetition(props) {
    const [datas, setDatas] = useState(props.data);
    const [isChecked, setIsChecked] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        numberMale: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        numberFemale: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
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

    const handleAddCompetition = (data) => {
        if (data.numberMale == 0 && data.numberFemale == 0) {
            setFocus('numberMale', { shouldSelect: true });
            setError('numberMale', { message: 'Số lượng nam và nữ không được bằng 0' });
            setError('numberFemale', { message: 'Số lượng nam và nữ không được bằng 0' });
        } else {
            const newInput = { ...data, id: Math.random() };
            const newData = [...datas, newInput];
            setDatas(newData);
            props.onAddPerformanceCompetition(newData);
            setIsChecked(!isChecked);
            reset({
                name: '',
                numberMale: '',
                numberFemale: '',
            });
        }
    };
    const handleCancel = () => {
        setIsChecked(!isChecked);
        reset({
            name: '',
            numberMale: '',
            numberFemale: '',
        });
    };

    const handleDelete = (id) => {
        const newData = datas.filter((data) => {
            return data.id !== id;
        });
        setDatas(newData);
        props.onAddFightingCompetition(newData);
    };

    return (
        <Paper sx={{ width: '100%' }}>
            {props.data.length > 0 && (
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nội dung thi đấu</TableCell>
                                <TableCell align="center">Số lượng nữ</TableCell>
                                <TableCell align="center">Số lượng nam</TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {datas.map((data) => (
                                <TableRow key={data.id}>
                                    <TableCell>{data.name}</TableCell>
                                    <TableCell align="center">{data.numberFemale}</TableCell>
                                    <TableCell align="center">{data.numberMale}</TableCell>
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
                <Box sx={{ padding: 2, margin: 2 }}>
                    <TextField
                        id="outlined-error-helper-text fullWidth"
                        label="Tên nội dung"
                        {...register('name')}
                        error={errors.name ? true : false}
                        defaultValue=""
                        helperText={errors.name?.message}
                        required
                        fullWidth
                    />
                    <TextField
                        fullWidth
                        type="number"
                        id="outlined-basic"
                        label="Số lượng nam"
                        variant="outlined"
                        {...register('numberMale')}
                        error={errors.male ? true : false}
                        helperText={errors.numberMale?.message}
                    />
                    <TextField
                        type="number"
                        id="outlined-basic"
                        label="Số lượng nữ"
                        variant="outlined"
                        {...register('numberFemale')}
                        error={errors.female ? true : false}
                        helperText={errors.numberFemale?.message}
                        fullWidth
                    />
                    <Button variant="contained" color="success" onClick={handleSubmit(handleAddCompetition)}>
                        Thêm
                    </Button>
                    <Button variant="contained" color="warning" onClick={handleCancel}>
                        Hủy
                    </Button>
                </Box>
            </Collapse>
            <Collapse in={!isChecked}>
                <Fab color="primary" aria-label="add" onClick={() => setIsChecked(!isChecked)}>
                    <Add />
                </Fab>
            </Collapse>
        </Paper>
    );
}

export default PerformanceCompetition;
