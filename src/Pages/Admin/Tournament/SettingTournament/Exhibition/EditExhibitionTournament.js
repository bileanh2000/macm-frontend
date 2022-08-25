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

function EditExhibitionTournament({ isOpen, handleClose, onSucess, datas, exhibition }) {
    const { enqueueSnackbar } = useSnackbar();

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

    const updateExhibitionTypeSample = async (data) => {
        try {
            const response = await adminTournament.updateExhibitionTypeSample(data);
            enqueueSnackbar(response.message, { variant: 'success' });
            onSucess && onSucess();
        } catch (error) {
            console.warn('Failed to create new rule');
        }
    };

    const handleEditExhibiton = (data) => {
        if (datas.findIndex((d) => d.name.toLowerCase().includes(data.name.toLowerCase())) >= 0) {
            setError('name', {
                message: `Thể thức ${data.name} này đã tồn tại, vui lòng chọn thể thức khác`,
            });
            return;
        }
        if (data.numberMale == 0 && data.numberFemale == 0) {
            setFocus('numberMale', { shouldSelect: true });
            setError('numberMale', { message: 'Số lượng nam và nữ không được bằng 0' });
            setError('numberFemale', { message: 'Số lượng nam và nữ không được bằng 0' });
        } else {
            const newRole = { ...exhibition, numberMale: data.numberMale, numberFemale: data.numberFemale };
            updateExhibitionTypeSample(newRole);
            onSucess && onSucess();
        }
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
                    Thêm mới thể thức thi đấu
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
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-error-helper-text fullWidth"
                                label="Tên nội dung"
                                {...register('name')}
                                defaultValue={exhibition.name}
                                error={errors.name ? true : false}
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
                                    defaultValue={exhibition.numberMale}
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
                                    defaultValue={exhibition.numberFemale}
                                    {...register('numberFemale')}
                                    error={errors.numberFemale ? true : false}
                                    helperText={errors.numberFemale?.message}
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
                    <Button variant="contained" onClick={handleSubmit(handleEditExhibiton)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default EditExhibitionTournament;
