import {
    Button,
    Checkbox,
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
import { Add, Delete, Edit } from '@mui/icons-material';
import { Box } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EditExhibition from './EditExhibition';

function PerformanceCompetition(props) {
    const [datas, setDatas] = useState(props.data);
    const [isChecked, setIsChecked] = useState(false);
    const [dataEdit, setDataEdit] = useState();
    const [isEdit, setIsEdit] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required('Không được để trống trường này'),
        numberMale: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn hoặc bằng 0')
            .max(1000, 'Vui lòng nhập giá trị phù hợp thực tế'),
        numberFemale: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn hoặc bằng 0')
            .max(1000, 'Vui lòng nhập giá trị phù hợp thực tế'),
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

    const handleEditCompetition = (data) => {
        const newData = datas.map((d) => (d.id == data.id ? data : d));
        setDatas(newData);
        props.onAddPerformanceCompetition(newData);
        handleCancel();
    };

    const handleSelectExhibition = (data) => {
        props.onAddPerformanceCompetition(datas.map((d) => (d.id === data.id ? { ...d, selected: !d.selected } : d)));
        setDatas(datas.map((d) => (d.id === data.id ? { ...d, selected: !d.selected } : d)));
    };

    const handleAddCompetition = (data) => {
        if (props.data.findIndex((row) => row.name.toLowerCase() == data.name.toLowerCase()) >= 0) {
            setError('name', {
                message: `Tên thể thức ${data.name} này đã tồn tại, vui lòng chọn tên khác`,
            });
            return;
        }
        if (data.numberMale == 0 && data.numberFemale == 0) {
            setFocus('numberMale', { shouldSelect: true });
            setError('numberMale', { message: 'Số lượng nam và nữ không được bằng 0' });
            setError('numberFemale', { message: 'Số lượng nam và nữ không được bằng 0' });
        } else {
            const newInput = { ...data, id: Math.random(), selected: true };
            const newData = [...datas, newInput];
            setDatas(newData);
            props.onAddPerformanceCompetition(newData);
            setIsChecked(!isChecked);
            reset({
                name: '',
                numberMale: 0,
                numberFemale: 0,
            });
        }
    };
    const handleCancel = () => {
        setIsChecked(!isChecked);
        isEdit && setIsEdit(false);
        reset({
            name: '',
            numberMale: 0,
            numberFemale: 0,
        });
    };

    const handleEdit = (data) => {
        // const newData = datas.filter((data) => {
        //     return data.id !== id;
        // });
        console.log(data);
        setDataEdit(data);
        setIsEdit(true);
        setIsChecked(!isChecked);
        // setDatas(newData);
        // props.onAddPerformanceCompetition(newData);
    };

    const handleDelete = (id) => {
        const newData = datas.filter((data) => {
            return data.id !== id;
        });
        setDatas(newData);
        props.onAddPerformanceCompetition(newData);
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ width: '100%' }}>
                <TableContainer sx={{ maxHeight: 390, m: 1, p: 1, mb: 2 }}>
                    {props.data.length > 0 && (
                        <>
                            <Table stickyHeader aria-label="sticky table" size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            SL: {datas.filter((data) => data.selected).length}
                                        </TableCell>
                                        <TableCell align="center">Nội dung thi đấu</TableCell>
                                        <TableCell align="center">SL nam</TableCell>
                                        <TableCell align="center">SL nữ</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {datas.map((data) => (
                                        <TableRow key={data.id}>
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={data.selected}
                                                    onChange={() => handleSelectExhibition(data)}
                                                />
                                            </TableCell>
                                            <TableCell>{data.name}</TableCell>
                                            <TableCell align="center">{data.numberMale}</TableCell>
                                            <TableCell align="center">{data.numberFemale}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        // handleOpenDialog();
                                                        handleEdit(data);
                                                    }}
                                                    disabled={isEdit || isChecked}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </TableCell>
                                            {/* <TableCell>
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => {
                                                    // handleOpenDialog();
                                                    handleDelete(data.id);
                                                }}
                                                disabled={isEdit}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Paper elevation={3}>
                                <Collapse in={isChecked}>
                                    {!isEdit ? (
                                        <Grid container spacing={2} sx={{ p: 1 }}>
                                            <Grid item xs={12}>
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
                                            </Grid>
                                            <Grid item xs={12} container spacing={2}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        id="outlined-basic"
                                                        label="Số lượng nam mỗi đội"
                                                        variant="outlined"
                                                        defaultValue={0}
                                                        {...register('numberMale')}
                                                        error={errors.numberMale ? true : false}
                                                        helperText={errors.numberMale?.message}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        type="number"
                                                        id="outlined-basic"
                                                        label="Số lượng nữ mỗi đội"
                                                        variant="outlined"
                                                        defaultValue={0}
                                                        {...register('numberFemale')}
                                                        error={errors.numberMale ? true : false}
                                                        helperText={errors.numberFemale?.message}
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handleSubmit(handleAddCompetition)}
                                                    sx={{ m: 1 }}
                                                >
                                                    Thêm
                                                </Button>
                                                <Button variant="contained" color="warning" onClick={handleCancel}>
                                                    Hủy
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        dataEdit && (
                                            <EditExhibition
                                                dataEdit={dataEdit}
                                                onEdit={handleEditCompetition}
                                                onCancel={handleCancel}
                                            />
                                        )
                                    )}
                                </Collapse>
                            </Paper>
                            <Collapse in={!isChecked}>
                                <Fab
                                    color="primary"
                                    variant="extended"
                                    aria-label="add"
                                    onClick={() => setIsChecked(!isChecked)}
                                    size="small"
                                    sx={{ mt: 1 }}
                                >
                                    <Add />
                                    Thêm nội dung biểu diễn
                                </Fab>
                            </Collapse>
                        </>
                    )}
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default PerformanceCompetition;
