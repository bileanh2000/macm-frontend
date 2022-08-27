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
import adminContactAPI from 'src/api/adminContactAPI';
// import LoadingButton from '@mui/lab/LoadingButton';

const cx = classNames.bind(styles);

const EditContactDialog = ({
    title,
    selectedStudent,
    isOpen,
    handleClose,
    onSucess,
    editable,
    adminRole,
    contacts,
}) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        clubMail: Yup.string()
            .email('Vui lòng nhập đúng định dạng email')
            .max(255)
            .required('Không được bỏ trống trường này')
            .trim(),
        clubName: Yup.string().trim().required('Không được bỏ trống trường này'),
        clubPhoneNumber: Yup.string()
            .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Vui lòng nhập đúng số điện thoại')
            .trim()
            .required('Không được bỏ trống trường này'),
        fanpageUrl: Yup.string()
            .matches(
                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                'Vui lòng nhập đúng định dạng URL',
            )
            .required('Không được bỏ trống trường này')
            .trim(),
        foundingDate: Yup.string()
            .required('Vui lòng không được để trống trường này')
            .typeError('Vui lòng không được để trống trường này'),
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
        setLoading(true);
        // console.log('data', data);
        const dataFormat = {
            clubMail: data.clubMail,
            clubName: data.clubName,
            clubPhoneNumber: data.clubPhoneNumber,
            fanpageUrl: data.fanpageUrl,
            foundingDate: moment(data.foundingDate).format('yyyy-MM-DD'),
            image: file ? file : contacts[0]?.image,
        };

        await adminContactAPI.updateContact(dataFormat).then((res) => {
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
                        srcSet={file ? file : contacts[0]?.image}
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
                                    defaultValue={contacts[0]?.clubName}
                                    id="outlined-disabled"
                                    label="Tên Câu Lạc Bộ"
                                    {...register('clubName')}
                                    error={errors.clubName ? true : false}
                                    helperText={errors.clubName?.message}
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
                                        name="foundingDate"
                                        control={control}
                                        // defaultValue=""
                                        defaultValue={contacts[0]?.foundingDate}
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
                                    defaultValue={contacts[0]?.clubPhoneNumber}
                                    fullWidth
                                    {...register('clubPhoneNumber')}
                                    error={errors.clubPhoneNumber ? true : false}
                                    helperText={errors.clubPhoneNumber?.message}
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
                                    defaultValue={contacts[0]?.clubMail}
                                    {...register('clubMail')}
                                    error={errors.clubMail ? true : false}
                                    helperText={errors.clubMail?.message}
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
                                    label="Fanpage"
                                    defaultValue={contacts[0]?.fanpageUrl}
                                    {...register('fanpageUrl')}
                                    error={errors.fanpageUrl ? true : false}
                                    helperText={errors.fanpageUrl?.message}
                                />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <>
                        {loading ? null : <Button onClick={handleClose}>Hủy</Button>}
                        <Button onClick={handleSubmit(onSubmit)} autoFocus disabled={loading}>
                            {loading ? 'Loading...' : 'Xác nhận'}
                        </Button>
                        {/* <LoadingButton
                            size="small"
                            onClick={handleSubmit(onSubmit)}
                            //   endIcon={<SendIcon />}
                            loading={loading}
                            loadingPosition="end"
                            variant="contained"
                        >
                            Send
                        </LoadingButton> */}
                    </>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default EditContactDialog;
