import {
    Box,
    ButtonGroup,
    Button,
    Typography,
    TextField,
    Grid,
    Snackbar,
    Alert,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import vi from 'date-fns/locale/vi';
import trainingSchedule from 'src/api/trainingScheduleApi';
import moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import EditIcon from '@mui/icons-material/Edit';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';

function ViewSession({ title, children, isOpen, handleClose, onSucess, date, trainingId }) {
    const [open, setOpen] = useState(false);
    // const { scheduleId } = useParams();
    const [scheduleList, setScheduleList] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    let navigate = useNavigate();
    const fetchSchedule = async (date) => {
        try {
            const response = await trainingSchedule.getTrainingSessionByDate(date);
            setScheduleList(response.data);
        } catch (error) {
            console.log('That bai roi huhu ', error);
        }
    };
    useEffect(() => {
        fetchSchedule(moment(date).format('DD/MM/yyyy'));
    }, [date]);

    const handleNavigate = () => {
        navigate(
            { pathname: '../admin/attendance' },
            { state: { date: moment(date).format('DD/MM/YYYY'), id: trainingId } },
        );
    };

    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {},
    });

    return (
        <Box>
            <Dialog
                fullWidth
                maxWidth="xs"
                // keepMounted
                open={!!isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {title}
                    {/* <Tooltip title="Xóa lịch tập">
                        <IconButton aria-label="delete" onClick={handleClickOpen}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip> */}
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">{facilityId}</DialogContentText> */}
                    {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Chỉnh sửa lịch tập">
                            <IconButton aria-label="delete" onClick={() => setIsEdit(true)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </Box> */}
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={
                            {
                                // '& .MuiTextField-root': { mt: 0 },
                            }
                        }
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                <Box
                                    component="form"
                                    noValidate
                                    // onSubmit={}
                                    sx={{ width: '100%', mt: 1 }}
                                >
                                    {scheduleList.map((item) => {
                                        return (
                                            <Grid container spacing={1} columns={12} key={item.id}>
                                                <Grid item sm={12}>
                                                    <TextField
                                                        disabled
                                                        id="outlined-disabled"
                                                        label="Ngày tháng"
                                                        defaultValue={moment(item.date).format('DD/MM/yyyy')}
                                                        fullWidth
                                                        {...register('date')}
                                                        error={errors.date ? true : false}
                                                        helperText={errors.date?.message}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12}>
                                                    <Controller
                                                        required
                                                        name="startTime"
                                                        control={control}
                                                        defaultValue={new Date(`2022-11-12T${item.startTime}`)}
                                                        render={({
                                                            field: { onChange, value },
                                                            fieldState: { error, invalid },
                                                        }) => (
                                                            <TimePicker
                                                                disabled={!isEdit}
                                                                label="Thời gian bắt đầu"
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
                                                                        margin="dense"
                                                                        fullWidth
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                                                    <Controller
                                                        required
                                                        name="finishTime"
                                                        control={control}
                                                        defaultValue={new Date(`2022-11-12T${item.finishTime}`)}
                                                        render={({
                                                            field: { onChange, value },
                                                            fieldState: { error, invalid },
                                                        }) => (
                                                            <TimePicker
                                                                label="Thời gian kết thúc"
                                                                disabled={!isEdit}
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
                                                                        margin="dense"
                                                                        fullWidth
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                                </Box>
                            </LocalizationProvider>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleClose} sx={{ mr: 1 }}>
                        Quay lại
                    </Button>
                    <Button onClick={() => handleNavigate()} sx={{ mr: 1 }}>
                        Thông tin điểm danh
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ViewSession;
