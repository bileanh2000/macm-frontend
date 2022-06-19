import { Box, FormControlLabel, Switch, TextField, Typography, Grid, Collapse, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Fragment, useState } from 'react';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import styles from './Event.module.scss';
import classNames from 'classnames/bind';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';

const cx = classNames.bind(styles);

function AddEvent() {
    const [isChecked, setIsChecked] = useState(false);
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    const validationSchema = Yup.object().shape({});
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
            btc: data.btc,
            content: value,
            finishTime: data.finishTime,
            joined: data.joined,
            name: data.name,
            startTime: data.startTime,
            tienquy: data.tienquy,
        };
        console.log(dataSubmit);
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
                    />
                    <Grid container columns={12} spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                id="outlined-basic"
                                label="Dự kiến số người tham gia"
                                variant="outlined"
                                fullWidth
                                {...register('joined')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="outlined-basic"
                                label="Số người ban tổ chức"
                                variant="outlined"
                                fullWidth
                                {...register('btc')}
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
                    <TextField id="outlined-basic" label="Tổng chi phí tổ chức" variant="outlined" fullWidth />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <FormControlLabel
                            sx={{ marginLeft: '1px' }}
                            control={<Switch checked={isChecked} onChange={() => setIsChecked(!isChecked)} />}
                            label="Sử dụng tiền quỹ"
                        />
                        <Typography>Tổng tiền quỹ: 2.000.000 vnđ</Typography>
                    </Box>
                    <Collapse in={isChecked}>
                        <TextField
                            id="outlined-basic"
                            label="Dùng tiền quỹ"
                            variant="outlined"
                            fullWidth
                            {...register('tienquy')}
                        />
                    </Collapse>
                    <Typography sx={{ marginLeft: '10px', fontWeight: 500, mb: 2 }} variant="body1">
                        Dự kiến mỗi người phải đóng: 160k
                    </Typography>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Nội dung"
                        multiline
                        maxRows={4}
                        value={value}
                        onChange={handleChange}
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
