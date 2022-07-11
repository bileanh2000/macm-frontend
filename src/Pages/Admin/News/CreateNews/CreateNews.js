import React, { useState } from 'react'
import { Button, Box, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import classNames from 'classnames/bind';

import styles from '../CreateNews/CreateNews.module.scss';
import adminNewsAPI from 'src/api/adminNewsAPI';

const cx = classNames.bind(styles)


function EditNews() {

    const history = useNavigate()
    const [check, setCheck] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Không được để trống trường này'),
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
        setIsSubmit(true)
        try {
            await adminNewsAPI.createNews({ ...data, isSendNotification: check })
            history(
                { pathname: '/admin/news' },
                {
                    state:
                    {
                        isSuccess: true,
                        message: "Thêm news thành công",
                        openSnackBar: true
                    }
                })
        } catch (error) {
            console.log(error);
            history(
                { pathname: '/admin/news' },
                {
                    state:
                    {
                        isSuccess: false,
                        message: "Thêm news thất bại",
                        openSnackBar: true
                    }
                })
        }
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h1>Tạo bài đăng mới</h1>
                    <span>

                    </span>
                </div>
                <div className={cx('content')}>
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
                            label="Tiêu đề"
                            {...register('title')}
                            error={errors.title ? true : false}
                            defaultValue=''
                            helperText={errors.title?.message}
                            required
                        />
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onClick={() => { setCheck(!check) }}
                                />}
                            label="Thông báo quan trọng (Đẩy thông báo về cho member)"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '8px', mt: '8px' }}>
                            <Button
                                variant="contained"
                                color="success"
                                style={{ marginRight: 20 }}
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmit}
                            >
                                Đăng
                            </Button>
                            <Button variant="contained" color="error">
                                <Link to="/admin/news">Hủy bỏ</Link>
                            </Button>
                        </Box>
                    </Box>
                </div>
            </div>
        </div>
    )
}

export default EditNews