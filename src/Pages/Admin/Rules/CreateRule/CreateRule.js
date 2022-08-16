import { Fragment, useState } from 'react';
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
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import adminRuleAPI from 'src/api/adminRuleAPI';

function CreateRule({ title, isOpen, handleClose, onSucess }) {
    let navigator = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    // const [rule, setRule] = useState('');

    const validationSchema = Yup.object().shape({
        description: Yup.string().trim().required('Không được để trống trường này'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const createRule = async (data) => {
        try {
            const response = await adminRuleAPI.create({
                description: data.description,
            });
            enqueueSnackbar(response.message, { variant: 'success' });
            onSucess && onSucess();
        } catch (error) {
            console.warn('Failed to create new rule');
        }
    };

    const handleCreateRule = async (data) => {
        createRule(data);
        handleClose && handleClose()
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
                    Thêm mới nội quy
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
                            defaultValue=""
                            helperText={errors.description?.message}
                            required
                        />
                        {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '8px', mt: '8px' }}>
                        <Button
                            variant="contained"
                            color="success"
                            style={{ marginRight: 20 }}
                            onClick={handleSubmit(handleCreateRule)}
                        >
                            Xác nhận
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ maxHeight: '50px', minHeight: '50px' }}
                            component={Link}
                            to={'/admin/rules'}
                        >
                            Hủy bỏ
                        </Button>
                    </Box> */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Hủy bỏ
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(handleCreateRule)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default CreateRule;
