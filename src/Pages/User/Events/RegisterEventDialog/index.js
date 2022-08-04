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

const RegisterEventDialog = ({ isOpen, handleClose, onSucess, data }) => {
    const [value, setValue] = useState(null);
    const [checked, setChecked] = useState(false);
    const now = new Date();
    const { enqueueSnackbar } = useSnackbar();

    let { id } = useParams();

    const handleCheck = () => {
        setChecked((prev) => !prev);
        setValue(null);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
        console.log(event.target.value);
    };
    const handleRegisterEventDeadline = () => {
        if (new Date(data.registrationMemberDeadline) > now) {
            return true;
        } else {
            return false;
        }
    };

    const handleRegisterCommitteeEventDeadline = () => {
        if (new Date(data.registrationOrganizingCommitteeDeadline) > now) {
            return true;
        } else {
            return false;
        }
    };
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
        mode: 'onBlur',
    });

    const onSubmit = (data) => {
        let studentId = JSON.parse(localStorage.getItem('currentUser')).studentId;

        let submitedData = { a: 1, b: 2 };
        console.log('submited data', submitedData);
        if (value) {
            eventApi.registerEventCommittee(id, studentId, value).then((res) => {
                console.log('registerEventCommittee', res);
                if (res.message == 'Thành viên ban tổ chức không thể hủy tham gia') {
                    enqueueSnackbar(res.message, { variant: 'error', preventDuplicate: true });
                }
                if (res.data.length !== 0) {
                    onSucess && onSucess(res.data[0]);
                    enqueueSnackbar(res.message, { variant: 'success', preventDuplicate: true });
                }
                handleClose();
            });
        } else {
            eventApi.registerEvent(id, studentId).then((res) => {
                console.log('registerEvent', res);
                enqueueSnackbar(res.message, { variant: 'success', preventDuplicate: true });
                onSucess && onSucess(res.data[0]);
                handleClose();
            });
        }
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
                <DialogTitle id="alert-dialog-title">Đăng ký tham gia sự kiện {data.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn muốn đăng ký tham gia sự kiện này ?
                    </DialogContentText>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={checked}
                                onChange={handleCheck}
                                {...(handleRegisterCommitteeEventDeadline() ? { disabled: false } : { disabled: true })}
                            />
                        }
                        {...(handleRegisterCommitteeEventDeadline()
                            ? { label: 'Đăng ký thành thành viên ban tổ chức' }
                            : { label: 'Đã hết hạn đăng ký thành thành viên ban tổ chức' })}
                    />

                    <Collapse in={checked}>
                        <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            sx={{
                                '& .MuiTextField-root': { mb: 2 },
                            }}
                        >
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={value}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="4" control={<Radio />} label="Thành viên ban văn hóa" />
                                    <FormControlLabel
                                        value="2"
                                        control={<Radio />}
                                        label="Thành viên ban truyền thông"
                                    />
                                    <FormControlLabel value="3" control={<Radio />} label="Thành viên ban hậu cần" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Collapse>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        autoFocus
                        {...(checked ? (!value ? { disabled: true } : { disabled: false }) : '')}
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default RegisterEventDialog;
