import {
    Alert,
    Box,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Radio,
    RadioGroup,
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
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useRef } from 'react';
import eventApi from 'src/api/eventApi';
import PreviewSchedule from './PreviewSchedule';
import adminFunAPi from 'src/api/adminFunAPi';
import { useNavigate } from 'react-router-dom';
import PreviewCommonSchedule from '../Tournament/CreateTournament/Schedule/Schedule';
import EditableSchedule from '../Tournament/CreateTournament/Schedule/EditableSchedule';
import EditRole from './EditRole';

const steps = ['Thông tin sự kiện', 'Thêm vai trò BTC', 'Thêm chi phí', 'Thêm lịch', 'Xem trước'];
const AddEventDialog = ({ title, children, isOpen, handleClose, onSucess, roles, user }) => {
    const max = '2200-12-31';
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const min = moment(tomorrow).format('yyyy-MM-DD');

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [activeStep, setActiveStep] = useState(0);
    const [description, setDescription] = useState('');
    const [skipped, setSkipped] = useState(new Set());
    const [isChecked, setIsChecked] = useState(false);
    const [datas, setDatas] = useState(roles);
    const [isAmountPerRegister, setIsAmountPerRegister] = useState(false);
    const [totalClubFunds, setTotalClubFunds] = useState(20000);
    const [previewSchedule, setPreviewSchedule] = useState([]);
    const [previewEvent, setPreviewEvent] = useState([]);
    //-------
    const [existedDate, setExistedDate] = useState([]);
    const [submitOption, setSubmitOption] = useState(0);
    const [isOpenPreviewDialog, setIsOpenPreviewDialog] = useState(false);
    const [isEditableSchedule, setIsEditableSchedule] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [preview, setPreview] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [isOverride, setIsOverride] = useState(-1);
    const [dataEdit, setDataEdit] = useState();
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        setDatas(roles);
    }, [roles]);

    const handleChange = (event) => {
        setSubmitOption(event.target.value);
    };
    const getClubFund = async () => {
        try {
            const response = await adminFunAPi.getClubFund();
            console.log('getClubFund', response);
            setTotalClubFunds(response.data[0].fundAmount);
        } catch (error) {
            console.log('failed at getClubFund', error);
        }
    };

    const checkOverride = (TournamentSchedule) => {
        const arrayCheck = TournamentSchedule.map((item) => {
            if (item.title.toString() === 'Trùng với Lịch tập') {
                return 2;
            } else if (item.title.toString().includes('Trùng với')) {
                return 1;
            } else {
                return -1;
            }
        });
        console.log('arrayCheck', arrayCheck);
        if (arrayCheck.find((item) => item === 1)) {
            console.log('check', 1);
            setDisabled(true);
            setIsOverride(1);
        } else {
            if (arrayCheck.find((item) => item === 2)) {
                console.log('check', 2);
                setDisabled(true);
                setIsOverride(2);
                // isStepFailed(4);
            } else {
                console.log('check', -1);
                setDisabled(false);
                setIsOverride(-1);
            }
        }
    };
    let navigate = useNavigate();
    const isStepFailed = (step) => {
        return step === 3;
    };
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
                  name: Yup.string().trim().required('Không được để trống trường này'),
              }
            : activeStep === 1
            ? {
                  roleName: Yup.string()
                      .trim()
                      .nullable()
                      .required('Không được để trống trường này')
                      .test('len', 'Độ dài không cho phép', (val) => val.length > 1)
                      .matches(
                          /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹẾỀếề ]+$/,
                          'Không hợp lệ: vui lòng nhập chữ',
                      ),
                  maxQuantity: Yup.number()
                      .nullable()
                      .required('Không được để trống trường này')
                      .min(1, 'Vui lòng nhập giá trị lớn hơn 0')
                      .max(1000, 'Số lượng không hợp lệ')
                      .typeError('Không được để trống trường này'),
              }
            : activeStep === 2
            ? {
                  amountFromClub: Yup.number()
                      .required('Không được để trống trường này')
                      .min(0, 'Vui lòng nhập giá trị lớn hơn 0')
                      .max(totalClubFunds, 'Tiền quỹ CLB không đủ')
                      .typeError('Vui lòng nhập giá trị lớn hơn 1000'),
                  totalAmountEstimated: Yup.number()
                      .required('Không được để trống trường này')
                      .min(1000, 'Vui lòng nhập giá trị lớn hơn 1000')
                      .typeError('Vui lòng nhập giá trị lớn hơn 1000')
                      .max(100000000, 'Giá trị không hợp lệ'),
                  ...(isAmountPerRegister
                      ? {
                            amountPerRegister: Yup.number()
                                .required('Không được để trống trường này')
                                .typeError('Vui lòng nhập số')
                                .min(1000, 'Vui lòng nhập giá trị lớn hơn 1000')
                                .typeError('Vui lòng nhập giá trị lớn hơn 1000')
                                .max(100000000, 'Giá trị không hợp lệ'),
                        }
                      : null),
              }
            : activeStep === 3
            ? {
                  startDate: Yup.date()
                      .min(min, 'Vui lòng không nhập ngày trong quá khứ')
                      .max(max, 'Vui lòng không nhập ngày với số năm quá lớn')
                      //   .max(Yup.ref('finishDate'), ({ min }) => `Thời gian bắt không được bé hơn thời gian kết thúc`)
                      .typeError('Vui lòng nhập đúng định dạng')
                      .required('Vui lòng không để trống trường này'),

                  //   finishDate: Yup.date()
                  //       .min(Yup.ref('startDate'), ({ min }) => `Thời gian kết thúc không được sớm hơn thời gian bắt đầu`)
                  //       .typeError('Vui lòng không để trống trường này')
                  //       .required('Vui lòng không để trống trường này'),
                  finishDate: Yup.date()
                      .max(max, 'Vui lòng không nhập ngày với số năm quá lớn')
                      .test('same_dates_test', 'Thời gian kết thúc phải muộn hơn thời gian bắt đầu', function (value) {
                          const { startDate } = this.parent;
                          return value.getTime() !== startDate.getTime();
                      })
                      .min(Yup.ref('startDate'), ({ min }) => `Thời gian kết thúc phải muộn hơn thời gian bắt đầu`)
                      .required('Vui lòng không để trống trường này')
                      .typeError('Vui lòng nhập đúng định dạng')
                      .required('Vui lòng không để trống trường này'),

                  registrationMemberDeadline: Yup.date()
                      .min(min, 'Vui lòng không nhập ngày trong quá khứ')
                      .max(Yup.ref('startDate'), ({ max }) => `Deadline phải sớm hơn thời gian bắt đầu`)
                      .typeError('Vui lòng nhập đúng định dạng')
                      .required('Vui lòng không để trống trường này'),
                  ...(!skipped.has(1)
                      ? {
                            registrationOrganizingCommitteeDeadline: Yup.date()
                                .min(min, 'Vui lòng không nhập ngày trong quá khứ')
                                .max(
                                    Yup.ref('startDate'),
                                    ({ min }) => `Deadline đăng ký BTC phải sớm hơn thời gian bắt đầu`,
                                )
                                .typeError('Vui lòng nhập đúng định dạng')
                                .required('Vui lòng không để trống trường này')
                                .test(
                                    'same_dates_test',
                                    'Deadline đăng ký BTC phải sớm hơn thời gian bắt đầu',
                                    function (value) {
                                        const { startDate } = this.parent;
                                        return value.getTime() !== startDate.getTime();
                                    },
                                )
                                .test(
                                    'deadline_test',
                                    'Deadline đăng ký BTC phải muộn hơn deadline đăng ký tham gia',
                                    function (value) {
                                        const { registrationMemberDeadline } = this.parent;
                                        return value.getTime() <= registrationMemberDeadline.getTime();
                                    },
                                ),
                        }
                      : null),
              }
            : null),
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        resetField,
        setFocus,
        setError,
        clearErrors,
        formState: { errors, isDirty, isValid },
    } = useForm({
        resolver: yupResolver(validationSchema),

        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const handleDelete = (id) => {
        // datas.map((data) => {
        //     return data.id === id;
        // });
        setDatas((prevRows) => prevRows.filter((item) => item.id !== id));
    };

    const handleEdit = (role) => {
        // datas.map((data) => {
        //     return data.id === id;
        // });
        const data = datas.filter((item) => item.id !== role.id);
        const dataEdit = datas.filter((item) => item.id === role.id);
        setDataEdit(dataEdit[0]);
        setIsEdit(true);
        setIsChecked(!isChecked);
    };

    const handleAddEventRoles = (data) => {
        console.log(data);
        const newData = [...datas, { id: Math.random(), name: data.roleName, maxQuantity: data.maxQuantity }];
        setDatas(newData);

        /**
         * Reset field keep error (isValid)
         */
        resetField('roleName', { keepError: true });
        resetField('maxQuantity', { keepError: true });

        setIsChecked(!isChecked);
    };

    const handleEditEventRoles = (data) => {
        console.log(data);
        if (
            datas.findIndex((d) => d.name.includes(data.roleName)) >= 0 &&
            datas.findIndex((d) => d.maxQuantity == data.maxQuantity) >= 0
        ) {
            setError('maxQuantity', {
                message: 'Số lượng sau chỉnh sửa không thay đổi',
            });
            return;
        }

        const newData = datas.map((role) => (role.id == data.id ? { ...role, maxQuantity: data.maxQuantity } : role));
        setDatas(newData);

        /**
         * Reset field keep error (isValid)
         */

        resetField('roleName', { keepError: true });
        resetField('maxQuantity', { keepError: true });

        isEdit && setIsEdit(false);
        setIsChecked(!isChecked);
    };

    const handleCancel = () => {
        setIsChecked(!isChecked);

        resetField('roleName', { keepError: true });
        resetField('maxQuantity', { keepError: true });
    };

    console.log('isValid', isValid);
    const formRef = useRef(null);
    /**
     * Preview Event
     */
    const handlePreviewSchedule = (data) => {
        setPreviewEvent(data);
        let formatData = {
            name: data.name,
            startTime: moment(new Date(data.startDate)).format('HH:mm:ss'),
            finishTime: moment(new Date(data.finishDate)).format('HH:mm:ss'),
            startDate: moment(new Date(data.startDate)).format('DD/MM/yyyy'),
            finishDate: moment(new Date(data.finishDate)).format('DD/MM/yyyy'),
        };
        setPreview(formatData);

        console.log('format Data', formatData);
    };

    useEffect(() => {
        eventApi.createPreviewEvent(preview).then((response) => {
            if (response.data.length != 0) {
                console.log(response.data);
                setPreviewSchedule(response.data);
                // setPreviewTournament(res.data);
                checkOverride(response.data);
                let existedDate = response.data.filter((i) => i.existed);
                setExistedDate(existedDate);
                if (activeStep < 4) {
                    handleNext();
                }
            } else {
                console.log('huhu');
                // setError('startDate', {
                //     message: response.message,
                // });
            }
            console.log('fetch preview schedule data', response);
            setPreviewSchedule(response.data);
            setIsUpdate(false);
        });
    }, [preview, isUpdate]);
    /**
     * Create Event
     */
    const handleCreateEvent = (data) => {
        const createEventData = {
            event: {
                name: data.name,
                description: data.description,
                totalAmountEstimated: data.totalAmountEstimated,
                amountPerRegisterEstimated: data.amountPerRegister,
                amountFromClub: data.amountFromClub,
                ...(skipped.has(1)
                    ? null
                    : {
                          registrationOrganizingCommitteeDeadline: moment(
                              data.registrationOrganizingCommitteeDeadline,
                          ).format('yyyy-MM-DDTHH:mm:ss'),
                      }),
                registrationMemberDeadline: moment(data.registrationMemberDeadline).format('yyyy-MM-DDTHH:mm:ss'),
            },
            ...(skipped.has(1)
                ? {
                      rolesEventDto: [],
                  }
                : {
                      rolesEventDto: datas,
                  }),
            // rolesEventDto: datas,
            listPreview: previewSchedule,
        };
        eventApi.createEvent(createEventData, user.studentId).then((response) => {
            if (response.data.length !== 0) {
                console.log(response);
                enqueueSnackbar(response.message, { variant: 'success' });
                navigate(`/admin/events/${response.data[0].id}`);
            } else {
                console.log(response);
                enqueueSnackbar(response.message, { variant: 'error' });
            }
        });
        console.log(data);
        console.log('submit event data', createEventData);
    };

    const eventSchedule = previewSchedule.map((item, index) => {
        const container = {};
        container['id'] = index;
        container['date'] = item.date;
        container['title'] = item.title;
        container['time'] = item.startTime.slice(0, 5) + ' - ' + item.finishTime.slice(0, 5);
        container['description'] = item.title;
        container['display'] = 'background';
        // container['backgroundColor'] = isOverride === -1 || isOverride === 0 ? '#5ba8f5' : '#ff3d00';
        container['backgroundColor'] = item.existed ? '#ffb199' : '#ccffe6';

        return container;
    });
    /**
     * Revalidate form after step changed
     */
    useEffect(() => {
        control._updateValid();
    }, [activeStep, control]);

    useEffect(() => {
        console.log('skip', skipped);
        if (skipped.has(1)) {
            resetField('registrationOrganizingCommitteeDeadline');
        }
    }, [activeStep, skipped, resetField]);

    useEffect(() => {
        getClubFund();
    }, []);

    // useEffect(() => {
    //     if (activeStep === 3) {
    //         clearErrors('registrationOrganizingCommitteeDeadline');
    //     }
    // }, [activeStep]);

    return (
        <Fragment>
            <PreviewCommonSchedule isOpen={isOpenPreviewDialog} handleClose={() => setIsOpenPreviewDialog(false)} />

            {isEditableSchedule && (
                <EditableSchedule
                    isOpen={isEditableSchedule}
                    handleClose={() => {
                        setIsEditableSchedule(false);
                        // handleSubmit(handlePreviewSchedule);
                        // handlePreviewSchedule();
                        // handleSubmit(handlePreviewSchedule);

                        setIsUpdate(true);
                    }}
                    initialDate={eventSchedule[0] && new Date(eventSchedule[0].date)}
                    description={existedDate}
                />
            )}
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
                                if (isOverride !== -1) {
                                    if (isStepFailed(index)) {
                                        labelProps.optional = (
                                            <Typography variant="caption" color="error">
                                                Bị trùng
                                            </Typography>
                                        );

                                        labelProps.error = true;
                                    }
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
                                {/* <Typography sx={{ mt: 2, mb: 1 }}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={handleReset}>Reset</Button>
                                </Box> */}
                                <Grid container sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Box>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ fontSize: '16px', fontWeight: '700' }}
                                                >
                                                    Tên sự kiện:{' '}
                                                </Typography>
                                                <span>{previewEvent.name}</span>
                                            </Box>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ fontSize: '16px', fontWeight: '700' }}
                                                >
                                                    Nội dung:{' '}
                                                </Typography>
                                                <span>{previewEvent.description}</span>
                                            </Box>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ fontSize: '16px', fontWeight: '700' }}
                                                >
                                                    Vai trò trong sự kiện:{' '}
                                                </Typography>
                                                {skipped.has(1) ? (
                                                    <span>Không có</span>
                                                ) : (
                                                    <>
                                                        <br />
                                                        <ul>
                                                            {datas.map((role) => {
                                                                return (
                                                                    <li key={role.id}>
                                                                        {role.name} - {role.maxQuantity} người
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </>
                                                )}
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box>
                                            {!skipped.has(2) ? (
                                                <>
                                                    <Box>
                                                        <Typography
                                                            component="span"
                                                            sx={{ fontSize: '16px', fontWeight: '700' }}
                                                        >
                                                            Tổng chi phí dự kiến:{' '}
                                                        </Typography>
                                                        <span>
                                                            {previewEvent.totalAmountEstimated.toLocaleString()} VND
                                                        </span>
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            component="span"
                                                            sx={{ fontSize: '16px', fontWeight: '700' }}
                                                        >
                                                            Số tiền tài trợ từ CLB:{' '}
                                                        </Typography>
                                                        <span>{previewEvent.amountFromClub.toLocaleString()} VND</span>
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            component="span"
                                                            sx={{ fontSize: '16px', fontWeight: '700' }}
                                                        >
                                                            Yêu cầu thành viên đóng tiền:{' '}
                                                        </Typography>
                                                        {!previewEvent.amountPerRegister ? (
                                                            <span>Không</span>
                                                        ) : (
                                                            <>
                                                                {previewEvent.amountPerRegister.toLocaleString()} VND
                                                                (dự kiến)
                                                            </>
                                                        )}
                                                    </Box>
                                                </>
                                            ) : null}
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ fontSize: '16px', fontWeight: '700' }}
                                                >
                                                    Thời gian bắt đầu:{' '}
                                                </Typography>
                                                <span>
                                                    {moment(new Date(previewEvent.startDate)).format(
                                                        'HH:ss - DD/MM/yyyy',
                                                    )}
                                                </span>
                                            </Box>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ fontSize: '16px', fontWeight: '700' }}
                                                >
                                                    Thời gian kết thúc:{' '}
                                                </Typography>
                                                <span>
                                                    {moment(new Date(previewEvent.finishDate)).format(
                                                        'HH:ss - DD/MM/yyyy',
                                                    )}
                                                </span>
                                            </Box>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ fontSize: '16px', fontWeight: '700' }}
                                                >
                                                    Deadline đăng ký tham gia:{' '}
                                                </Typography>

                                                <span>
                                                    {moment(new Date(previewEvent.registrationMemberDeadline)).format(
                                                        'HH:ss - DD/MM/yyyy',
                                                    )}
                                                </span>
                                            </Box>
                                            <Box>
                                                {skipped.has(1) ? null : (
                                                    <>
                                                        <Typography
                                                            component="span"
                                                            sx={{ fontSize: '16px', fontWeight: '700' }}
                                                        >
                                                            Deadline đăng ký ban tổ chức:{' '}
                                                        </Typography>
                                                        <span>
                                                            {moment(
                                                                new Date(
                                                                    previewEvent.registrationOrganizingCommitteeDeadline,
                                                                ),
                                                            ).format('HH:ss - DD/MM/yyyy')}
                                                        </span>
                                                    </>
                                                )}
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                                {isOverride === 3 || isOverride === 2 ? (
                                    <>
                                        <Typography color="error">
                                            <strong>
                                                Ngày{' '}
                                                {existedDate.map((i) => moment(i.date).format('DD/MM/yyyy') + ', ')}
                                                đang trùng với lịch tập, vui lòng lựa chọn:
                                            </strong>
                                        </Typography>
                                        <FormControl>
                                            {/* <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel> */}
                                            <RadioGroup
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="controlled-radio-buttons-group"
                                                value={submitOption}
                                                onChange={handleChange}
                                            >
                                                <FormControlLabel value={0} control={<Radio />} label="Bỏ lịch tập" />
                                                <FormControlLabel
                                                    value={1}
                                                    control={<Radio onClick={() => setIsEditableSchedule(true)} />}
                                                    label="Thay đổi lịch tập"
                                                />
                                                <FormControlLabel
                                                    value={2}
                                                    control={<Radio onClick={handleBack} />}
                                                    label="Chỉnh sửa thời gian giải đấu"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </>
                                ) : isOverride === 1 ? (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography color="error">
                                            <strong>
                                                Không thể tạo Sự kiện (lịch bị trùng với Sự kiện hoặc giải đấu khác) vui
                                                lòng chọn lại ngày !
                                            </strong>
                                        </Typography>
                                        <Button onClick={handleBack}>Chọn lại ngày</Button>
                                    </Box>
                                ) : (
                                    ''
                                )}
                                <Box sx={{ height: '50vh', ml: 0 }}>
                                    <PreviewSchedule
                                        dataPreview={eventSchedule}
                                        initialDate={eventSchedule[0] && new Date(eventSchedule[0].date)}
                                    />
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
                                                <caption style={{ captionSide: 'top' }}>
                                                    Số lượng vai trò hiện tại : {datas.length}
                                                </caption>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">Tên vai trò</TableCell>
                                                        <TableCell align="center">Số lượng</TableCell>
                                                        <TableCell align="center"></TableCell>
                                                        <TableCell align="center"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {datas.map((data) => (
                                                        <TableRow key={data.id}>
                                                            <TableCell align="center">{data.name}</TableCell>
                                                            <TableCell align="center">{data.maxQuantity}</TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    aria-label="edit"
                                                                    onClick={() => {
                                                                        // handleOpenDialog();
                                                                        handleEdit(data);
                                                                    }}
                                                                    disabled={isEdit || isChecked}
                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                            </TableCell>
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
                                            {!isEdit ? (
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
                                                                {...register('maxQuantity')}
                                                                error={errors.maxQuantity ? true : false}
                                                                helperText={errors.maxQuantity?.message}
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
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            onClick={handleCancel}
                                                        >
                                                            Hủy
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            ) : (
                                                dataEdit && (
                                                    <EditRole
                                                        roleEdit={dataEdit}
                                                        onEdit={handleEditEventRoles}
                                                        onCancel={handleCancel}
                                                    />
                                                )
                                            )}
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
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                                                // setTotalAmountEstimated(Number(v.value));
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
                                                // setAmountPerRegister(Number(v.value));
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
                                                onChange={() => {
                                                    setIsAmountPerRegister(!isAmountPerRegister);
                                                }}
                                                // onClick={() => {
                                                //     setFocus('amountPerRegister');
                                                // }}
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
                                        // defaultValue="0"
                                        control={control}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <NumberFormat
                                                name="amountPerRegister"
                                                customInput={TextField}
                                                label="Dự kiến số tiền mỗi người cần phải đóng"
                                                thousandSeparator={true}
                                                variant="outlined"
                                                // defaultValue={0}
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
                                <Button sx={{ mb: 1 }} onClick={() => setIsOpenPreviewDialog(true)}>
                                    Xem lịch chung
                                </Button>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="startDate"
                                            control={control}
                                            defaultValue={null}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <DateTimePicker
                                                    label="Thời gian bắt đầu"
                                                    disablePast
                                                    ampm={false}
                                                    value={value}
                                                    onChange={(value) => {
                                                        onChange(value);
                                                        console.log('startDate value', value);
                                                        // setStartDate(value);
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
                                                            error={!!error}
                                                            helperText={error ? error.message : null}
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
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <DateTimePicker
                                                    label="Thời gian kết thúc"
                                                    disablePast
                                                    ampm={false}
                                                    value={value}
                                                    onChange={(value) => {
                                                        onChange(value);
                                                        console.log('endDate value', value);
                                                        // setEndDate(value);
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
                                                            error={!!error}
                                                            helperText={error ? error.message : null}
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

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Controller
                                            required
                                            name="registrationMemberDeadline"
                                            control={control}
                                            defaultValue={null}
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                                                            error={!!error}
                                                            helperText={error ? error.message : null}
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
                                            defaultValue={skipped.has(1) ? null : null}
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
                    {activeStep === 0 ? (
                        <Button
                            color="error"
                            onClick={() => {
                                handleClose();
                                reset();
                            }}
                            sx={{ mr: 1 }}
                        >
                            Hủy bỏ
                        </Button>
                    ) : (
                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                            Quay lại
                        </Button>
                    )}

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
                            <Button onClick={handleSubmit(handleCreateEvent)}>Tạo sự kiện</Button>
                        ) : activeStep === 1 ? (
                            <Button onClick={handleNext} disabled={datas.length === 0}>
                                {activeStep === steps.length - 2 ? 'Xem trước' : 'Tiếp tục'}
                            </Button>
                        ) : activeStep === 3 ? (
                            <Button
                                onClick={handleSubmit(handlePreviewSchedule)}
                                // disabled={!isValid}
                            >
                                Xem trước
                            </Button>
                        ) : (
                            <Button onClick={handleNext} disabled={!isValid}>
                                {/* {activeStep === steps.length - 2 ? 'Xem trước' : 'Tiếp tục'} */}
                                Tiếp tục
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
