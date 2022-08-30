import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    MenuItem,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import facilityApi from 'src/api/facilityApi';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import userApi from 'src/api/userApi';
import moment from 'moment';
import { useSnackbar } from 'notistack';

const AddMemberDialog = ({ title, children, isOpen, handleClose, onSucess }) => {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [submittedData, setSubmitedData] = useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [listStudentId, setListStudentId] = useState();
    const [listEmail, setListEmailId] = useState();
    const [listPhone, setListPhone] = useState();

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await userApi.getAllMemberAndAdmin();
                console.log('fetch users list', response);
                let listStudentId = response.data.map((i) => i.studentId);
                let listEmail = response.data.map((i) => i.email);
                let listPhone = response.data.map((i) => i.phone);

                setListStudentId(listStudentId);
                setListEmailId(listEmail);
                setListPhone(listPhone);
                // console.log(listStudentId, listEmail, listPhone);
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

            if (!value.match(/^[A-Z]{2}\d{6}\b/)) {
                return createError({
                    path,
                    message: `Vui lòng nhập đúng định dạng 'ex: HA14000'`,
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

            if (!value.match(/^[\w]+@(fpt.edu.vn)\b/)) {
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

            if (!value.match(/^[^\s]*(84|0[3|5|7|8|9])+([0-9]{8})\b/)) {
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
        name: Yup.string()
            .strict(false)
            .trim('Không để trống')
            // .min(5, 'Vui lòng nhập lớn hơn 5 ký tự')
            .max(255, 'Vui lòng không nhập lớn hơn 255 ký tự')
            .matches(
                /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẾỀếề ]+$/,
                'Vui lòng không nhập số, hoặc ký tự đặc biệt',
            )
            .required('Vui lòng không bỏ trống trường này'),
        // .nullable()
        // .required('Không được để trống trường này')
        // .test('len', 'Độ dài không cho phép', (val) => val.length > 5)
        // .matches(
        //     /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẾỀếề ]+$/,
        //     'Không hợp lệ: vui lòng nhập chữ',
        // ),
        studentId: Yup.mixed().uniqueStudentId(),
        dateOfBirth: Yup.date()
            .nullable()
            .required('Không được để trống trường này')
            .typeError('Vui lòng chọn đúng định dạng ngày'),
        email: Yup.mixed().uniqueEmail(),
        gender: Yup.string().required('Không được để trống trường này'),
        phone: Yup.mixed().uniquePhone(),
        roleId: Yup.string().required('Không được để trống trường này'),
        generation: Yup.string()
            .required('Không được để trống trường này')
            .min(1, 'Vui lòng nhập lớn hơn 0')
            .typeError('Không được để trống trường này')
            .matches(/^[0-9]*$/, 'Vui lòng chỉ nhập số nguyên')
            .trim(),
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data) => {
        console.log('data', data);
        const dataFormat = {
            currentAddress: data.currentAddress.trim(),
            dateOfBirth: moment(new Date(data.dateOfBirth)).format('yyyy-MM-DD'),
            email: data.email.trim(),
            gender: data.gender,
            name: data.name,
            phone: data.phone.trim(),
            roleId: data.roleId,
            studentId: data.studentId,
            generation: data.generation,
            active: true,
        };
        await userApi.createUser(dataFormat).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data.length != 0) {
                enqueueSnackbar(res.message, { variant: 'success' });
                onSucess && onSucess(res.data[0]);
                handleClose();
            } else {
                console.log('huhu');
                enqueueSnackbar(res.message, { variant: 'error' });
            }
        });

        console.log('form submit', dataFormat);
    };

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset({
                name: '',
                studentId: '',
                email: '',
                // gender: '-1',
                phone: '',
                roleId: '',
                generation: '',
                currentAddress: '',
            });
        }
    }, [formState, submittedData, reset]);
    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">{children}</DialogContentText> */}
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{
                            '& .MuiTextField-root': { mb: 2 },
                            '& .MuiBox-root': { width: '100%', ml: 1, mr: 2 },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1,
                            }}
                        >
                            <Box>
                                <Typography sx={{ fontSize: '1.2rem' }}>Thông tin cá nhân</Typography>
                            </Box>
                            {/* <Box>
                                <Typography sx={{ fontSize: '1.2rem' }}>Thông tin liên hệ</Typography>
                            </Box> */}
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <TextField
                                    required
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Họ và tên"
                                    {...register('name')}
                                    error={errors.name ? true : false}
                                    helperText={errors.name?.message}
                                />
                            </Box>
                            <Box>
                                <TextField
                                    required
                                    id="outlined-disabled"
                                    label="Mã sinh viên"
                                    fullWidth
                                    {...register('studentId')}
                                    error={errors.studentId ? true : false}
                                    helperText={errors.studentId?.message}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                    <Controller
                                        required
                                        name="dateOfBirth"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <DatePicker
                                                label="Ngày sinh"
                                                disableFuture
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
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box>
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
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <TextField
                                    required
                                    type="number"
                                    id="outlined-disabled"
                                    label="Gen"
                                    fullWidth
                                    {...register('generation')}
                                    error={errors.generation ? true : false}
                                    helperText={errors.generation?.message}
                                />
                            </Box>
                            <Box>
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
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1,
                            }}
                        >
                            <Box>
                                <Typography sx={{ fontSize: '1.2rem' }}>Thông tin liên hệ</Typography>
                            </Box>
                            {/* <Box>
                                <Typography sx={{ fontSize: '1.2rem' }}>Thông tin liên hệ</Typography>
                            </Box> */}
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <TextField
                                    required
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Số điện thoại"
                                    {...register('phone')}
                                    error={errors.phone ? true : false}
                                    helperText={errors.phone?.message}
                                />
                            </Box>
                            <Box>
                                <TextField
                                    required
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Email"
                                    {...register('email')}
                                    error={errors.email ? true : false}
                                    helperText={errors.email?.message}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Box>
                                <TextField
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Địa chỉ hiện tại"
                                    {...register('currentAddress')}
                                />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSubmit(onSubmit)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default AddMemberDialog;
