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
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import moment from 'moment';

function AddUser() {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [listStudentId, setListStudentId] = useState();
    const [listEmail, setListEmailId] = useState();
    const [listPhone, setListPhone] = useState();
    let snackBarStatus;

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await userApi.getAllMemberAndAdmin();
                console.log(response);
                let listStudentId = response.data.map((i) => i.studentId);
                let listEmail = response.data.map((i) => i.email);
                let listPhone = response.data.map((i) => i.phone);

                setListStudentId(listStudentId);
                setListEmailId(listEmail);
                setListPhone(listPhone);
                console.log(listStudentId, listEmail, listPhone);
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        fetchUserList();
    }, []);

    function uniqueStudentId(message) {
        return this.test('uniqueStudentId', message, function (value) {
            let filterStudentId = listStudentId.filter((i) => i === value);
            const { path, createError } = this;

            if (filterStudentId.length === 1) {
                return createError({ path, message: message ?? `MSV "${value}" đã tồn tại` });
            }
            if (!value) {
                return createError({ path, message: 'Không được để trống trường này' });
            }

            if (!value.match(/[A-Z]{2}\d{6}/)) {
                return createError({
                    path,
                    message: 'Vui lòng nhập đúng định dạng',
                });
            }

            return true;
        });
    }
    function uniqueEmail(message) {
        return this.test('uniqueEmail', message, function (value) {
            let filterEmail = listEmail.filter((i) => i === value);
            const { path, createError } = this;

            if (filterEmail.length === 1) {
                return createError({ path, message: message ?? `Email "${value}" đã tồn tại` });
            }
            if (!value) {
                return createError({ path, message: 'Không được để trống trường này' });
            }

            if (!value.match(/^[\w]+@(fpt.edu.vn)/)) {
                return createError({
                    path,
                    message: 'Vui lòng nhập email FPT',
                });
            }

            return true;
        });
    }
    function uniquePhone(message) {
        return this.test('uniquePhone', message, function (value) {
            let filterPhone = listPhone.filter((i) => i === value.toString());
            const { path, createError } = this;

            if (filterPhone.length === 1) {
                return createError({ path, message: message ?? `Số điện thoại "${value}" đã tồn tại` });
            }
            if (!value) {
                return createError({ path, message: 'Không được để trống trường này' });
            }

            if (!value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)) {
                return createError({
                    path,
                    message: 'Vui lòng nhập đúng số điện thoại',
                });
            }

            return true;
        });
    }
    Yup.addMethod(Yup.mixed, 'uniqueStudentId', uniqueStudentId);
    Yup.addMethod(Yup.mixed, 'uniqueEmail', uniqueEmail);
    Yup.addMethod(Yup.mixed, 'uniquePhone', uniquePhone);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        studentId: Yup.mixed().uniqueStudentId(),
        dateOfBirth: Yup.string().required('Không được để trống trường này'),
        email: Yup.mixed().uniqueEmail(),
        gender: Yup.string().required('Không được để trống trường này'),
        phone: Yup.mixed().uniquePhone(),
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
        const dataFormat = {
            currentAddress: 'Dom D',
            dateOfBirth: moment(new Date(data.dateOfBirth)).format('yyyy-MM-DD'),
            email: data.email,
            gender: data.gender,
            name: data.name,
            phone: data.phone,
            roleId: data.roleId,
            studentId: data.studentId,
        };
        await userApi.createUser(dataFormat).then((res) => {
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
                        {/* <TextField
                            required
                            id="outlined-disabled"
                            label="Ngày sinh"
                            fullWidth
                            {...register('dateOfBirth')}
                            error={errors.dateOfBirth ? true : false}
                            helperText={errors.dateOfBirth?.message}
                        /> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                            <Controller
                                required
                                name="dateOfBirth"
                                control={control}
                                defaultValue={null}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <DatePicker
                                        label="Ngày sinh"
                                        // views={['year', 'month', 'day']}
                                        disableFuture
                                        // maxDate={new Date('2022-06-12')}
                                        views={['year', 'month', 'day']}
                                        ampm={false}
                                        value={value}
                                        onChange={(value) => onChange(value)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                id="outlined-disabled"
                                                error={invalid}
                                                helperText={invalid ? error.message : null}
                                                // id="startDate"
                                                variant="outlined"
                                                margin="dense"
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                        </LocalizationProvider>

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
