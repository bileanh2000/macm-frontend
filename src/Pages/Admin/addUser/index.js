import { useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import userApi from 'src/api/userApi';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import classNames from 'classnames/bind';
import styles from './AddUser.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function AddUser() {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    let snackBarStatus;

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        studentId: Yup.string()
            .required('Không được để trống trường này')
            .matches(/[A-Z]{2}\d{6}/, 'Nhập đúng định dạng'),

        dateOfBirth: Yup.string().required('Không được để trống trường này'),
        email: Yup.string()
            .required('Không được để trống trường này')
            .matches(/^[\w]+@(fpt.edu.vn)/, 'Nhập mail FPT'),
        gender: Yup.string().required('Không được để trống trường này'),
        phone: Yup.string()
            .required('Không được để trống trường này')
            .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
        roleId: Yup.string().required('Không được để trống trường này'),
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };
    const onSubmit = async (data) => {
        await userApi.createUser(data).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data.length != 0) {
                setOpenSnackBar(true);
                // setSnackBarStatus(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
            } else {
                console.log('huhu');
                setOpenSnackBar(true);
                // setSnackBarStatus(false);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus, res.message);
            }
        });

        console.log('form submit', data);
    };

    return (
        <Fragment>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleCloseSnackBar}
                    variant="filled"
                    severity={customAlert.severity || 'success'}
                    sx={{ width: '100%' }}
                >
                    {customAlert.message}
                </Alert>
            </Snackbar>

            <Typography variant="h4" component="div" sx={{ marginBottom: '16px' }}>
                Thêm thành viên mới
            </Typography>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1 },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <Grid container spacing={6} columns={12}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" component="div">
                            Thông tin cá nhân
                        </Typography>
                        <TextField
                            required
                            id="outlined-disabled"
                            label="Họ và tên"
                            fullWidth
                            {...register('name')}
                            error={errors.name ? true : false}
                            helperText={errors.name?.message}
                        />

                        <TextField
                            required
                            id="outlined-disabled"
                            label="Mã sinh viên"
                            fullWidth
                            {...register('studentId')}
                            error={errors.studentId ? true : false}
                            helperText={errors.studentId?.message}
                        />
                        <TextField
                            required
                            id="outlined-disabled"
                            label="Ngày sinh"
                            fullWidth
                            {...register('dateOfBirth')}
                            error={errors.dateOfBirth ? true : false}
                            helperText={errors.dateOfBirth?.message}
                        />

                        <TextField
                            required
                            select
                            fullWidth
                            defaultValue=""
                            label="Giới tính"
                            {...register('gender')}
                            error={errors.gender ? true : false}
                            helperText={errors.gender?.message}
                        >
                            <MenuItem value={true}>Nam</MenuItem>
                            <MenuItem value={false}>Nữ</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" component="div">
                            Liên hệ
                        </Typography>
                        <FormControl fullWidth>
                            <TextField
                                required
                                id="outlined-disabled"
                                label="Email"
                                {...register('email')}
                                error={errors.email ? true : false}
                                helperText={errors.email?.message}
                            />
                            <TextField
                                required
                                id="outlined-disabled"
                                label="Số điện thoại"
                                {...register('phone')}
                                error={errors.phone ? true : false}
                                helperText={errors.phone?.message}
                            />
                            <TextField
                                id="outlined-disabled"
                                label="Địa chỉ hiện tại"
                                {...register('currentAddress')}
                            />
                            <TextField
                                required
                                select
                                fullWidth
                                defaultValue=""
                                label="Chức vụ"
                                {...register('roleId')}
                                error={errors.roleId ? true : false}
                                helperText={errors.roleId?.message}
                                sx={{ width: '-webkit-fill-available' }}
                            >
                                <MenuItem value={10}>Ban truyền thông</MenuItem>
                                <MenuItem value={11}>Ban văn hóa</MenuItem>
                                <MenuItem value={12}>Ban chuyên môn</MenuItem>
                                <MenuItem value={13}>CTV Ban truyền thông</MenuItem>
                                <MenuItem value={14}>CTV Ban văn hóa</MenuItem>
                                <MenuItem value={15}>CTV Ban chuyên môn</MenuItem>
                            </TextField>
                        </FormControl>

                        {/* <FormControl fullWidth sx={{ margin: '8px', width: '-webkit-fill-available' }}> */}

                        {/* </FormControl> */}
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '8px', mt: '8px' }}>
                    <Button variant="contained" component="span" onClick={handleSubmit(onSubmit)}>
                        Lưu lại
                    </Button>
                    {/* <input type="submit" /> */}
                </Box>
            </Box>
        </Fragment>
    );

    // return userDetail.map((item) => {
    //
    // });
}

export default AddUser;
