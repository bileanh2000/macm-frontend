import { Box, Button, TextField } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from '../CreateRule/CreateRule.module.scss';
import { useState } from 'react';
import adminRuleAPI from 'src/api/adminRuleAPI';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const cx = classNames.bind(styles)

function EditRule() {

    const location = useLocation()
    const _rule = location.state?.rule;
    const history = useNavigate()

    const [rule, setRule] = useState(_rule.description)


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

    const onSubmit = async (data) => {
        try {
            console.log(data.description)
            if (rule != null) {
                await adminRuleAPI.update({
                    id: _rule.id,
                    description: data.description,
                });
            }
            history(
                { pathname: '/admin/rules' },
                {
                    state:
                    {
                        isSuccess: true,
                        message: "Chỉnh sửa rules thành công",
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
                <h1>Sửa nội quy của câu lạc bộ</h1>
            </div>
            <div style={{ width: '80%' }}>
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
                        <Button variant="contained" color="error">
                            <Link to="/admin/rules">Hủy bỏ</Link>
                        </Button>
                    </Box>
                </Box>
            </div>


        </div >
    );
}

export default EditRule;