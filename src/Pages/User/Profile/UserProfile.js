import { Link, Navigate, useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import userApi from 'src/api/userApi';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { Button, Divider, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { EditRounded, QrCode2 } from '@mui/icons-material';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { useSnackbar } from 'notistack';
import moment from 'moment';

import QRCode from './QRCode';
import ForbiddenPage from 'src/Pages/ForbiddenPage';

function UserProfile() {
    const min = '1970-12-31';
    const max = moment(new Date()).format('yyyy-MM-DD');

    let { userId } = useParams();
    const [userDetail, setUserDetail] = useState([]);
    const [openQRDialog, setOpenQRDialog] = useState(false);
    const [QRUrl, setQRUrl] = useState('');
    const [listStudentId, setListStudentId] = useState();
    const [listEmail, setListEmailId] = useState();
    const [listPhone, setListPhone] = useState();
    const [isEditable, setIsEditable] = useState(false);
    const [isRender, setIsRender] = useState(true);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const user = JSON.parse(localStorage.getItem('currentUser'));

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
                console.log(listPhone);
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        fetchUserList();
    }, []);

    function uniquePhone(message) {
        if (listPhone) {
            return this.test('uniquePhone', message, function (value) {
                if (value !== undefined) {
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
                }

                return true;
            });
        }
    }
    //Yup.addMethod(Yup.mixed, 'uniqueStudentId', uniqueStudentId);
    //Yup.addMethod(Yup.mixed, 'uniqueEmail', uniqueEmail);
    Yup.addMethod(Yup.mixed, 'uniquePhone', uniquePhone);
    const validationSchema = Yup.object().shape({
        //name: Yup.string().required('Không được để trống trường này'),
        //studentId: Yup.mixed().uniqueStudentId(),
        dateOfBirth: Yup.date()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập đúng định dạng ngày')
            .min(min, 'Ngày sinh bạn nhập quá nhỏ, không thực tế. Vui lòng nhập lại')
            .max(max, 'Ngày sinh bạn nhập không được vượt quá hiện tại. Vui lòng nhập lại'),
        //email: Yup.mixed().uniqueEmail(),
        //gender: Yup.string().required('Không được để trống trường này'),
        phone: Yup.mixed().uniquePhone(),
        currentAddress: Yup.string().trim(),
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const fetchUserQR = async (userDetail) => {
        try {
            const response = await userApi.generateQrCode(userDetail);
            setQRUrl(response.data[0]);
        } catch (error) {
            console.log('Failed to fetch user QR code: ', error);
        }
    };

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const params = userId;
                console.log(params);
                const response = await userApi.getUserbyId(params);
                console.log(response);
                setUserDetail(response.data);
                setIsRender(false);
            } catch (error) {
                console.log('Failed to fetch user detail: ', error);
            }
        };

        isRender && fetchUserDetail();
    }, [userId, userDetail, isRender]);

    useEffect(() => {
        console.log(userDetail[0]);
        fetchUserQR(userDetail[0]);
    }, [userDetail]);

    const handleDialogOpen = () => {
        setOpenQRDialog(true);
    };

    const onSubmit = async (data) => {
        console.log('day la data truoc khi format', data);
        // const roleId = roleData.filter((item) => item.name === data.roleName);
        data = {
            ...data,
            dateOfBirth: moment(data.dateOfBirth).format('yyyy-MM-DD'),
            studentId: userId,
            roleId: userDetail[0].role.id,
            roleName: userDetail[0].role.name,
            generation: userDetail[0].generation,
            gender: userDetail[0].gender,
            email: userDetail[0].email,
            name: userDetail[0].name,
            currentAddress: data.currentAddress,

            ...(data.phone === undefined ? { phone: userDetail[0].phone } : { phone: data.phone }),
            ...(data.currentAddress === undefined
                ? { currentAddress: userDetail[0].currentAddress }
                : { currentAddress: data.currentAddress }),
        };
        console.log('day la data sau khi format', data);

        await userApi.updateUser(data).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data.length !== 0) {
                enqueueSnackbar(res.message, { variant: 'success' });
                setIsEditable(false);
                setIsRender(true);
            } else {
                console.log('huhu');
            }
        });
        console.log('form submit', data);
    };

    if (userId !== user.studentId) {
        return <Navigate to="*" />;
    }

    return (
        userDetail &&
        userDetail.map((item) => {
            return (
                <Fragment key={item.id}>
                    <Box sx={{ display: 'none' }}>
                        {listPhone && listPhone.splice(listPhone.indexOf(item.phone), 1)}
                        {listEmail && listEmail.splice(listEmail.indexOf(item.email), 1)}
                        {listStudentId && listStudentId.splice(listStudentId.indexOf(item.studentId), 1)}
                    </Box>
                    <QRCode
                        title="Mã QR của bạn"
                        params={{ userDetail, QRUrl }}
                        isOpen={openQRDialog}
                        handleClose={() => {
                            setOpenQRDialog(false);
                        }}
                        onSucess={(newItem) => {
                            setOpenQRDialog(false);
                        }}
                    />
                    <Box component="div" sx={{ margin: 'auto', marginBottom: 12, position: 'relative', width: '95%' }}>
                        <Box component="div">
                            <img src="https://source.unsplash.com/random" alt="" width="100%" height="146px" />
                            <Avatar
                                alt="anh dai dien"
                                srcSet={user.image}
                                sx={{ width: 180, height: 180, position: 'absolute', top: 55, left: 16 }}
                            />
                        </Box>
                        <Box>
                            {!isEditable && (
                                <Tooltip title="Chỉnh sửa" placement="left-start">
                                    <IconButton
                                        aria-label="edit"
                                        // size=""
                                        sx={{ ml: 1, mt: 1, float: 'right' }}
                                        onClick={() => {
                                            setIsEditable(true);
                                        }}
                                    >
                                        <EditRounded fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Button
                                variant="outlined"
                                startIcon={<QrCode2 />}
                                sx={{ ml: 1, mt: 1, float: 'right' }}
                                onClick={handleDialogOpen}
                            >
                                Mã QR của bạn
                            </Button>
                        </Box>
                    </Box>

                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1 },
                            width: '90%',
                            margin: 'auto',
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        {isEditable && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    sx={{ marginBottom: '16px', fontWeight: '700' }}
                                >
                                    Chỉnh sửa thông tin
                                </Typography>
                                <Box>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setIsEditable(false);
                                            setIsRender(true);
                                        }}
                                        sx={{ mr: 2 }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button variant="contained" onClick={handleSubmit(onSubmit)} autoFocus>
                                        Xác nhận
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        <Grid container spacing={6} columns={12}>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={2} sx={{ p: 1, pr: 2 }}>
                                    <Typography variant="h6" component="div">
                                        Thông tin cá nhân
                                    </Typography>
                                    <Divider />
                                    <TextField
                                        id="outlined-disabled"
                                        label="Họ và Tên"
                                        defaultValue={item.name}
                                        // {...(!isEditable ? { disabled: true } : {})}
                                        // disabled={true}
                                        fullWidth
                                        disabled={true}
                                        {...register('name')}
                                    />
                                    <TextField
                                        disabled={true}
                                        id="outlined-disabled"
                                        label="Mã sinh viên"
                                        defaultValue={item.studentId}
                                        {...register('studentId')}
                                        fullWidth
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                        <Controller
                                            required
                                            name="dateOfBirth"
                                            control={control}
                                            defaultValue={item.dateOfBirth}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DatePicker
                                                    label="Ngày sinh"
                                                    disableFuture
                                                    views={['year', 'month', 'day']}
                                                    ampm={false}
                                                    value={value}
                                                    onChange={(value) => onChange(value)}
                                                    disabled={!isEditable}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            required
                                                            id="outlined-disabled"
                                                            error={invalid}
                                                            helperText={invalid ? error.message : null}
                                                            // id="startDate"
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                    {/* <TextField
                                    disabled
                                    id="outlined-disabled"
                                    label="Ngày sinh"
                                    defaultValue={item.dateOfBirth}
                                    fullWidth
                                /> */}
                                    <TextField
                                        disabled={true}
                                        id="outlined-disabled"
                                        label="Giới tính"
                                        defaultValue={item.gender ? 'Nam' : 'Nữ'}
                                        {...register('gender')}
                                        fullWidth
                                    />
                                    <TextField
                                        disabled={true}
                                        defaultValue={item.role.name}
                                        // value={item.role.id}
                                        label="Chức vụ"
                                        // onChange={handleChange}
                                        {...register('roleName')}
                                        fullWidth
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={2} sx={{ p: 1, pr: 2 }}>
                                    <Typography variant="h6" component="div">
                                        Thông tin liên hệ
                                    </Typography>
                                    <Divider />
                                    <TextField
                                        disabled={true}
                                        id="outlined-disabled"
                                        label="Email"
                                        defaultValue={item.email}
                                        fullWidth
                                        {...register('email')}
                                        error={errors.email ? true : false}
                                        helperText={errors.email?.message}
                                    />
                                    <TextField
                                        id="outlined-disabled"
                                        label="Số điện thoại"
                                        defaultValue={item.phone}
                                        {...register('phone')}
                                        error={errors.phone ? true : false}
                                        helperText={errors.phone?.message}
                                        fullWidth
                                        // InputProps={{
                                        //     readOnly: !isEditable,
                                        // }}
                                        disabled={!isEditable}
                                    />
                                    <TextField
                                        required
                                        id="outlined-disabled"
                                        label="Địa chỉ hiện tại"
                                        defaultValue={item.currentAddress}
                                        {...register('currentAddress')}
                                        error={errors.currentAddress ? true : false}
                                        helperText={errors.currentAddress?.message}
                                        fullWidth
                                        disabled={!isEditable}
                                        // {...(!isEditable ? { disabled: true } : {})}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Fragment>
            );
        })
    );
}

export default UserProfile;
