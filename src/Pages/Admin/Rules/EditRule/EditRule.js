import { Box, Button, Container, Divider, TextField, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

import adminRuleAPI from 'src/api/adminRuleAPI';

function EditRule() {
    const location = useLocation();
    const _rule = location.state?.rule;
    const navigator = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [rule, setRule] = useState(_rule.description);

    const validationSchema = Yup.object().shape({
        description: Yup.string().required('Không được để trống trường này'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const updateRule = async (data) => {
        try {
            const response = await adminRuleAPI.update({
                id: _rule.id,
                description: data.description,
            });
            enqueueSnackbar(response.message, { variant: 'success' });
        } catch (error) {}
    };

    const onSubmit = async (data) => {
        updateRule(data);

        navigator({ pathname: '/admin/rules' });
    };

    return (
        <Box sx={{ m: 1, p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500 }}>
                    Chỉnh sửa nội quy
                </Typography>
            </Box>
            <Divider />
            <Container>
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
                        defaultValue={rule}
                        helperText={errors.description?.message}
                        required
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '8px', mt: '8px' }}>
                        <Button
                            variant="contained"
                            color="success"
                            style={{ marginRight: 20 }}
                            onClick={handleSubmit(onSubmit)}
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
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default EditRule;
