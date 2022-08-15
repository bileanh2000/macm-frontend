import { Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { Box } from '@mui/system';

function UpdateTimeAndArea({ areaList, match, name, onClose, onUpdate }) {
    const [areaName, setAreaId] = useState(name);

    const validationSchema = Yup.object().shape({
        date: Yup.string().nullable().required('Không được để trống trường này'),
        startTime: Yup.string().nullable().required('Không được để trống trường này'),
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setFocus,
        setError,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const handleUpdate = (data) => {
        console.log('time');
        const date = moment(data.date).format('YYYY-MM-DD');
        const time = moment(data.startTime).format('HH:mm:ss');
        const dateTime = date + 'T' + time;
        const areaId = areaList.filter((area) => area.name == areaName)[0];
        const request = { time: dateTime, area: areaId };
        console.log(request);
        match.time = dateTime;
        //updateTimeAndPlace(match.id, request);
        // var merged = [].concat.apply([], __matches);
        // params.onUpdateResult(merged);
        onUpdate(request);
        onClose();
    };

    const handleChangeAreaName = (event) => {
        setAreaId(event.target.value);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Grid container spacing={3} columns={12} sx={{ mt: 2, alignItems: 'flex-end' }}>
                <Grid item xs={12} sm={4}>
                    <FormControl size="medium">
                        <Typography variant="caption">Sân thi đấu</Typography>
                        <Select id="demo-simple-select" value={areaName} displayEmpty onChange={handleChangeAreaName}>
                            {areaList.map((area) => (
                                <MenuItem value={area.name} key={area.id}>
                                    {area.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Controller
                        required
                        name="date"
                        control={control}
                        defaultValue={moment(match.time).format('MM/DD/yyyy')}
                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                            <DatePicker
                                disablePast
                                label="Ngày thi đấu"
                                inputFormat="dd/MM/yyyy"
                                disableFuture={false}
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
                <Grid item xs={12} sm={4}>
                    <Controller
                        required
                        name="startTime"
                        control={control}
                        defaultValue={match.time ? new Date(match.time) : null}
                        render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                            <TimePicker
                                label="Thời gian thi đấu"
                                ampm={false}
                                // inputFormat="HH:mm"
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
            <Box sx={{ float: 'right' }}>
                <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
                    Hủy bỏ
                </Button>
                <Button variant="contained" onClick={handleSubmit(handleUpdate)}>
                    Đồng ý
                </Button>
            </Box>
        </LocalizationProvider>
    );
}

export default UpdateTimeAndArea;
