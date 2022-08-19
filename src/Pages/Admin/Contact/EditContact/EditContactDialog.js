import {
    Alert,
    Avatar,
    Badge,
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
import FileBase64 from 'react-file-base64';
import styles from './EditContact.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const EditContactDialog = ({ title, selectedStudent, isOpen, handleClose, onSucess, editable, adminRole }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [file, setFile] = useState();
    const validationSchema = Yup.object().shape({});

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

    const onChange = (e) => {
        console.log(e);
        if (e.type !== 'image/jpeg' && e.type !== 'image/png') {
            enqueueSnackbar('Vui lòng chọn đúng định dạng ảnh jpg hoặc png', { variant: 'error' });
        } else {
            setFile(e.base64);
        }
    };
    return (
        <Fragment>
            <Box sx={{ display: 'none' }}></Box>
            <Dialog
                fullWidth
                maxWidth="xs"
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
                        sx={{
                            width: 130,
                            height: 130,
                            position: 'absolute',
                            top: 35,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            border: '4px solid #fff',
                        }}
                        srcSet={file}
                    />

                    <IconButton color="primary" aria-label="upload picture" component="label" sx={{}}>
                        <Box className={cx('upload-button')}>
                            <FileBase64 multiple={false} onDone={onChange} />
                        </Box>
                        <PhotoCamera
                            sx={{
                                left: '250px',
                                color: '#1D1F23',
                                background: '#E4E6EB',
                                width: '37px',
                                height: '37px',
                                borderRadius: '50%',
                                padding: '6px',
                                position: 'absolute',
                                top: '-2px',
                            }}
                        />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">{children}</DialogContentText> */}

                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{
                            mt: 7,
                            '& .MuiTextField-root': { mb: 2 },
                            '& .MuiBox-root': { width: '100%', ml: 1, mr: 2 },
                        }}
                    >
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
                                    label="Tên Câu Lạc Bộ"
                                    {...register('name')}
                                    error={errors.name ? true : false}
                                    helperText={errors.name?.message}
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
                                        defaultValue=""
                                        // defaultValue="2011-09-12"
                                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                            <DatePicker
                                                label="Ngày thành lập"
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
                                    label="Số điện thoại"
                                    fullWidth
                                    {...register('phone')}
                                    error={errors.phone ? true : false}
                                    helperText={errors.phone?.message}
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
                                <TextField fullWidth id="outlined-disabled" label="Fanpage" {...register('facebook')} />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Box>
                                <TextField fullWidth id="outlined-disabled" label="Địa chỉ" {...register('address')} />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button onClick={handleSubmit(onSubmit)} autoFocus>
                            Xác nhận
                        </Button>
                    </>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default EditContactDialog;
