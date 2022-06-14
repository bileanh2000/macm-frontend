import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from '../CreateRule/CreateRule.module.scss';
import adminRuleAPI from 'src/api/adminRuleAPI';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const cx = classNames.bind(styles)

function CreateRule() {

    const history = useNavigate()
    const [rule, setRule] = useState('')

    const validationSchema = Yup.object().shape({
        description: Yup.string().required('Không được để trống trường này')
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });



    const handleCreateRule = async (data) => {
        try {
            if (rule != null) {
                await adminRuleAPI.create({
                    description: data.description,
                });
            }
            history(
                { pathname: '/admin/rules' },
                {
                    state:
                    {
                        isSuccess: true,
                        message: "Thêm rules thành công",
                        openSnackBar: true
                    }
                })
        } catch (error) {
            console.log("Error detected: " + error)
        }
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <h1>Thêm nội quy mới của câu lạc bộ</h1>
            </div>
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
                    defaultValue=''
                    helperText={errors.description?.message}
                    required
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '8px', mt: '8px' }}>
                    <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: 20 }}
                        onClick={handleSubmit(handleCreateRule)}
                    >
                        Xác nhận
                    </Button>
                    <Button variant="contained" color="error">
                        <Link to="/admin/rules">Hủy bỏ</Link>
                    </Button>
                </Box>
            </Box>
        </div >
    );
}

export default CreateRule;