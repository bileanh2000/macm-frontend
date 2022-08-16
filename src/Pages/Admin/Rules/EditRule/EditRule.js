import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useState } from 'react';
import { useSnackbar } from 'notistack';

import adminRuleAPI from 'src/api/adminRuleAPI';

function EditRule({ rule, isOpen, handleClose, onSucess }) {
    const { enqueueSnackbar } = useSnackbar();

    // const [rule, setRule] = useState(_rule.description);

    const validationSchema = Yup.object().shape({
        description: Yup.string().trim().required('Không được để trống trường này'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const updateRule = async (data) => {
        try {
            const response = await adminRuleAPI.update({
                id: rule.id,
                description: data.description,
            });
            onSucess && onSucess();
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {}
    };

    const onSubmit = async (data) => {
        updateRule(data);
        handleClose && handleClose();
    };

    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth="md"
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    Chỉnh sửa nội quy
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
                        <TextField
                            fullWidth
                            id="outlined-error-helper-text fullWidth"
                            label="Nội dung"
                            multiline
                            rows={6}
                            {...register('description')}
                            error={errors.description ? true : false}
                            defaultValue={rule.description}
                            helperText={errors.description?.message}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Hủy bỏ
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default EditRule;
