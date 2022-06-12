import { useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import userApi from 'src/api/userApi';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { yupResolver } from '@hookform/resolvers/yup';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as Yup from 'yup';

// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import DateFnsUtils from '@date-io/date-fns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function UserDetailEdit() {
    let { userId } = useParams();
    const [userDetail, setUserDetail] = useState([]);
    const [age, setAge] = useState('');
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

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const params = userId;
                const response = await userApi.getUserbyId(params);
                console.log(response);
                setUserDetail(response.data);
            } catch (error) {
                console.log('Failed to fetch user detail: ', error);
            }
        };
        fetchUserDetail();
    }, []);

    const Input = styled('input')({
        display: 'none',
    });
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const dynamicAlert = (status) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: 'Cập nhật người dùng thành công' });
        } else {
            setCustomAlert({ severity: 'error', message: 'Lỗi khi cập nhật người dùng' });
        }
    };
    const onSubmit = async (data) => {
        await userApi.updateUser(data).then((res) => {
            console.log('1', res);
            console.log('2', res.data);
            if (res.data.length != 0) {
                setOpenSnackBar(true);
                // setSnackBarStatus(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus);
            } else {
                console.log('huhu');
                setOpenSnackBar(true);
                // setSnackBarStatus(false);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus);
            }
        });
        console.log('form submit', data);
    };
    return userDetail.map((item) => {
        return (
            <Fragment key={item.id}>
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={5000}
                    // onClose={handleCloseSnackBar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <Alert
                        // onClose={handleCloseSnackBar}
                        variant="filled"
                        severity={customAlert.severity || 'success'}
                        sx={{ width: '100%' }}
                    >
                        {customAlert.message}
                    </Alert>
                </Snackbar>
                <Box component="div" sx={{ marginBottom: 12, position: 'relative' }}>
                    <Box component="div">
                        <img src="https://source.unsplash.com/random" alt="" width="100%" height="146px" />
                        <Avatar
                            alt="anh dai dien"
                            srcSet="https://scontent.fhan5-6.fna.fbcdn.net/v/t39.30808-6/281356576_3493649010862384_4475616120131758473_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=kYec_HK0aBIAX-gh-W3&_nc_ht=scontent.fhan5-6.fna&oh=00_AT-XfxH5kDkm71k41u2jR27-skqEJcsukxhuIPBdJGFVjQ&oe=62A8E9B7"
                            sx={{ width: 180, height: 180, position: 'absolute', top: 55, left: 16 }}
                        />
                    </Box>
                </Box>
                <Typography variant="h5" component="div" sx={{ marginBottom: '16px', fontWeight: '700' }}>
                    Chỉnh sửa thông tin thành viên
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
                                label="Họ và Tên"
                                defaultValue={item.name}
                                fullWidth
                                {...register('name')}
                                error={errors.name ? true : false}
                                helperText={errors.name?.message}
                            />
                            <TextField
                                required
                                id="outlined-disabled"
                                label="Mã sinh viên"
                                defaultValue={item.studentId}
                                fullWidth
                                {...register('studentId')}
                                error={errors.studentId ? true : false}
                                helperText={errors.studentId?.message}
                            />
                            <TextField
                                required
                                id="outlined-disabled"
                                label="Ngày sinh"
                                defaultValue={item.dateOfBirth}
                                fullWidth
                                {...register('dateOfBirth')}
                                error={errors.dateOfBirth ? true : false}
                                helperText={errors.dateOfBirth?.message}
                            />

                            <TextField
                                required
                                select
                                id="outlined-disabled"
                                label="Giới tính"
                                defaultValue={item.gender}
                                fullWidth
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
                                    defaultValue={item.email}
                                    {...register('email')}
                                    error={errors.email ? true : false}
                                    helperText={errors.email?.message}
                                />
                                <TextField
                                    required
                                    id="outlined-disabled"
                                    label="Số điện thoại"
                                    defaultValue={item.phone}
                                    {...register('phone')}
                                    error={errors.phone ? true : false}
                                    helperText={errors.phone?.message}
                                />
                                <TextField
                                    required
                                    id="outlined-disabled"
                                    label="Địa chỉ hiện tại"
                                    defaultValue={item.currentAddress}
                                    {...register('currentAddress')}
                                />

                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    defaultValue={item.role.id}
                                    label="Chức vụ"
                                    // onChange={handleChange}
                                    {...register('roleId')}
                                ></TextField>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '8px', mt: '8px' }}>
                        <Button variant="contained" component="span" onClick={handleSubmit(onSubmit)}>
                            Lưu lại
                        </Button>
                    </Box>
                </Box>
            </Fragment>
        );
    });

    // return userDetail.map((item) => {
    //
    // });
}

export default UserDetailEdit;
