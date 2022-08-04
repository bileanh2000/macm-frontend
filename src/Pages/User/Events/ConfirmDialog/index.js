import {
    Alert,
    Box,
    Button,
    Collapse,
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
    Switch,
    TextField,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import facilityApi from 'src/api/facilityApi';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useParams } from 'react-router-dom';
import eventApi from 'src/api/eventApi';
import { useSnackbar } from 'notistack';

const ConfirmCancel = ({ isOpen, handleClose, onSucess, data }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [value, setValue] = useState(null);
    const [checked, setChecked] = useState(false);
    const now = new Date();
    let { id } = useParams();

    const handleCancelEvent = () => {
        let studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;
        eventApi.cancelJointEvent(id, studentId).then((res) => {
            console.log(res);
            if (res.message === 'Thành viên ban tổ chức không thể hủy tham gia') {
                enqueueSnackbar(res.message, { variant: 'error', preventDuplicate: true });
            }
            if (res.data.length !== 0) {
                onSucess && onSucess(res.data[0]);
                enqueueSnackbar(res.message, { variant: 'success', preventDuplicate: true });
            }
            handleClose();
        });
    };
    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth="xs"
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Hủy đăng ký tham gia sự kiện</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn muốn HỦY đăng ký tham gia sự kiện này ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleCancelEvent}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default ConfirmCancel;
