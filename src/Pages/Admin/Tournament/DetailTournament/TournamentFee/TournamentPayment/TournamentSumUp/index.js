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
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import { useSnackbar } from 'notistack';

import adminTournament from 'src/api/adminTournamentAPI';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

function TournamentSumUp({ title, params, isOpen, handleClose, onSucess, user }) {
    const [amountSumUp, setAmountSumUp] = useState(
        params.userList.length * params.tournament.feePlayerPay +
            params.adminList.length * params.tournament.feeOrganizingCommiteePay,
    );
    const [amountActual, setAmountActual] = useState(0);
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setAmountSumUp(
            params.userList.length * params.tournament.feePlayerPay +
                params.adminList.length * params.tournament.feeOrganizingCommiteePay,
        );
    }, [
        params.userList.length,
        params.adminList.length,
        params.tournament.feePlayerPay,
        params.tournament.feeOrganizingCommiteePay,
    ]);

    const validationSchema = Yup.object().shape({
        amountActual: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(1, 'Vui lòng nhập giá trị lớn hơn 0')
            .max(1000000000, 'Vui lòng nhập giá trị số tiền thực tế (không quá lớn)'),
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
        mode: 'onChange',
    });

    const updateAmount = (v) => {
        // const cost = +(params.userList.length * params.event.amountPerMemberRegister) + +Number(v.split(',').join(''));
        console.log(+Number(v.split(',').join('')));
        setAmountActual(+Number(v.split(',').join('')));
        // setAmountSumUp(cost);
    };

    const handleCloseDialog = () => {
        reset({ amountSumUp: 0 });
        setAmountSumUp(
            params.userList.length * params.tournament.feePlayerPay +
                params.adminList.length * params.tournament.feeOrganizingCommiteePay,
        );
        handleClose && handleClose();
    };

    const onSubmit = (data) => {
        console.log('data', data);
        adminTournament.updateAfterTournament(params.tournament.id, user.studentId, data.amountActual).then((res) => {
            if (res.data.length != 0) {
                enqueueSnackbar(res.message, { variant: 'success' });
                onSucess && onSucess(data.balance);
            } else {
                enqueueSnackbar(res.message, { variant: 'success' });
            }
        });
        reset({ amountActual: 0 });
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
                        <Typography variant="body1" sx={{ m: 1, lineHeight: 2 }}>
                            <strong>Chi phí dự kiến: </strong>
                            {params.tournament.totalAmountEstimate.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}
                        </Typography>
                        <Typography variant="body1" sx={{ m: 1, lineHeight: 2 }}>
                            <strong>Tổng chi phí thu được: </strong>
                            {amountSumUp.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                {open ? (
                                    <Tooltip title="Ẩn" arrow>
                                        <KeyboardArrowUp />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Mở rộng" arrow>
                                        <KeyboardArrowDown />
                                    </Tooltip>
                                )}
                            </IconButton>
                        </Typography>
                        <Collapse in={open} timeout="auto" unmountOnExit sx={{ m: 1 }} component={Paper}>
                            <Typography variant="body1" sx={{ m: 1, lineHeight: 2 }}>
                                <strong>Số vận động viên tham gia thực tế: </strong>
                                {params.userList.length}
                            </Typography>
                            <Typography variant="body1" sx={{ m: 1, lineHeight: 2 }}>
                                <strong>Tổng số tiền thu được từ vận động viên: </strong>
                                {(params.userList.length * params.tournament.feePlayerPay).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </Typography>
                            <Typography variant="body1" sx={{ m: 1, lineHeight: 2 }}>
                                <strong>Số người tham gia ban tổ chức thực tế: </strong>
                                {params.adminList.length}
                            </Typography>
                            <Typography variant="body1" sx={{ m: 1, lineHeight: 2 }}>
                                <strong>Tổng số tiền thu được từ ban tổ chức: </strong>
                                {(params.adminList.length * params.tournament.feeOrganizingCommiteePay).toLocaleString(
                                    'vi-VN',
                                    {
                                        style: 'currency',
                                        currency: 'VND',
                                    },
                                )}
                            </Typography>
                        </Collapse>

                        <Controller
                            name="amountActual"
                            variant="outlined"
                            defaultValue=""
                            control={control}
                            render={({ field: { onChange, value, onBlur }, fieldState: { error, invalid } }) => (
                                <NumberFormat
                                    name="amountActual"
                                    customInput={TextField}
                                    label="Tổng chi phí thực tế"
                                    thousandSeparator={true}
                                    variant="outlined"
                                    defaultValue=""
                                    value={value}
                                    onValueChange={(v) => {
                                        onChange(Number(v.value));
                                    }}
                                    onChange={(v) => updateAmount(v.target.value)}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                    }}
                                    error={invalid}
                                    helperText={invalid ? error.message : null}
                                    fullWidth
                                />
                            )}
                        />
                        {amountActual > 0 && amountActual > params.tournament.totalAmountEstimate ? (
                            <>
                                <Typography variant="body1">
                                    <strong>Số tiền tài trợ thực tế từ câu lạc bộ: </strong>
                                    {(amountActual - amountSumUp).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Typography>
                                {amountActual - amountSumUp > params.tournament.totalAmountFromClubEstimate && (
                                    <Typography variant="body1">
                                        <strong>Chi phí tài trợ phát sinh: </strong>
                                        {(
                                            amountActual -
                                            amountSumUp -
                                            params.tournament.totalAmountFromClubEstimate
                                        ).toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <>
                                <Typography variant="body1">
                                    <strong>Số tiền tài trợ thực tế từ câu lạc bộ: </strong>
                                    {(amountActual - amountSumUp).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Typography>

                                {amountActual - amountSumUp < params.tournament.totalAmountFromClubEstimate && (
                                    <Typography variant="body1">
                                        <strong>Số tiền tài trợ còn dư: </strong>
                                        {(
                                            params.tournament.totalAmountFromClubEstimate -
                                            amountActual -
                                            amountSumUp
                                        ).toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </Typography>
                                )}
                            </>
                        )}
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

export default TournamentSumUp;
