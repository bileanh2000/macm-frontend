import React, { forwardRef, Fragment, useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    InputAdornment,
    Snackbar,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import eventApi from 'src/api/eventApi';

function EventSumUp({ title, params, isOpen, handleClose, onSucess }) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [isFirstChecked, setIsFirstChecked] = useState(false);
    const [isSecondChecked, setIsSecondChecked] = useState(false);
    const [customAlert, setCustomAlert] = useState({ severity: '', message: '' });
    const [submittedData, setSubmitedData] = useState([]);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [costIncurred, setCostIncurred] = useState(0);
    const [amountSumUp, setAmountSumUp] = useState(params.userList.length * params.event.amountPerMemberRegister);
    let snackBarStatus;

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    const dynamicAlert = (status, message) => {
        console.log('status of dynamicAlert', status);
        if (status) {
            setCustomAlert({ severity: 'success', message: message });
        } else {
            setCustomAlert({ severity: 'error', message: message });
        }
    };

    const validationSchema = Yup.object().shape({
        ...(!isFirstChecked && {
            balance: Yup.number()
                .required('Không được để trống trường này')
                .typeError('Vui lòng nhập số')
                .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        }),
        ...(isFirstChecked && {
            amountSumUp: Yup.number()
                .required('Không được để trống trường này')
                .typeError('Vui lòng nhập số')
                .min(1, 'Vui lòng nhập giá trị lớn hơn 1'),
        }),
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState,
        // formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset({ balance: '', amountSumUp: '', cast: '' });
            setIsFirstChecked(false);
            setIsSecondChecked(false);
            setCostIncurred(0);
            setAmountSumUp(params.userList.length * params.event.amountPerMemberRegister);
        }
    }, [formState, submittedData, reset]);

    const updateAmount = (v) => {
        const cost = +(params.userList.length * params.event.amountPerMemberRegister) + +Number(v.split(',').join(''));
        console.log(cost);
        setCostIncurred(Number(v.split(',').join('')));
        setAmountSumUp(cost);
    };

    const updateFunClub = (v) => {
        const newFun = +Number(params.funClub) + +Number(v.split(',').join(''));
        console.log(newFun);
    };

    const handleCloseDialog = () => {
        reset({ balance: '', amountSumUp: '', cast: '' });
        setIsFirstChecked(false);
        setIsSecondChecked(false);
        setCostIncurred(0);
        setAmountSumUp(params.userList.length * params.event.amountPerMemberRegister);
        handleClose && handleClose();
    };

    const onSubmit = (data) => {
        console.log('data', data);
        // setSubmitedData(data);

        const submitData = {
            // balance: data.balance,
            id: params.event.id,
            // amountFromClub: isSecondChecked && costIncurred < params.funClub ? costIncurred : 0,
            // amountPerRegisterActual: !isSecondChecked
            //     ? Math.ceil(costIncurred / (params.userList.length * 1000)) * 1000
            //     : 0,
            isIncurred: isFirstChecked,
            isUseClubFund: isFirstChecked ? isSecondChecked : true,
            money: !isFirstChecked ? data.balance : costIncurred,
        };
        console.log(submitData);
        eventApi.updateAfterEvent(submitData, user.studentId).then((res) => {
            console.log(res);
            if (res.data.length != 0) {
                setOpenSnackBar(true);
                // setSnackBarStatus(true);
                snackBarStatus = true;
                dynamicAlert(snackBarStatus, res.message);
                onSucess && onSucess(data.balance);
            } else {
                console.log('huhu');
                setOpenSnackBar(true);
                // setSnackBarStatus(false);
                snackBarStatus = false;
                dynamicAlert(snackBarStatus, res.message);
            }
        });
        reset({ balance: '', amountSumUp: '', cast: '' });
        setIsFirstChecked(false);
        setIsSecondChecked(false);
        setCostIncurred(0);
        setAmountSumUp(params.userList.length * params.event.amountPerMemberRegister);
        handleClose && handleClose();
    };

    const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumberFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                isNumericString
            />
        );
    });
    NumberFormatCustom.propTypes = {
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    return (
        <Fragment>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={3000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
            <Dialog
                fullWidth
                maxWidth="md"
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {title}
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">{children}</DialogContentText> */}
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{
                            '& .MuiTextField-root': { mb: 2 },
                        }}
                    >
                        {/* <Controller
                            name="cost"
                            variant="outlined"
                            defaultValue=""
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                <NumberFormat
                                    name="cost"
                                    customInput={TextField}
                                    label="Tổng chi phí tổ chức"
                                    thousandSeparator={true}
                                    variant="outlined"
                                    defaultValue=""
                                    value={value}
                                    onValueChange={(v) => {
                                        onChange(Number(v.value));
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                    }}
                                    error={invalid}
                                    helperText={invalid ? error.message : null}
                                    fullWidth
                                />
                            )}
                        /> */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <FormControlLabel
                                sx={{ marginLeft: '1px' }}
                                control={
                                    <Switch
                                        checked={isFirstChecked}
                                        onChange={() => setIsFirstChecked(!isFirstChecked)}
                                    />
                                }
                                label="Phát sinh thêm chi phí"
                            />
                            {/* <Typography>Tổng tiền quỹ: 2.000.000 vnđ</Typography> */}
                        </Box>
                        <Collapse in={isFirstChecked}>
                            <Controller
                                name="amountSumUp"
                                variant="outlined"
                                defaultValue=""
                                control={control}
                                render={({ field: { onChange, value, onBlur }, fieldState: { error, invalid } }) => (
                                    <NumberFormat
                                        name="amountSumUp"
                                        customInput={TextField}
                                        label="Tổng chi phí phát sinh"
                                        thousandSeparator={true}
                                        variant="outlined"
                                        defaultValue=""
                                        value={value}
                                        onValueChange={(v) => {
                                            onChange(Number(v.value));
                                        }}
                                        onBlur={(v) => updateAmount(v.target.value)}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                        }}
                                        error={invalid}
                                        helperText={invalid ? error.message : null}
                                        fullWidth
                                    />
                                )}
                            />
                        </Collapse>
                        {!isFirstChecked && (
                            <Controller
                                name="balance"
                                variant="outlined"
                                defaultValue={isFirstChecked ? '' : 0}
                                control={control}
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                    <NumberFormat
                                        name="balance"
                                        customInput={TextField}
                                        label="Số dư sau sự kiện"
                                        thousandSeparator={true}
                                        variant="outlined"
                                        defaultValue={isFirstChecked ? '' : 0}
                                        value={isFirstChecked ? 0 : value}
                                        onValueChange={(v) => {
                                            onChange(Number(v.value));
                                        }}
                                        onBlur={(v) => updateFunClub(v.target.value)}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                        }}
                                        error={invalid}
                                        helperText={invalid ? error.message : null}
                                        fullWidth
                                        disabled={isFirstChecked}
                                    />
                                )}
                            />
                        )}
                        <Typography variant="body1">Số người tham gia thực tế: {params.userList.length}</Typography>
                        <Typography variant="body1">
                            Tổng số tiền thu được thực tế:{' '}
                            {(params.userList.length * params.event.amountPerMemberRegister).toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </Typography>
                        <Typography variant="body1">
                            Tổng chi phí thực tế:{' '}
                            {amountSumUp.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Typography>
                        {isFirstChecked && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <FormControlLabel
                                    sx={{ marginLeft: '1px' }}
                                    control={
                                        <Switch
                                            checked={isSecondChecked}
                                            onChange={() => setIsSecondChecked(!isSecondChecked)}
                                        />
                                    }
                                    label="Sử dụng số dư CLB"
                                    disabled={params.funClub - costIncurred < 0}
                                />
                                <Typography>
                                    Số dư quỹ hiện tại:{' '}
                                    {params.funClub.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Typography>
                                {isSecondChecked &&
                                    (params.funClub - costIncurred > 0 ? (
                                        <Typography>
                                            Số dư quỹ mới:{' '}
                                            {(params.funClub - costIncurred).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
                                        </Typography>
                                    ) : (
                                        <Typography variant="subtitle2" sx={{ color: 'red' }}>
                                            Không thể sử dụng quỹ do số tiền phát sinh lơn hơn số dư quỹ hiện tại
                                        </Typography>
                                    ))}
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            {costIncurred > 0 && !isSecondChecked && (
                                <Typography>
                                    Số tiền mỗi người phải đóng thêm :{' '}
                                    {(Math.ceil(costIncurred / (params.userList.length * 1000)) * 1000).toLocaleString(
                                        'vi-VN',
                                        {
                                            style: 'currency',
                                            currency: 'VND',
                                        },
                                    )}
                                </Typography>
                            )}
                        </Box>
                        {/* <Controller
                            name="cast"
                            variant="outlined"
                            defaultValue=""
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                <NumberFormat
                                    name="cast"
                                    customInput={TextField}
                                    label="Số tiền mỗi người phải đóng thêm"
                                    thousandSeparator={true}
                                    variant="outlined"
                                    defaultValue=""
                                    value={isSecondChecked ? 0 : value}
                                    onValueChange={(v) => {
                                        onChange(Number(v.value));
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                    }}
                                    error={invalid}
                                    helperText={invalid ? error.message : null}
                                    fullWidth
                                    disabled={isSecondChecked}
                                />
                            )}
                        /> */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleSubmit(onSubmit)} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default EventSumUp;
