import {
    Box,
    FormControlLabel,
    Switch,
    TextField,
    Typography,
    Grid,
    Collapse,
    Button,
    InputAdornment,
    InputLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { forwardRef, Fragment, useState } from 'react';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import styles from './Event.module.scss';
import classNames from 'classnames/bind';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function AddEvent() {
    const [isChecked, setIsChecked] = useState(false);
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState();
    const [cash, setCash] = useState();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Không được để trống trường này'),
        maxQuantityComitee: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        numOfParticipants: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        startTime: Yup.string().nullable().required('Không được để trống trường này'),
        finishTime: Yup.string().nullable().required('Không được để trống trường này'),
        cost: Yup.string().required('Không được để trống trường này'),
        ...(isChecked && {
            cash: Yup.string().required('Không được để trống trường này'),
        }),
    });
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    const onSubmit = (data) => {
        let dataSubmit = {
            maxQuantityComitee: data.maxQuantityComitee,
            description: description,
            finishTime: moment(new Date(data.finishTime)).format('YYYY-MM-DD[T]HH:mm:ss'),
            numOfParticipants: data.numOfParticipants,
            name: data.name,
            startTime: moment(new Date(data.startTime)).format('YYYY-MM-DD[T]HH:mm:ss'),
            cash: data.cash,
            cost: data.cost,
        };
        console.log(dataSubmit);
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
            <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 500, marginBottom: 2 }}>
                Thêm sự kiện mới
            </Typography>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { mb: 2 },
                    display: 'flex',
                    justifyContent: 'center',
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <Box sx={{ width: '50%' }}>
                    <TextField
                        id="outlined-basic"
                        label="Tên sự kiện"
                        variant="outlined"
                        fullWidth
                        {...register('name')}
                        error={errors.name ? true : false}
                        helperText={errors.name?.message}
                    />
                    <Grid container columns={12} spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                id="outlined-basic"
                                label="Dự kiến số người tham gia"
                                variant="outlined"
                                fullWidth
                                {...register('numOfParticipants')}
                                error={errors.numOfParticipants ? true : false}
                                helperText={errors.numOfParticipants?.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                id="outlined-basic"
                                label="Số người ban tổ chức"
                                variant="outlined"
                                fullWidth
                                {...register('maxQuantityComitee')}
                                error={errors.maxQuantityComitee ? true : false}
                                helperText={errors.maxQuantityComitee?.message}
                            />
                        </Grid>
                    </Grid>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                        <Grid container columns={12} spacing={2}>
                            <Grid item xs={6}>
                                <Controller
                                    required
                                    name="startTime"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <DateTimePicker
                                            label="Thời gian bắt đầu"
                                            disableFuture
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
                                    name="finishTime"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                        <DateTimePicker
                                            label="Thời gian kết thúc"
                                            disableFuture
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
                    {/* <Controller as={NumberFormat} thousandSeparator name="price" control={control} /> */}
                    {/* <TextField
                        id="outlined-basic"
                        label="Tổng chi phí tổ chức"
                        variant="outlined"
                        fullWidth
                        {...register('cost')}
                        error={errors.cost ? true : false}
                        helperText={errors.cost?.message}
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                            endAdornment: <InputAdornment position="start">vnđ</InputAdornment>,
                        }}
                    /> */}
                    {/* <NumberFormat
                        name="cost"
                        label="Tổng chi phí tổ chức"
                        customInput={TextField}
                        variant="outlined"
                        thousandSeparator={true}
                        autoComplete="off"
                        fullWidth
                        // value={cost}
                        value="123,123,123"
                        onChange={(e) => setCost(e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
                        }}
                        error={errors.cost ? true : false}
                        helperText={errors.cost?.message}
                    /> */}
                    <Controller
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
                                    endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
                                }}
                                error={invalid}
                                helperText={invalid ? error.message : null}
                                fullWidth
                            />
                        )}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <FormControlLabel
                            sx={{ marginLeft: '1px' }}
                            control={<Switch checked={isChecked} onChange={() => setIsChecked(!isChecked)} />}
                            label="Sử dụng tiền quỹ"
                        />
                        <Typography>Tổng tiền quỹ: 2.000.000 vnđ</Typography>
                    </Box>
                    <Collapse in={isChecked}>
                        <Controller
                            name="cash"
                            variant="outlined"
                            defaultValue=""
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                                <NumberFormat
                                    name="cost"
                                    customInput={TextField}
                                    label="Dùng quỹ CLB"
                                    thousandSeparator={true}
                                    onValueChange={(v) => {
                                        onChange(Number(v.value));
                                    }}
                                    variant="outlined"
                                    defaultValue=""
                                    value={value}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">vnđ</InputAdornment>,
                                    }}
                                    error={invalid}
                                    helperText={invalid ? error.message : null}
                                    fullWidth
                                />
                            )}
                        />
                    </Collapse>
                    <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                        Dự kiến mỗi người phải đóng: 160k
                    </Typography>
                    <TextField
                        id="outlined-multiline-flexible"
                        name="description"
                        control={control}
                        label="Nội dung"
                        multiline
                        maxRows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        // {...register('content')}
                    />
                    <div className={cx('create-event-button')}>
                        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                            Tạo sự kiện
                        </Button>
                    </div>
                </Box>
            </Box>
        </Fragment>
    );
}

export default AddEvent;
