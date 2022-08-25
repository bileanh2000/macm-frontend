import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    MenuItem,
    Radio,
    RadioGroup,
    Snackbar,
    TextField,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import facilityApi from 'src/api/facilityApi';
import userApi from 'src/api/userApi';
import { useSnackbar } from 'notistack';
let snackBarStatus;
const ActiveRegister = ({ title, semester, isOpen, handleClose, onSuccess, studentId }) => {
    const [value, setValue] = useState(-1);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const updateStatusByUser = async () => {
        try {
            const params = { semester: semester, status: '1', studentId: 'ge' };
            const response = userApi.updateStatusByUser(params);
            console.log('updateStatusByUser', response);
        } catch (error) {
            console.log('failed when updateStatusByUser', error);
        }
    };

    const handleChangeRadioButton = (event) => {
        setValue(event.target.value);
    };
    // useEffect(() => {
    //     updateStatusByUser();
    // }, []);
    const handleUpdateStatus = () => {
        const params = { semester: semester, status: value, studentId: studentId };
        userApi.updateStatusByUser(params).then((res) => {
            console.log(res);
            enqueueSnackbar(res.message, { variant: 'success' });
            handleClose();
        });
    };
    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={!!isOpen}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Đăng ký trạng thái hoạt động kỳ {semester}</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChangeRadioButton}
                        >
                            <FormControlLabel value={1} control={<Radio />} label="Active" />
                            <FormControlLabel value={0} control={<Radio />} label="Deactive" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    {/* <Button onClick={handleClose}>Hủy</Button> */}
                    <Button onClick={() => handleUpdateStatus()} disabled={value === -1}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ActiveRegister;
