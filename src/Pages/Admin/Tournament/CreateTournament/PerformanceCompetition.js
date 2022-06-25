import {
    Button,
    Collapse,
    Fab,
    Grid,
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
import { Add } from '@mui/icons-material';
import { Box } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

function PerformanceCompetition(props) {
    const [datas, setDatas] = useState(props.data);
    const [isChecked, setIsChecked] = useState(false);
    const [enterName, setEnterName] = useState('');
    const [enterMale, setEnterMale] = useState('');
    const [enterFemale, setEnterFemale] = useState('');
    let flag = false;

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        male: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        female: Yup.number()
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
        if (data.male == 0 && data.female == 0) {
            setFocus('male', { shouldSelect: true });
            setError('male', { message: 'Số lượng nam và nữ không được bằng 0' });
            setError('female', { message: 'Số lượng nam và nữ không được bằng 0' });
        } else {
            const newInput = { ...data, id: Math.random() };
            const newData = [...datas, newInput];
            setDatas(newData);
            props.onAddPerformanceCompetition(datas);
            setIsChecked(!isChecked);
            reset({
                name: '',
                male: '',
                female: '',
            });
        }
    };
    const handleCancel = () => {
        setIsChecked(!isChecked);
        reset({
            name: '',
            male: '',
            female: '',
        });
    };

    return (
        <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nội dung thi đấu</TableCell>
                            <TableCell align="center">Số lượng nữ</TableCell>
                            <TableCell align="center">Số lượng nam</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {datas.map((data) => (
                            <TableRow key={data.id}>
                                <TableCell>{data.name}</TableCell>
                                <TableCell align="center">{data.female}</TableCell>
                                <TableCell align="center">{data.male}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
                        {...register('male')}
                        error={errors.male ? true : false}
                        helperText={errors.male?.message}
                    />
                    <TextField
                        type="number"
                        id="outlined-basic"
                        label="Số lượng nữ"
                        variant="outlined"
                        {...register('female')}
                        error={errors.female ? true : false}
                        helperText={errors.female?.message}
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
