import React from 'react'
import { Button, Box, TextField } from '@mui/material';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import classNames from 'classnames/bind';

import styles from '../EditNews/EditNews.module.scss';
import adminNewsAPI from 'src/api/adminNewsAPI';



const cx = classNames.bind(styles)


function EditNews() {

    const location = useLocation();
    const news = location.state?.news
    const history = useNavigate()

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
        try {
            await adminNewsAPI.editNews({ ...data, id: news.id })
            history(
                { pathname: '/admin/news' },
                {
                    state:
                    {
                        isSuccess: true,
                        message: "Chỉnh sửa news thành công",
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
                        message: "Chỉnh sửa news thất bại",
                        openSnackBar: true
                    }
                })
        }
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h1>Chỉnh sửa bài viết</h1>
                </div>
                <div className={cx('content')}>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '100%' },
                        }}
                        Validate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        {news && (
                            <div>
                                <TextField
                                    fullWidth
                                    id="outlined-error-helper-text fullWidth"
                                    label="Tiêu đề"
                                    {...register('title')}
                                    error={errors.title ? true : false}
                                    defaultValue={news.title}
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
                                    defaultValue={news.description}
                                    helperText={errors.description?.message}
                                    required />
                            </div>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '8px', mt: '8px' }}>
                            <Button
                                variant="contained"
                                color="success"
                                style={{ marginRight: 20 }}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Cập nhật
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