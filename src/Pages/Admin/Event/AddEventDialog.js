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
    Fab,
    FormControlLabel,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import userApi from 'src/api/userApi';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { Add, Delete } from '@mui/icons-material';
import { useRef } from 'react';

const steps = ['Thông tin sự kiện', 'Thêm vai trò BTC', 'Thêm chi phí', 'Thêm lịch', 'Xem trước'];
const eventRoles = [{ id: 1, name: 'hehe' }];
const AddEventDialog = ({ title, children, isOpen, handleClose, onSucess }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [activeStep, setActiveStep] = useState(0);
    const [description, setDescription] = useState('');
    const [skipped, setSkipped] = useState(new Set());
    const [isChecked, setIsChecked] = useState(false);
    const [datas, setDatas] = useState([]);
    const [isAmountPerRegister, setIsAmountPerRegister] = useState(false);
    const [totalAmountEstimated, setTotalAmountEstimated] = useState(0);
    const [amountFromClub, setAmountFromClub] = useState(0);
    const [totalClubFunds, setTotalClubFunds] = useState(20000);
    const [amountPerRegister, setAmountPerRegister] = useState();
    const [thirdStepStatus, setThirdStepStatus] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const isStepOptional = (step) => {
        return step === 2 || step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    const validationSchema = Yup.object().shape({
        ...(activeStep === 0
            ? {
                  name: Yup.string().required('Không được để trống trường này'),
              }
            : activeStep === 1
            ? {
                  roleName: Yup.string().nullable().required('Không được để trống trường này'),
                  numberOfRole: Yup.number()
                      .nullable()
                      .required('Không được để trống trường này')
                      .max(1000, 'Số lượng không hợp lệ')
                      .typeError('Không được để trống trường này'),
              }
            : activeStep === 2
            ? {
                  amountFromClub: Yup.number()
                      .required('Không được để trống trường này')
                      .min(1, 'Vui lòng nhập giá trị lớn hơn 0')
                      .max(totalClubFunds, 'Tiền quỹ CLB không đủ')
                      .typeError('Vui lòng nhập giá trị lớn hơn 0'),
                  totalAmountEstimated: Yup.number()
                      .required('Không được để trống trường này')
                      .min(1, 'Vui lòng nhập giá trị lớn hơn 0')
                      .typeError('Vui lòng nhập giá trị lớn hơn 0'),
                  ...(isAmountPerRegister && {
                      amountPerRegister: Yup.number()
                          .required('Không được để trống trường này')
                          .typeError('Vui lòng nhập số')
                          .min(1, 'Vui lòng nhập giá trị lớn hơn 0')
                          .typeError('Vui lòng nhập giá trị lớn hơn 0'),
                  }),
              }
            : activeStep === 3
            ? {
                  startDate: Yup.date()
                      .typeError('Vui lòng không để trống trường này')
                      .required('Vui lòng không để trống trường này'),
                  finishDate: Yup.date()
                      .min(Yup.ref('startDate'), ({ min }) => `Thời gian kết thúc không được bé hơn thời gian bắt đầu`)
                      .typeError('Vui lòng không để trống trường này')
                      .required('Vui lòng không để trống trường này'),
                  registrationMemberDeadline: Yup.date()
                      .max(Yup.ref('startDate'), ({ min }) => `Deadline không được bé hơn thời gian bắt đầu`)
                      .typeError('Vui lòng không để trống trường này')
                      .required('Vui lòng không để trống trường này'),
                  registrationOrganizingCommitteeDeadline: Yup.date()
                      .max(Yup.ref('startDate'), ({ min }) => `Deadline không được bé hơn thời gian bắt đầu`)
                      .typeError('Vui lòng không để trống trường này')
                      .required('Vui lòng không để trống trường này'),
              }
            : null),

        // ...(activeStep === 3 && {
        //     startTime: Yup.string().nullable().required('Không được để trống trường này'),
        // },
        // {
        //     finishTime: Yup.string().nullable().required('Không được để trống trường này'),
        // },
        // {
        //     startDate: Yup.string().nullable().required('Không được để trống trường này'),
        // },
        // {
        //     finishDate: Yup.string().nullable().required('Không được để trống trường này'),
        // }),
        // cost: Yup.string().required('Không được để trống trường này').min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
        // ...(isChecked && {
        //     amountPerRegister: Yup.number()
        //         .required('Không được để trống trường này')
        //         .typeError('Vui lòng nhập số')
        //         .min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
        // }),
        // registrationMemberDeadline: Yup.string().nullable().required('Không được để trống trường này'),
        // registrationOrganizingCommitteeDeadline: Yup.string().nullable().required('Không được để trống trường này'),
        // roleName: Yup.string().nullable().required('Không được để trống trường này'),
        // numberOfRole: Yup.string().nullable().required('Không được để trống trường này'),
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        resetField,
        setFocus,
        setError,
        formState: { errors, isDirty, isValid },
    } = useForm({
        resolver: yupResolver(validationSchema),

        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const handleCancel = () => {
        setIsChecked(!isChecked);
        resetField('roleName');
        resetField('numberOfRole');
    };
    const handleDelete = (id) => {
        // datas.map((data) => {
        //     return data.id === id;
        // });
        setDatas((prevRows) => prevRows.filter((item) => item.id !== id));
    };
    const handleAddEventRoles = (data) => {
        console.log(data);
        const newData = [...datas, { ...data, id: Math.random() }];
        setDatas(newData);

        resetField('roleName');
        resetField('numberOfRole');

        setIsChecked(!isChecked);
    };

    useEffect(() => {
        console.log('heeeeeeeeeeeee a');
        if (activeStep === 2) {
            // if (isValid) {
            //     return;
            // }
            console.log('heeeeeeeeeeeee skip', isValid);
            setThirdStepStatus(isValid);
        }
    }, [activeStep, isValid]);

    console.log('isValid', isValid);
    const formRef = useRef(null);

    const handlePreview = () => {
        // let newSkipped = skipped;
        // if (isStepSkipped(activeStep)) {
        //     newSkipped = new Set(newSkipped.values());
        //     newSkipped.delete(activeStep);
        // }

        // setActiveStep((prevActiveStep) => prevActiveStep + 1);
        // setSkipped(newSkipped);
        console.log('handlePreview');
    };
    /**
     * Revalidate form after step changed
     */
    useEffect(() => {
        control._updateValid();
    }, [activeStep, control]);

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
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{
                            '& .MuiTextField-root': { mb: 2 },
                            '& .MuiBox-root': { width: '100%', ml: 1, mr: 2 },
                        }}
                        ref={formRef}
                    >
                        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                if (isStepOptional(index)) {
                                    labelProps.optional = <Typography variant="caption">Tùy chọn</Typography>;
                                }
                                if (isStepSkipped(index)) {
                                    stepProps.completed = false;
                                }
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === steps.length - 1 ? (
                            <Fragment>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={handleReset}>Reset</Button>
                                </Box>
                            </Fragment>
                        ) : // <Fragment>
                        //     <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                        // </Fragment>
                        activeStep === 0 ? (
                            <>
                                <TextField
                                    id="outlined-basic"
                                    label="Tên sự kiện"
                                    variant="outlined"
                                    fullWidth
                                    {...register('name')}
                                    error={errors.name ? true : false}
                                    helperText={errors.name?.message}
                                />
                                <TextField
                                    fullWidth
                                    id="outlined-multiline-static"
                                    label="Nội dung"
                                    multiline
                                    rows={4}
                                    defaultValue=""
                                    {...register('description')}
                                />
                                {/* <button disabled={!isValid} type="submit">
                                    Submit
                                </button> */}
                            </>
                        ) : activeStep === 1 ? (
                            <>
                                <Box>
                                    {datas.length > 0 && (
                                        <TableContainer sx={{ maxHeight: 440, m: 1, p: 1 }}>
                                            <Table stickyHeader aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">Tên vai trò</TableCell>
                                                        <TableCell align="center">Số lượng</TableCell>
                                                        <TableCell align="center"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {datas.map((data) => (
                                                        <TableRow key={data.id}>
                                                            <TableCell align="center">{data.roleName}</TableCell>
                                                            <TableCell align="center">{data.numberOfRole}</TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    aria-label="delete"
                                                                    onClick={() => {
                                                                        // handleOpenDialog();
                                                                        handleDelete(data.id);
                                                                    }}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                    <Paper elevation={3}>
                                        <Collapse in={isChecked}>
                                            <Grid container spacing={2} sx={{ p: 2 }}>
                                                <Grid item xs={12} container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            label="Tên vai trò"
                                                            variant="outlined"
                                                            fullWidth
                                                            {...register('roleName')}
                                                            error={errors.roleName ? true : false}
                                                            helperText={errors.roleName?.message}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="Số lượng"
                                                            type="number"
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            fullWidth
                                                            {...register('numberOfRole')}
                                                            error={errors.numberOfRole ? true : false}
                                                            helperText={errors.numberOfRole?.message}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleSubmit(handleAddEventRoles)}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Thêm
                                                    </Button>
                                                    <Button variant="contained" color="error" onClick={handleCancel}>
                                                        Hủy
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Collapse>
                                    </Paper>
                                    <Collapse in={!isChecked}>
                                        <Fab
                                            color="primary"
                                            variant="extended"
                                            aria-label="add"
                                            onClick={() => setIsChecked(!isChecked)}
                                            size="medium"
                                        >
                                            <Add />
                                            Thêm vai trò
                                        </Fab>
                                    </Collapse>
                                    {/* <button disabled={!isDirty || !isValid} type="submit">
                                        Submit
                                    </button> */}
                                </Box>
                            </>
                        ) : activeStep === 2 ? (
                            <>
                                <Typography sx={{ mb: 2, fontWeight: '500' }}>
                                    Quỹ CLB: {totalClubFunds.toLocaleString()}VND
                                </Typography>
                                <Controller
                                    name="totalAmountEstimated"
                                    variant="outlined"
                                    defaultValue=""
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <NumberFormat
                                            name="cost"
                                            customInput={TextField}
                                            label="Tổng chi phí dự kiến"
                                            thousandSeparator={true}
                                            variant="outlined"
                                            defaultValue=""
                                            value={value}
                                            onValueChange={(v) => {
                                                onChange(Number(v.value));
                                                setTotalAmountEstimated(Number(v.value));
                                            }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                            }}
                                            error={invalid}
                                            helperText={invalid ? error.message : null}
                                            fullWidth
                                        />
                                    )}
                                />
                                {/* {amountPerRegister} */}
                                <Controller
                                    name="amountFromClub"
                                    variant="outlined"
                                    defaultValue=""
                                    control={control}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <NumberFormat
                                            name="amountFromClub"
                                            customInput={TextField}
                                            label="Số tiền tài trợ từ CLB"
                                            thousandSeparator={true}
                                            variant="outlined"
                                            // defaultValue=""
                                            // placeholder="12333"
                                            value={value}
                                            onValueChange={(v) => {
                                                onChange(Number(v.value));
                                                // setAmountFromClub(Number(v.value));
                                                setAmountPerRegister(Number(v.value));
                                            }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                            }}
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            fullWidth
                                        />
                                    )}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <FormControlLabel
                                        sx={{ marginLeft: '1px' }}
                                        control={
                                            <Switch
                                                checked={isAmountPerRegister}
                                                onChange={() => setIsAmountPerRegister(!isAmountPerRegister)}
                                            />
                                        }
                                        label="Yêu cầu thành viên đóng tiền"
                                    />
                                    {/* <Typography>Tổng tiền quỹ: 2.000.000 vnđ</Typography> */}
                                </Box>
                                {/* {amountPerRegister && ( */}
                                <Collapse in={isAmountPerRegister}>
                                    <Controller
                                        name="amountPerRegister"
                                        variant="outlined"
                                        // defaultValue={
                                        //     amountFromClub && (totalAmountEstimated - amountFromClub) / numOfPersonEstimated
                                        // }
                                        // defaultValue={amountPerRegister}
                                        // defaultValue=""
                                        defaultValue=""
                                        control={control}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <NumberFormat
                                                name="amountPerRegister"
                                                customInput={TextField}
                                                label="Dự kiến số tiền mỗi người cần phải đóng"
                                                thousandSeparator={true}
                                                variant="outlined"
                                                // defaultValue={a.toLocaleString()}
                                                value={value}
                                                onValueChange={(v) => {
                                                    onChange(Number(v.value));
                                                }}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                                }}
                                                error={!!error}
                                                helperText={error ? error.message : null}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Collapse>
                            </>
                        ) : activeStep === 3 ? (
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="startDate"
                                            control={control}
                                            defaultValue={null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DateTimePicker
                                                    label="Thời gian bắt đầu"
                                                    disablePast
                                                    ampm={false}
                                                    value={value}
                                                    onChange={(value) => {
                                                        onChange(value);
                                                        console.log('startDate value', value);
                                                        setStartDate(value);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            sx={{
                                                                marginTop: '0px !important',
                                                                marginBottom: '16px !important',
                                                            }}
                                                            {...params}
                                                            required
                                                            id="outlined-disabled"
                                                            error={invalid}
                                                            helperText={invalid ? error.message : null}
                                                            // id="startDate"
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="finishDate"
                                            control={control}
                                            defaultValue={null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DateTimePicker
                                                    label="Thời gian kết thúc"
                                                    disablePast
                                                    ampm={false}
                                                    value={value}
                                                    onChange={(value) => {
                                                        onChange(value);
                                                        console.log('endDate value', value);
                                                        setEndDate(value);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            sx={{
                                                                marginTop: '0px !important',
                                                                marginBottom: '16px !important',
                                                            }}
                                                            {...params}
                                                            required
                                                            id="outlined-disabled"
                                                            error={invalid}
                                                            helperText={invalid ? error.message : null}
                                                            // id="startDate"
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                {/* <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="startTime"
                                            control={control}
                                            defaultValue={null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <TimePicker
                                                    label="Thời gian bắt đầu"
                                                    // disablePast
                                                    ampm={false}
                                                    value={value}
                                                    onChange={(value) => {
                                                        onChange(value);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            sx={{
                                                                marginTop: '0px !important',
                                                                marginBottom: '16px !important',
                                                            }}
                                                            {...params}
                                                            required
                                                            id="outlined-disabled"
                                                            error={invalid}
                                                            helperText={invalid ? error.message : null}
                                                            // id="startDate"
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="finishTime"
                                            control={control}
                                            defaultValue={null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DateTimePicker
                                                    label="Thời gian kết thúc"
                                                    ampm={false}
                                                    value={value}
                                                    onChange={(value) => onChange(value)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            sx={{
                                                                marginTop: '0px !important',
                                                                marginBottom: '16px !important',
                                                            }}
                                                            {...params}
                                                            required
                                                            id="outlined-disabled"
                                                            error={invalid}
                                                            helperText={invalid ? error.message : null}
                                                            // id="startDate"
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid> */}
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="registrationMemberDeadline"
                                            control={control}
                                            defaultValue={null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DateTimePicker
                                                    label="Deadline đăng ký tham gia"
                                                    disablePast
                                                    ampm={false}
                                                    value={value}
                                                    onChange={(value) => onChange(value)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            sx={{
                                                                marginTop: '0px !important',
                                                                marginBottom: '16px !important',
                                                            }}
                                                            {...params}
                                                            required
                                                            id="outlined-disabled"
                                                            error={invalid}
                                                            helperText={invalid ? error.message : null}
                                                            // id="startDate"
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="registrationOrganizingCommitteeDeadline"
                                            control={control}
                                            defaultValue={null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DateTimePicker
                                                    label="Deadline đăng ký ban tổ chức"
                                                    disablePast
                                                    disabled={skipped.has(1)}
                                                    ampm={false}
                                                    value={value}
                                                    onChange={(value) => onChange(value)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            sx={{
                                                                marginTop: '0px !important',
                                                                marginBottom: '16px !important',
                                                            }}
                                                            {...params}
                                                            required
                                                            id="outlined-disabled"
                                                            error={invalid}
                                                            helperText={invalid ? error.message : null}
                                                            // id="startDate"
                                                            variant="outlined"
                                                            margin="dense"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>
                        ) : null}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleClose} autoFocus>
                        Xác nhận
                    </Button> */}
                    <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                        Quay lại
                    </Button>
                    {/* <Box>
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Bỏ qua
                            </Button>
                        )}
                        {activeStep === steps.length - 1 ? (
                            <Button>Tạo sự kiện</Button>
                        ) : !isChecked ? (
                            <Button onClick={handleNext}>
                                {activeStep === steps.length - 2 ? 'Xem trước' : 'Tiếp tục'}
                            </Button>
                        ) : (
                            <Button onClick={handleNext} disabled={!isValid}>
                                {activeStep === steps.length - 2 ? 'Xem trước' : 'Tiếp tục'}
                            </Button>
                        )}
                    </Box> */}
                    <Box>
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Bỏ qua
                            </Button>
                        )}
                        {activeStep === steps.length - 1 ? (
                            <Button>Tạo sự kiện</Button>
                        ) : activeStep === 1 ? (
                            <Button onClick={handleNext} disabled={datas.length === 0}>
                                {activeStep === steps.length - 2 ? 'Xem trước' : 'Tiếp tục'}
                            </Button>
                        ) : activeStep === 2 ? (
                            <Button onClick={handleNext} disabled={!thirdStepStatus}>
                                {activeStep === steps.length - 2 ? 'Xem trước' : 'Tiếp tục'}
                            </Button>
                        ) : (
                            <Button
                                onClick={activeStep === steps.length - 2 ? handlePreview : handleNext}
                                disabled={!isValid}
                            >
                                {activeStep === steps.length - 2 ? 'Xem trước' : 'Tiếp tục'}
                            </Button>
                        )}
                    </Box>

                    {/* <Button onClick={handleNext}>{steps.length === 3 ? 'Xem trước' : 'Tiếp tục'}</Button> */}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default AddEventDialog;
