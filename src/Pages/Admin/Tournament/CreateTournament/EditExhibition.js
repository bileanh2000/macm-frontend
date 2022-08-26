import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, MenuItem, Select, TextField } from '@mui/material';

function EditExhibition({ dataEdit, onEdit, onCancel }) {
    const validationSchema = Yup.object().shape({
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

    const handleEditExhibiton = (data) => {
        if (data.numberMale == 0 && data.numberFemale == 0) {
            setFocus('numberMale', { shouldSelect: true });
            setError('numberMale', { message: 'Số lượng nam và nữ không được bằng 0' });
            setError('numberFemale', { message: 'Số lượng nam và nữ không được bằng 0' });
        } else {
            const newRole = { ...dataEdit, numberMale: data.numberMale, numberFemale: data.numberFemale };
            reset({
                numberMale: 0,
                numberFemale: 0,
            });
            onEdit && onEdit(newRole);
        }
    };

    return (
        <Grid container spacing={2} sx={{ p: 1 }}>
            <Grid item xs={12}>
                <TextField
                    id="outlined-error-helper-text fullWidth"
                    label="Tên nội dung"
                    {...register('name')}
                    defaultValue={dataEdit.name}
                    error={errors.name ? true : false}
                    helperText={errors.name?.message}
                    required
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
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
                        defaultValue={dataEdit.numberMale}
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
                        defaultValue={dataEdit.numberFemale}
                        {...register('numberFemale')}
                        error={errors.numberMale ? true : false}
                        helperText={errors.numberFemale?.message}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="success" onClick={handleSubmit(handleEditExhibiton)} sx={{ m: 1 }}>
                    Xác nhận
                </Button>
                <Button variant="contained" color="warning" onClick={() => onCancel && onCancel()}>
                    Hủy
                </Button>
            </Grid>
        </Grid>
    );
}

export default EditExhibition;
