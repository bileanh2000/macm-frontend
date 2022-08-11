import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    useFormControl,
} from '@mui/material';
import NumberFormat from 'react-number-format';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import adminTournament from 'src/api/adminTournamentAPI';
import styles from './CustomMatchBracket.module.scss';
import { Box } from '@mui/system';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { useSnackbar } from 'notistack';

const cx = classNames.bind(styles);

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function CustomMatchBracket(params) {
    let i;
    let __matches = [];
    for (i = 1; i <= params.rounds; i++) {
        const round = params.matches.filter((match) => match.round == i);
        __matches.push(round);
    }
    const { enqueueSnackbar } = useSnackbar();
    const [matches, setMatches] = useState(__matches);
    const [dragItem, setDragItem] = useState({});
    const [dragOverItem, setDragOverItem] = useState({});
    const [open, setOpen] = useState(false);
    const [openUpdateTime, setOpenUpdateTime] = useState(false);
    const [match, setMatch] = useState();
    const [score1, setScore1] = useState(-1);
    const [score2, setScore2] = useState(-1);
    const [isEdit, setEdit] = useState(false);
    const [areaName, setAreaId] = useState();
    const [winner, setWinner] = useState(0);
    const [value, setValue] = useState(1);
    const [winnerTemp, setWinnerTemp] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeAreaName = (event) => {
        setAreaId(event.target.value);
    };

    useEffect(() => {
        setMatches(__matches);
    }, [params.matches]);

    const validationSchema = Yup.object().shape({
        ...(value === 1 && {
            score1: Yup.number()
                .required('Không được để trống trường này')
                .typeError('Vui lòng nhập số')
                .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        }),
        ...(value === 1 && {
            score2: Yup.number()
                .required('Không được để trống trường này')
                .typeError('Vui lòng nhập số')
                .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        }),
        ...(value === 0 && { date: Yup.string().nullable().required('Điền đi') }),
        ...(value === 0 && { startTime: Yup.string().nullable().required('Điền đi') }),
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

    const onDragStart = (e, match, index, round, isFirst) => {
        if (params.status !== 0) {
            return;
        }
        if ((isFirst == 0 && match.firstPlayer == null) || (isFirst == 1 && match.secondPlayer == null)) {
            return;
        }
        setDragItem({ ...match, index: index, round: round, isFirst: isFirst });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.childNodes[0]);
        e.dataTransfer.setDragImage(e.target.childNodes[0], 20, 20);
    };

    const onDragOver = (e) => {
        if (params.status !== 0) {
            return;
        }
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    };

    const onDragEnd = () => {
        if (params.status !== 0) {
            return;
        }
        setDragItem(null);
        setDragOverItem(null);
    };
    const onDragDrop = (e, match, index, round, isFirst) => {
        if (params.status !== 0) {
            return;
        }
        if ((isFirst == 0 && match.firstPlayer == null) || (isFirst == 1 && match.secondPlayer == null)) {
            return;
        }
        const player = { ...match, index: index, round: round, isFirst: isFirst };
        setDragOverItem(player);
        //if the item is dragged over itself, ignore
        if (JSON.stringify(dragItem) === JSON.stringify(dragOverItem)) {
            return;
        }
        // filter out the currently dragged item
        const indexPlayerDrag = dragItem.isFirst;
        const indexPlayerDrop = player.isFirst;

        if (indexPlayerDrag === indexPlayerDrop) {
            if (indexPlayerDrag === 0) {
                matches[dragItem.round][dragItem.index].firstPlayer = player.firstPlayer;
                matches[player.round][player.index].firstPlayer = dragItem.firstPlayer;
            } else {
                matches[dragItem.round][dragItem.index].secondPlayer = player.secondPlayer;
                matches[player.round][player.index].secondPlayer = dragItem.secondPlayer;
            }
        } else {
            if (indexPlayerDrag === 0) {
                matches[dragItem.round][dragItem.index].firstPlayer = player.secondPlayer;
                matches[player.round][player.index].secondPlayer = dragItem.firstPlayer;
            } else {
                matches[dragItem.round][dragItem.index].secondPlayer = player.firstPlayer;
                matches[player.round][player.index].firstPlayer = dragItem.secondPlayer;
            }
        }
    };

    const updateListMatchesPlayer = async (params) => {
        try {
            const res = await adminTournament.updateListMatchsPlayer(params);
            let variant = 'success';
            enqueueSnackbar(res.message, { variant });
            params.onChangeData && params.onChangeData();
        } catch (error) {
            console.log('Khong the update', error);
        }
    };
    const handleCreateMatches = () => {
        params.onCreateMatches();
    };

    const handleUpdateMatches = () => {
        var merged = [].concat.apply([], __matches);
        console.log(merged);
        updateListMatchesPlayer(merged);
        setEdit(false);
    };

    const handleClickWinner = (e, data) => {
        if (data == null) {
            return;
        }
        setWinnerTemp(data.studentId);
        setWinner(data);
    };

    const handleClickResult = (e, data) => {
        if (params.status < 2) {
            return;
        }
        if (data.firstPlayer == null || data.secondPlayer == null) {
            setMatch(data);
            setValue(0);
        } else {
            setMatch(data);
            setValue(1);
        }
        if (!params.matches[params.matches.length - 1].area) {
            return;
        }
        setAreaId(data.area);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        // reset({
        //     score1: '',
        //     score2: '',
        // });
        setWinnerTemp(0);
        setWinner(0);
        handleCloseUpdateTime();
    };

    const updateResult = async (params) => {
        try {
            const res = await adminTournament.updateResultMatch(params);
            let variant = 'success';
            enqueueSnackbar(res.message, { variant });
            params.onChangeData && params.onChangeData();
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar('khong the cap nhat ket quá', { variant });
        }
    };

    const updateTimeAndPlace = async (matchId, params) => {
        try {
            const res = await adminTournament.updateTimeAndPlaceMatch(matchId, params);
            let variant = 'success';
            enqueueSnackbar(res.message, { variant });
            params.onChangeData && params.onChangeData();
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar('khong the cap nhat thoi gian', { variant });
        }
    };

    const handleCloseUpdateTime = () => {
        setOpenUpdateTime(false);
    };

    const handleUpdateTime = (data) => {
        console.log('time');
        const date = moment(data.date).format('YYYY-MM-DD');
        const time = moment(data.startTime).format('hh:mm:ss');
        const dateTime = date + 'T' + time;
        const areaId = params.areaList.filter((area) => area.name == areaName)[0];
        const request = { time: dateTime, area: areaId };

        match.time = dateTime;
        updateTimeAndPlace(match.id, request);
        var merged = [].concat.apply([], __matches);
        params.onUpdateResult(merged);
        handleClose();
    };

    const handleUpdate = (data) => {
        console.log('result');
        if (data.score1 == data.score2) {
            setError('score1', {
                message: 'Điểm 2 người chơi không được bằng nhau',
            });
            setError('score2', {
                message: 'Điểm 2 người chơi không được bằng nhau',
            });
        } else {
            match.firstPlayer.point = data.score1;
            match.secondPlayer.point = data.score2;
            setMatch(match);
            updateResult(match);
            var merged = [].concat.apply([], __matches);
            params.onUpdateResult(merged);
            setOpen(false);
            // reset({
            //     score1: '',
            //     score2: '',
            // });
        }
    };

    const handleChange = (score, event) => {
        score == 1 ? setScore1(Number(event)) : setScore2(Number(event));
        if (score == 1) {
            Number(event) > score2
                ? setWinnerTemp(match.firstPlayer.studentId)
                : setWinnerTemp(match.secondPlayer.studentId);
        } else {
            Number(event) > score1
                ? setWinnerTemp(match.secondPlayer.studentId)
                : setWinnerTemp(match.firstPlayer.studentId);
        }
    };

    const UpdateScore = ({ value, index }) => {
        return (
            <Box
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
            >
                {match && (
                    <>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Tên cầu thủ</TableCell>
                                        <TableCell align="center">Điểm số</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            {match.firstPlayer.studentName} - {match.firstPlayer.studentId}
                                        </TableCell>
                                        <TableCell>
                                            <Controller
                                                name="score1"
                                                variant="outlined"
                                                defaultValue={
                                                    match.firstPlayer.point !== null ? match.firstPlayer.point : ''
                                                }
                                                control={control}
                                                render={({
                                                    field: { onChange, value, onBlur },
                                                    fieldState: { error, invalid },
                                                }) => (
                                                    <NumberFormat
                                                        name="score1"
                                                        customInput={TextField}
                                                        label="Điểm số"
                                                        variant="outlined"
                                                        defaultValue=""
                                                        value={value}
                                                        onValueChange={(v) => {
                                                            onChange(Number(v.value));
                                                        }}
                                                        onBlur={(v) => handleChange(1, v.target.value)}
                                                        error={invalid}
                                                        helperText={invalid ? error.message : null}
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            {match.secondPlayer.studentName} - {match.secondPlayer.studentId}
                                        </TableCell>
                                        <TableCell>
                                            <Controller
                                                name="score2"
                                                variant="outlined"
                                                defaultValue={
                                                    match.secondPlayer.point !== null ? match.secondPlayer.point : ''
                                                }
                                                control={control}
                                                render={({
                                                    field: { onChange, value, onBlur },
                                                    fieldState: { error, invalid },
                                                }) => (
                                                    <NumberFormat
                                                        name="score2"
                                                        customInput={TextField}
                                                        label="Điểm số"
                                                        variant="outlined"
                                                        defaultValue=""
                                                        value={value}
                                                        onValueChange={(v) => {
                                                            onChange(Number(v.value));
                                                        }}
                                                        onBlur={(v) => handleChange(2, v.target.value)}
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
                        <Box>
                            <FormControl>
                                <FormLabel id="demo-form-control-label-placement">Xác nhận người chiến thắng</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-form-control-label-placement"
                                    name="position"
                                    defaultValue="top"
                                    value={winnerTemp}
                                    // onChange={handleChangeWinner}
                                >
                                    <FormControlLabel
                                        value={match.firstPlayer.studentId}
                                        control={<Radio />}
                                        label={match.firstPlayer.studentName}
                                        labelPlacement="start"
                                        sx={{ mr: 1 }}
                                    />
                                    <FormControlLabel
                                        value={match.secondPlayer.studentId}
                                        control={<Radio />}
                                        label={match.secondPlayer.studentName}
                                        sx={{ ml: 1 }}
                                    />
                                </RadioGroup>
                            </FormControl>
                            {winnerTemp !== winner.studentId && winner != 0 && (
                                <Typography variant="body1" sx={{ color: 'red' }}>
                                    Người chiến thắng bạn chọn không trùng với kết quả, bạn có muốn tiếp tục lưu điểm
                                    số?
                                </Typography>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        );
    };

    const UpdateTime = ({ value, index }) => {
        return (
            <Box
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
            >
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                    <Grid container spacing={3} columns={12} sx={{ mt: 2, alignItems: 'flex-end' }}>
                        <Grid item xs={12} sm={4}>
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
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
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
                                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
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
            </Box>
        );
    };

    return (
        <Fragment>
            <Dialog fullWidth maxWidth="lg" open={open}>
                <div>
                    <DialogTitle>
                        {value == 0 ? 'Thời gian và địa điểm thi đấu' : 'Xác nhận người chiến thắng'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChangeTab}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="basic tabs example"
                                >
                                    <Tab label="Thời gian và địa điểm" {...a11yProps(0)} />
                                    {match && match.firstPlayer !== null && match.secondPlayer !== null && (
                                        <Tab label="Điểm số" {...a11yProps(1)} />
                                    )}
                                </Tabs>
                            </Box>
                            <UpdateTime value={value} index={0} />
                            {match && match.firstPlayer !== null && match.secondPlayer !== null && (
                                <UpdateScore value={value} index={1} />
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Quay lại</Button>
                        {value == 1 ? (
                            <Button onClick={handleSubmit(handleUpdate)}>Đồng ý</Button>
                        ) : (
                            <Button onClick={handleSubmit(handleUpdateTime)}>Đồng ý</Button>
                        )}
                    </DialogActions>
                </div>
            </Dialog>
            {params.status === 3 && <Typography variant="caption">*Chọn vào 1 cặp trận để cập nhật tỉ số</Typography>}
            {params.status === 2 && params.matches[params.matches.length - 1].area && (
                <Typography variant="caption">
                    *Chọn vào 1 cặp trận để cập nhật thời gian và địa điểm thi đấu
                </Typography>
            )}
            {params.status === 0 ? (
                !params.isCreate ? (
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="caption">
                            Bảng đấu này chỉ là tạm thời, và có thể thay đổi được trước khi giải đấu bắt đầu
                        </Typography>
                        {!isEdit ? (
                            <Typography variant="caption" component={Box}>
                                Bấm chỉnh sửa để chỉnh sửa thứ tự thi đấu
                                <Button variant="outlined" onClick={() => setEdit(true)} sx={{ ml: 2 }}>
                                    Chỉnh sửa bảng đấu
                                </Button>
                            </Typography>
                        ) : (
                            <Typography variant="caption" component={Box}>
                                Kéo thả thứ tự thi đấu của vận động viên để cập nhật vị trí
                                <Button variant="outlined" onClick={handleUpdateMatches} sx={{ ml: 2 }}>
                                    Xác nhận
                                </Button>
                            </Typography>
                        )}
                    </Paper>
                ) : (
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="caption">
                            Danh sách thi đấu có sự thay đổi, bấm tạo để có thể cập nhật số lượng tuyển thủ
                        </Typography>
                        <Button variant="outlined" onClick={handleCreateMatches}>
                            Tạo bảng đấu
                        </Button>
                    </Paper>
                )
            ) : (
                ''
            )}
            <Paper sx={{ overflow: 'auto', maxHeight: '80vh', mt: 2 }}>
                <Box className={cx('tournament-bracket', 'tournament-bracket--rounded')} sx={{ mt: 2, mb: 2 }}>
                    {matches.map((matchs, index) => (
                        <div className={cx('tournament-bracket__round')} key={index}>
                            <h3 className={cx('tournament-bracket__round-title')}>
                                Trận{' '}
                                {index == matches.length - 1
                                    ? 'tranh hạng 3'
                                    : index == matches.length - 2
                                    ? 'chung kết'
                                    : index == matches.length - 3
                                    ? 'bán kết'
                                    : index + 1}
                            </h3>
                            <ul className={cx('tournament-bracket__list')}>
                                {matchs.map((match, i) =>
                                    index === 0 || index === 1 ? (
                                        <li
                                            className={cx(
                                                'tournament-bracket__item',
                                                (match.firstPlayer && match.secondPlayer) || index === 1
                                                    ? ''
                                                    : 'hidden',
                                            )}
                                            key={match.id}
                                        >
                                            <Box
                                                sx={{ p: '1em', backgroundColor: '#0000000a', width: '100%' }}
                                                onClick={(e) => handleClickResult(e, match)}
                                            >
                                                <div>
                                                    <small>{match.area ? 'Địa điểm: ' + match.area : ''}</small>
                                                </div>
                                                {/* <Tooltip
                                                    title={`${match.firstPlayer?.studentName} - ${match.firstPlayer?.studentId}`}
                                                > */}
                                                <div
                                                    className={cx(
                                                        'tournament-bracket__match',
                                                        isEdit ? 'draggable' : '',
                                                    )}
                                                    draggable={isEdit ? true : false}
                                                    onDragOver={(e) => onDragOver(e)}
                                                    onDragStart={(e) =>
                                                        onDragStart(e, { firstPlayer: match.firstPlayer }, i, index, 0)
                                                    }
                                                    onDragEnd={() => onDragEnd()}
                                                    onDrop={(e) =>
                                                        onDragDrop(e, { firstPlayer: match.firstPlayer }, i, index, 0)
                                                    }
                                                    onClick={(e) => handleClickWinner(e, match.firstPlayer)}
                                                >
                                                    <Box sx={{ m: '0.5em' }} className={cx('name')}>
                                                        <small>{match.firstPlayer?.studentName}</small>
                                                    </Box>
                                                    <Box sx={{ m: '0.5em' }} className={cx('score')}>
                                                        <small>{match.firstPlayer?.point}</small>
                                                    </Box>
                                                </div>
                                                {/* </Tooltip> */}
                                                {/* <Tooltip
                                                    title={`${match.secondPlayer?.studentName} - ${match.secondPlayer?.studentId}`}
                                                > */}
                                                <div
                                                    className={cx(
                                                        'tournament-bracket__match',
                                                        isEdit ? 'draggable' : '',
                                                    )}
                                                    draggable={isEdit ? true : false}
                                                    onDragOver={(e) => onDragOver(e)}
                                                    onDragStart={(e) =>
                                                        onDragStart(
                                                            e,
                                                            { secondPlayer: match.secondPlayer },
                                                            i,
                                                            index,
                                                            1,
                                                        )
                                                    }
                                                    onDragEnd={() => onDragEnd()}
                                                    onDrop={(e) =>
                                                        onDragDrop(e, { secondPlayer: match.secondPlayer }, i, index, 1)
                                                    }
                                                    onClick={(e) => handleClickWinner(e, match.secondPlayer)}
                                                >
                                                    <Box sx={{ m: '0.5em' }} className={cx('name')}>
                                                        <small>{match.secondPlayer?.studentName}</small>
                                                    </Box>
                                                    <Box sx={{ m: '0.5em' }} className={cx('score')}>
                                                        <small>{match.secondPlayer?.point}</small>
                                                    </Box>
                                                </div>
                                                {/* </Tooltip> */}

                                                <div>
                                                    <small>
                                                        {match.time
                                                            ? 'Thời gian: ' +
                                                              moment(match.time).format('hh:mm -- DD-MM')
                                                            : ''}
                                                    </small>
                                                </div>
                                            </Box>
                                        </li>
                                    ) : (
                                        <li className={cx('tournament-bracket__item')} key={match.id}>
                                            <Box
                                                sx={{ p: '1em', backgroundColor: '#0000000a', width: '100%' }}
                                                onClick={(e) => handleClickResult(e, match)}
                                            >
                                                <div>
                                                    <small>{match.area ? 'Địa điểm: ' + match.area : ''}</small>
                                                </div>
                                                {/* <Tooltip
                                                    title={`${match.firstPlayer?.studentName} - ${match.firstPlayer?.studentId}`}
                                                > */}
                                                <div
                                                    className={cx('tournament-bracket__match')}
                                                    onClick={(e) => handleClickWinner(e, match.firstPlayer)}
                                                >
                                                    <Box sx={{ m: '0.5em' }} className={cx('name')}>
                                                        <small>{match.firstPlayer?.studentName}</small>
                                                    </Box>
                                                    <Box sx={{ m: '0.5em' }} className={cx('score')}>
                                                        <small>{match.firstPlayer?.point}</small>
                                                    </Box>
                                                </div>
                                                {/* </Tooltip>
                                                <Tooltip
                                                    title={`${match.secondPlayer?.studentName} - ${match.secondPlayer?.studentId}`}
                                                > */}
                                                <div
                                                    className={cx('tournament-bracket__match')}
                                                    onClick={(e) => handleClickWinner(e, match.secondPlayer)}
                                                >
                                                    <Box sx={{ m: '0.5em' }} className={cx('name')}>
                                                        <small>{match.secondPlayer?.studentName}</small>
                                                    </Box>
                                                    <Box sx={{ m: '0.5em' }} className={cx('score')}>
                                                        <small>{match.secondPlayer?.point}</small>
                                                    </Box>
                                                </div>
                                                {/* </Tooltip> */}
                                                <div>
                                                    <small>
                                                        {match.time
                                                            ? 'Thời gian: ' +
                                                              moment(match.time).format('hh:mm -- DD-MM')
                                                            : ''}
                                                    </small>
                                                </div>
                                            </Box>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    ))}
                </Box>
            </Paper>
        </Fragment>
    );
}

export default CustomMatchBracket;
