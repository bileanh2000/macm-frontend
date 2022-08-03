import React, { useEffect, useState } from 'react';
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Icon,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import moment from 'moment';
import { Box } from '@mui/system';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NumberFormat from 'react-number-format';
import { SportsScore } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import adminTournament from 'src/api/adminTournamentAPI';

function TableMatch(params) {
    console.log(params.matches);
    const [matches, setMatches] = useState(params.matches);
    const [match, setMatch] = useState();
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setMatches(params.matches);
    }, [params.matches]);

    const updateResult = async (exhibitionTeamId, score) => {
        try {
            const res = await adminTournament.updateExhibitionResult(exhibitionTeamId, score);
            let variant = 'success';
            enqueueSnackbar(res.message, { variant });
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar('Không thể cập nhật điểm số', { variant });
        }
    };

    const validationSchema = Yup.object().shape({
        score: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const handleClickResult = (data) => {
        console.log(data);
        setMatch(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset({
            score: 0,
        });
    };

    const handleUpdate = (data) => {
        console.log(data, match);
        updateResult(match.team.id, data.score);
        const newMatches = matches.map((m) => {
            return m.team.id == match.team.id ? { ...m, score: data.score } : m;
        });
        setMatches(newMatches);
        params.onUpdateResult(newMatches);
        handleClose();
    };

    return (
        <Box>
            <Dialog fullWidth maxWidth="lg" open={open}>
                {match && (
                    <div>
                        <DialogTitle>Điểm số</DialogTitle>
                        <DialogContent>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Tên đội</TableCell>
                                            <TableCell align="center">Điểm số</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center">{match.team.teamName}</TableCell>
                                            <TableCell>
                                                <Controller
                                                    name="score"
                                                    variant="outlined"
                                                    defaultValue=""
                                                    control={control}
                                                    render={({
                                                        field: { onChange, value, onBlur },
                                                        fieldState: { error, invalid },
                                                    }) => (
                                                        <NumberFormat
                                                            name="score"
                                                            customInput={TextField}
                                                            label="Điểm số"
                                                            variant="outlined"
                                                            defaultValue=""
                                                            value={value}
                                                            onValueChange={(v) => {
                                                                onChange(Number(v.value));
                                                            }}
                                                            error={invalid}
                                                            helperText={invalid ? error.message : null}
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Quay lại</Button>
                            <Button onClick={handleSubmit(handleUpdate)}>Đồng ý</Button>
                        </DialogActions>
                    </div>
                )}
            </Dialog>
            {/* <Dialog fullWidth maxWidth="md" open={openUpdateTime}>
                {match && (
                    <div>
                        <DialogTitle>Thay đổi thời gian và địa điểm thi đấu</DialogTitle>
                        <DialogContent>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                <Grid container spacing={3} columns={12}>
                                    {/* <Grid item xs={12} sm={4}>
                                        <FormControl size="medium">
                                            <Typography variant="caption">Sân thi đấu</Typography>
                                            <Select
                                                id="demo-simple-select"
                                                value={areaName}
                                                displayEmpty
                                                onChange={handleChangeAreaName}
                                            >
                                                {params.areaList.map((area) => (
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
                                            defaultValue={match.time ? match.time : null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <DatePicker
                                                    disablePast
                                                    label="Ngày tháng"
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
                                            defaultValue={match.time ? match.time : null}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error, invalid },
                                            }) => (
                                                <TimePicker
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
                                </Grid>
                            </LocalizationProvider>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseUpdateTime}>Quay lại</Button>
                            <Button onClick={handleSubmit(handleUpdateTime)}>Đồng ý</Button>
                        </DialogActions>
                    </div>
                )}
            </Dialog> */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                    <caption>Địa điểm thi đấu: {params.matches[0].area.name}</caption>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell align="right">Tên đội</TableCell>
                            <TableCell align="right">Thời gian thi đấu</TableCell>
                            <TableCell align="right">Điểm số</TableCell>
                            {/* {params.status === 2 && <TableCell align="right"></TableCell>} */}
                            {params.status === 3 && <TableCell align="right"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {params.matches.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="right">{row.team.teamName}</TableCell>
                                <TableCell align="right">{moment(row.time).format('hh:mm -- DD-MM')}</TableCell>
                                <TableCell align="right">{row.score == null ? 'Chưa thi đấu' : row.score}</TableCell>
                                {/* {params.status === 2 && <TableCell align="right"></TableCell>} */}
                                {params.status === 3 && (
                                    <TableCell align="right">
                                        <Chip
                                            icon={<SportsScore />}
                                            label={row.score == null ? 'Cập nhật điểm số' : 'Đã cập nhật'}
                                            clickable={row.score == null ? true : false}
                                            onClick={() => handleClickResult(row)}
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default TableMatch;
