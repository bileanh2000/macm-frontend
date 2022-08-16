import { Link, useParams } from 'react-router-dom';
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
                console.log(listStudentId, listEmail, listPhone);
            } catch (error) {
                console.log('Failed to fetch user list: ', error);
            }
        };
        fetchUserList();
    }, []);

    function uniquePhone(message) {
        return this.test('uniquePhone', message, function (value) {
            const index = listPhone.indexOf(value);
            if (index > -1) {
                listPhone.splice(index, 1);
            }
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
    const roleData = [
        {
            id: 1,
            name: 'Chủ nhiệm',
        },
        {
            id: 2,
            name: 'Phó chủ nhiệm',
        },
        {
            id: 3,
            name: 'Thủ quỹ',
        },
        {
            id: 4,
            name: 'Trưởng ban văn hóa',
        },
        {
            id: 5,
            name: 'Phó ban văn hóa',
        },
        {
            id: 6,
            name: 'Trưởng ban truyền thông',
        },
        {
            id: 7,
            name: 'Phó ban truyền thông',
        },
        {
            id: 8,
            name: 'Trưởng ban chuyên môn',
        },
        {
            id: 9,
            name: 'Phó ban chuyên môn',
        },
        {
            id: 10,
            name: 'Thành viên ban truyền thông',
        },
        {
            id: 11,
            name: 'Thành viên ban văn hóa',
        },
        {
            id: 12,
            name: 'Thành viên ban chuyên môn',
        },
        {
            id: 13,
            name: 'CTV ban truyền thông',
        },
        {
            id: 14,
            name: 'CTV ban văn hóa',
        },
        {
            id: 15,
            name: 'CTV ban chuyên môn',
        },
    ];

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
        console.log(data);
        const roleId = roleData.filter((item) => item.name === data.roleName);
        data = {
            ...data,
            studentId: userId,
            roleId: roleId[0].id,
        };
        console.log(data);
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

    return userDetail.map((item) => {
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
                            <Typography variant="h5" component="div" sx={{ marginBottom: '16px', fontWeight: '700' }}>
                                Chỉnh sửa thông tin
                            </Typography>
                            <Box>
                                <Button variant="outlined" onClick={() => setIsEditable(false)} sx={{ mr: 2 }}>
                                    Hủy bỏ
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
                                    {...(!isEditable ? { disabled: true } : {})}
                                    fullWidth
                                />
                                <TextField
                                    disabled
                                    id="outlined-disabled"
                                    label="Mã sinh viên"
                                    defaultValue={item.studentId}
                                    fullWidth
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                    <Controller
                                        required
                                        name="dateOfBirth"
                                        control={control}
                                        defaultValue={item.dateOfBirth}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
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
                                    disabled
                                    id="outlined-disabled"
                                    label="Giới tính"
                                    defaultValue={item.gender ? 'Nam' : 'Nữ'}
                                    fullWidth
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={2} sx={{ p: 1, pr: 2 }}>
                                <Typography variant="h6" component="div">
                                    Thông tin iên hệ
                                </Typography>
                                <Divider />
                                <TextField
                                    disabled
                                    id="outlined-disabled"
                                    label="Email"
                                    defaultValue={item.email}
                                    fullWidth
                                />
                                <TextField
                                    id="outlined-disabled"
                                    label="Số điện thoại"
                                    defaultValue={item.phone}
                                    {...register('phone')}
                                    error={errors.phone ? true : false}
                                    helperText={errors.phone?.message}
                                    fullWidth
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
                                    // {...(!isEditable ? { disabled: true } : {})}
                                    disabled={!isEditable}
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    defaultValue={item.role.name}
                                    // value={item.role.id}
                                    label="Chức vụ"
                                    // onChange={handleChange}
                                    {...register('roleName')}
                                    fullWidth
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Fragment>
        );
    });
}

export default UserProfile;
