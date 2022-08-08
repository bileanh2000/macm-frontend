import {
    Alert,
    Avatar,
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
    Tooltip,
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
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const ViewDetailMemberDialog = ({ title, selectedStudent, isOpen, handleClose, onSucess, editable, adminRole }) => {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [submittedData, setSubmitedData] = useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [listStudentId, setListStudentId] = useState([]);
    const [listEmail, setListEmailId] = useState([]);
    const [listPhone, setListPhone] = useState([]);
    const [isEditable, setIsEditable] = useState(editable);

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

            if (!value.match(/[A-Z]{2}\d{6}\b/)) {
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
        if (listPhone) {
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
    }
    Yup.addMethod(Yup.mixed, 'uniqueStudentId', uniqueStudentId);
    Yup.addMethod(Yup.mixed, 'uniqueEmail', uniqueEmail);
    Yup.addMethod(Yup.mixed, 'uniquePhone', uniquePhone);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        studentId: Yup.mixed().uniqueStudentId(),
        dateOfBirth: Yup.string().nullable().required('Không được để trống trường này'),
        email: Yup.mixed().uniqueEmail(),
        gender: Yup.string().required('Không được để trống trường này'),
        phone: Yup.mixed().uniquePhone(),
        roleId: Yup.string().required('Không được để trống trường này'),
        generation: Yup.number()
            .required('Không được để trống trường này')
            .min(0, 'Vui lòng nhập lớn hơn 0')
            .typeError('Không được để trống trường này'),
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
        mode: 'onBlur',
    });

    const onSubmit = async (data) => {
        console.log('data', data);
        const dataFormat = {
            currentAddress: data.currentAddress,
            dateOfBirth: moment(new Date(data.dateOfBirth)).format('yyyy-MM-DD'),
            email: data.email,
            gender: data.gender,
            name: data.name,
            phone: data.phone,
            roleId: data.roleId,
            studentId: data.studentId,
            generation: data.generation,
            active: true,
        };

        await userApi.updateUser(dataFormat).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data.length !== 0) {
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

    return (
        <Fragment>
            <Box sx={{ display: 'none' }}>
                {listPhone && listPhone.splice(listPhone.indexOf(selectedStudent.phone), 1)}
                {listEmail && listEmail.splice(listEmail.indexOf(selectedStudent.email), 1)}
                {listStudentId && listStudentId.splice(listStudentId.indexOf(selectedStudent.studentId), 1)}
            </Box>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="dialog-title" sx={{ padding: 0 }}>
                    {/* {title} */}
                    <Box>
                        <img src="https://i.ibb.co/gTFTgXn/anh-bia.png" alt="" width="100%" height="110px" />
                    </Box>
                    <Avatar
                        alt="anh dai dien"
                        srcSet={selectedStudent.image}
                        sx={{
                            width: 130,
                            height: 130,
                            position: 'absolute',
                            top: 35,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            border: '4px solid #fff',
                        }}
                    />
                    <Tooltip title="Chỉnh sửa" placement="left-start">
                        <IconButton
                            aria-label="edit"
                            // size=""
                            sx={{
                                position: 'absolute',
                                top: '115px',
                                right: '5px',
                                // transform: 'translateX(-50%)',
                            }}
                            onClick={() => {
                                setIsEditable(true);
                            }}
                        >
                            <EditRoundedIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">{children}</DialogContentText> */}
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{
                            mt: 8,
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
                            <Box>
                                <Typography sx={{ fontSize: '1.2rem' }}>Thông tin liên hệ</Typography>
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
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Họ và tên"
                                    {...register('name')}
                                    error={errors.name ? true : false}
                                    helperText={errors.name?.message}
                                    defaultValue={selectedStudent.name}
                                    {...(!isEditable ? { disabled: true } : {})}
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
                                    defaultValue={selectedStudent.email}
                                    {...(!isEditable ? { disabled: true } : {})}
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
                                <TextField
                                    required
                                    id="outlined-disabled"
                                    label="Mã sinh viên"
                                    fullWidth
                                    {...register('studentId')}
                                    error={errors.studentId ? true : false}
                                    helperText={errors.studentId?.message}
                                    defaultValue={selectedStudent.studentId}
                                    {...(!isEditable ? { disabled: true } : {})}
                                />
                            </Box>
                            <Box>
                                <TextField
                                    required
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Số điện thoại"
                                    {...register('phone')}
                                    error={errors.phone ? true : false}
                                    helperText={errors.phone?.message}
                                    defaultValue={selectedStudent.phone}
                                    {...(!isEditable ? { disabled: true } : {})}
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
                                        // defaultValue={null}
                                        defaultValue={
                                            selectedStudent.dateOfBirth &&
                                            selectedStudent.dateOfBirth.split('/').reverse().join('-')
                                        }
                                        // defaultValue="2011-09-12"
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <DatePicker
                                                label="Ngày sinh"
                                                disableFuture
                                                views={['year', 'month', 'day']}
                                                ampm={false}
                                                value={value}
                                                onChange={(value) => onChange(value)}
                                                {...(!isEditable ? { disabled: true } : {})}
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
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Địa chỉ hiện tại"
                                    {...register('currentAddress')}
                                    defaultValue={selectedStudent.currentAddress}
                                    {...(!isEditable ? { disabled: true } : {})}
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
                                <TextField
                                    required
                                    select
                                    fullWidth
                                    defaultValue={selectedStudent.gender === 'Nam' ? true : false}
                                    label="Giới tính"
                                    {...register('gender')}
                                    error={errors.gender ? true : false}
                                    helperText={errors.gender?.message}
                                    {...(!isEditable ? { disabled: true } : {})}
                                >
                                    <MenuItem value={true}>Nam</MenuItem>
                                    <MenuItem value={false}>Nữ</MenuItem>
                                </TextField>
                                <TextField
                                    required
                                    type="number"
                                    defaultValue={selectedStudent.generation}
                                    id="outlined-disabled"
                                    label="Gen"
                                    fullWidth
                                    {...register('generation')}
                                    error={errors.generation ? true : false}
                                    helperText={errors.generation?.message}
                                    {...(!isEditable ? { disabled: true } : {})}
                                />
                            </Box>
                            <Box>
                                <TextField
                                    required
                                    select
                                    fullWidth
                                    defaultValue={selectedStudent.roleId}
                                    label="Chức vụ"
                                    {...register('roleId')}
                                    error={errors.roleId ? true : false}
                                    helperText={errors.roleId?.message}
                                    sx={{ width: '-webkit-fill-available' }}
                                    {...(!isEditable ? { disabled: true } : {})}
                                >
                                    <MenuItem value={1}>Chủ nhiệm</MenuItem>
                                    <MenuItem value={2}>Phó chủ nhiệm</MenuItem>
                                    <MenuItem value={3}>Thủ quỹ</MenuItem>
                                    <MenuItem value={4}>Trưởng ban văn hóa</MenuItem>
                                    <MenuItem value={5}>Phó ban văn hóa</MenuItem>
                                    <MenuItem value={6}>Trưởng ban truyền thông</MenuItem>
                                    <MenuItem value={7}>Phó ban truyền thông</MenuItem>
                                    <MenuItem value={8}>Trưởng ban chuyên môn</MenuItem>
                                    <MenuItem value={9}>Phó ban chuyên môn</MenuItem>

                                    <MenuItem value={10}>Thành viên Ban truyền thông</MenuItem>
                                    <MenuItem value={11}>Thành viên Ban văn hóa</MenuItem>
                                    <MenuItem value={12}>Thành viên Ban chuyên môn</MenuItem>
                                    <MenuItem value={13}>CTV Ban truyền thông</MenuItem>
                                    <MenuItem value={14}>CTV Ban văn hóa</MenuItem>
                                    <MenuItem value={15}>CTV Ban chuyên môn</MenuItem>
                                </TextField>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    {isEditable ? (
                        <>
                            <Button onClick={handleClose}>Hủy bỏ</Button>
                            <Button onClick={handleSubmit(onSubmit)} autoFocus>
                                Xác nhận
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleClose}>Quay lại</Button>
                    )}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ViewDetailMemberDialog;
