import React, { Fragment, useState } from 'react';
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
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
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

    const handleChangeAreaName = (event) => {
        setAreaId(event.target.value);
    };

    const validationSchema = Yup.object().shape({
        ...(open && {
            score1: Yup.number()
                .required('Không được để trống trường này')
                .typeError('Vui lòng nhập số')
                .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        }),
        ...(open && {
            score2: Yup.number()
                .required('Không được để trống trường này')
                .typeError('Vui lòng nhập số')
                .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        }),
        ...(openUpdateTime && { date: Yup.string().nullable().required('Điền đi') }),
        ...(openUpdateTime && { startTime: Yup.string().nullable().required('Điền đi') }),
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

    const onDragStart = (e, match, index, isFirst) => {
        if (params.status !== 1) {
            return;
        }
        //const player = findPlayer(matches[0], id);
        setDragItem({ ...match, index: index, isFirst: isFirst });
        console.log('drag', { ...match, index: index, isFirst: isFirst });
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = (e) => {
        if (params.status !== 1) {
            return;
        }
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    };

    const onDragEnd = () => {
        if (params.status !== 1) {
            return;
        }
        setDragItem(null);
        setDragOverItem(null);
    };
    const onDragDrop = (e, match, index, isFirst) => {
        if (params.status !== 1) {
            return;
        }
        const player = { ...match, index: index, isFirst: isFirst };
        setDragOverItem(player);
        //if the item is dragged over itself, ignore
        if (JSON.stringify(dragItem) === JSON.stringify(dragOverItem)) {
            return;
        }
        // filter out the currently dragged item
        const indexPlayerDrag = dragItem.isFirst;
        const indexPlayerDrop = player.isFirst;

        console.log('drag', matches[0][dragItem.index]);
        console.log('drop', matches[0][player.index]);

        if (indexPlayerDrag === indexPlayerDrop) {
            console.log(indexPlayerDrag, indexPlayerDrop);
            if (
                (matches[0][dragItem.index].firstPlayer === null && matches[0][player.index].secondPlayer === null) ||
                (matches[0][dragItem.index].secondPlayer === null && matches[0][player.index].firstPlayer === null)
            ) {
                console.log('khong duoc');
                return;
            } else {
                console.log('duoc');
                if (indexPlayerDrag === 0) {
                    matches[0][dragItem.index].firstPlayer = player.firstPlayer;
                    matches[0][player.index].firstPlayer = dragItem.firstPlayer;
                } else {
                    matches[0][dragItem.index].secondPlayer = player.secondPlayer;
                    matches[0][player.index].secondPlayer = dragItem.secondPlayer;
                }
            }
        } else {
            if (dragItem.index === player.index) {
                if (indexPlayerDrag === 0) {
                    matches[0][dragItem.index].firstPlayer = player.secondPlayer;
                    matches[0][player.index].secondPlayer = dragItem.firstPlayer;
                } else {
                    matches[0][dragItem.index].secondPlayer = player.firstPlayer;
                    matches[0][player.index].firstPlayer = dragItem.secondPlayer;
                }
            } else {
                if (
                    (matches[0][dragItem.index].firstPlayer === null &&
                        matches[0][player.index].firstPlayer === null) ||
                    (matches[0][dragItem.index].secondPlayer === null && matches[0][player.index].secondPlayer === null)
                ) {
                    console.log('khong duoc');
                    return;
                } else {
                    console.log('duoc');
                    if (indexPlayerDrag === 0) {
                        matches[0][dragItem.index].firstPlayer = player.secondPlayer;
                        matches[0][player.index].secondPlayer = dragItem.firstPlayer;
                    } else {
                        matches[0][dragItem.index].secondPlayer = player.firstPlayer;
                        matches[0][player.index].firstPlayer = dragItem.secondPlayer;
                    }
                }
            }
        }
    };

    const updateListMatchesPlayer = async (params) => {
        try {
            const res = await adminTournament.updateListMatchsPlayer(params);
            let variant = 'success';
            enqueueSnackbar(res.message, { variant });
        } catch (error) {
            console.log('Khong the update');
        }
    };

    const handleUpdateMatches = () => {
        console.log(matches[0]);
        updateListMatchesPlayer(matches[0]);
        setEdit(false);
        // navigator({ pathname: `/admin/tournament/${params.tournamentId}/tournamentbracket` });
    };

    const handleClickResult = (e, data) => {
        if (params.status === 3) {
            console.log(data);
            if (data.firstPlayer == null || data.secondPlayer == null) {
                return;
            }
            if (data.status) {
                return;
            }
            setMatch(data);
            setOpen(true);
        } else if (params.status === 2) {
            if (!params.matches[params.matches.length - 1].area) {
                return;
            }
            setAreaId(data.area);
            setMatch(data);
            setOpenUpdateTime(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        reset({
            score1: 0,
            score2: 0,
        });
    };

    const updateRedsult = async (params) => {
        try {
            const res = await adminTournament.updateResultMatch(params);
            let variant = 'success';
            enqueueSnackbar(res.message, { variant });
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
        } catch (error) {
            let variant = 'error';
            enqueueSnackbar('khong the cap nhat thoi gian', { variant });
        }
    };

    const handleCloseUpdateTime = () => {
        setOpenUpdateTime(false);
    };

    const handleUpdateTime = (data) => {
        console.log(data, areaName);
        const date = moment(data.date).format('YYYY-MM-DD');
        const time = moment(data.startTime).format('hh:mm:ss');
        const dateTime = date + 'T' + time;
        const areaId = params.areaList.filter((area) => area.name == areaName)[0];
        const request = { time: dateTime, area: areaId };

        match.time = dateTime;
        updateTimeAndPlace(match.id, request);
        var merged = [].concat.apply([], __matches);
        console.log(merged);
        params.onUpdareResult(merged);
        handleCloseUpdateTime();
    };

    const handleUpdate = (data) => {
        console.log(data);
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
            console.log(match);
            console.log(__matches);
            setMatch(match);
            updateRedsult(match);
            var merged = [].concat.apply([], __matches);
            console.log(merged);
            params.onUpdareResult(merged);
            setOpen(false);
            reset({
                score1: 0,
                score2: 0,
            });
        }
    };

    const handleChange = (score, event) => {
        score == 1 ? setScore1(Number(event)) : setScore2(Number(event));
        console.log(score, Number(event));
    };

    return (
        <Fragment>
            <Dialog fullWidth maxWidth="lg" open={open}>
                {match && (
                    <div>
                        <DialogTitle>Xác nhận người chiến thắng</DialogTitle>
                        <DialogContent>
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
                                            <TableCell>{match.firstPlayer.studentName}</TableCell>
                                            <TableCell>
                                                <Controller
                                                    name="score1"
                                                    variant="outlined"
                                                    defaultValue=""
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
                                            <TableCell>{match.secondPlayer.studentName}</TableCell>
                                            <TableCell>
                                                <Controller
                                                    name="score2"
                                                    variant="outlined"
                                                    defaultValue=""
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
                            {score1 > 0 &&
                                score2 > 0 &&
                                (score1 > score2 ? (
                                    <Typography>Nguời chiến thắng: {match.firstPlayer.studentName} </Typography>
                                ) : score1 < score2 ? (
                                    <Typography>Nguời chiến thắng: {match.secondPlayer.studentName} </Typography>
                                ) : (
                                    ''
                                ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Quay lại</Button>
                            <Button onClick={handleSubmit(handleUpdate)}>Đồng ý</Button>
                        </DialogActions>
                    </div>
                )}
            </Dialog>
            <Dialog fullWidth maxWidth="md" open={openUpdateTime}>
                {match && (
                    <div>
                        <DialogTitle>Thay đổi thời gian và địa điểm thi đấu</DialogTitle>
                        <DialogContent>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                                <Grid container spacing={3} columns={12}>
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
            </Dialog>
            {params.status === 3 && <Typography variant="caption">*Chọn vào 1 cặp trận để cập nhật tỉ số</Typography>}
            {params.status === 2 && params.matches[params.matches.length - 1].area && (
                <Typography variant="caption">
                    *Chọn vào 1 cặp trận để cập nhật thời gian và địa điểm thi đấu
                </Typography>
            )}
            {params.status === 1 ? (
                <Box>
                    !isEdit ? <Button onClick={() => setEdit(true)}>Chỉnh sửa bảng đấu</Button>:{' '}
                    <Button onClick={handleUpdateMatches}>Xác nhận</Button>
                </Box>
            ) : (
                ''
            )}
            <div className={cx('theme', 'theme-dark')}>
                <div className={cx('bracket', ' disable-image')}>
                    {matches.map((matchs, index) => (
                        // <div>hi</div>
                        <div className={cx('column')} key={index}>
                            {matchs.map((match, i) =>
                                index === 0 ? (
                                    match.firstPlayer && match.secondPlayer ? (
                                        <div
                                            className={cx('match', 'winner-top', 'winner-bottom')}
                                            key={match.id}
                                            onClick={(e) => handleClickResult(e, match)}
                                        >
                                            <div>
                                                <small>{match.area ? 'Địa điểm: ' + match.area : ''}</small>
                                            </div>
                                            <div
                                                className={cx('match-top', 'team', isEdit ? 'draggable' : '')}
                                                draggable={isEdit ? 'true' : ''}
                                                onDragOver={(e) => onDragOver(e)}
                                                onDragStart={(e) =>
                                                    onDragStart(e, { firstPlayer: match.firstPlayer }, i, 0)
                                                }
                                                onDragEnd={() => onDragEnd()}
                                                onDrop={(e) => onDragDrop(e, { firstPlayer: match.firstPlayer }, i, 0)}
                                            >
                                                <span className={cx('image')}></span>
                                                {/* <span className={cx('seed')}>{match.firstPlayer?.studentId}</span> */}
                                                <span className={cx('name')}>{match.firstPlayer?.studentName}</span>
                                                <span className={cx('score')}>{match.firstPlayer?.point}</span>
                                            </div>

                                            <div
                                                className={cx('match-bottom', 'team', isEdit ? 'draggable' : '')}
                                                draggable={isEdit ? 'true' : ''}
                                                onDragOver={(e) => onDragOver(e)}
                                                onDragStart={(e) =>
                                                    onDragStart(e, { secondPlayer: match.secondPlayer }, i, 1)
                                                }
                                                onDragEnd={() => onDragEnd()}
                                                onDrop={(e) =>
                                                    onDragDrop(e, { secondPlayer: match.secondPlayer }, i, 1)
                                                }
                                            >
                                                <span className={cx('image')}></span>
                                                {/* <span className={cx('seed')}>{match.secondPlayer?.studentId}</span> */}
                                                <span className={cx('name')}>{match.secondPlayer?.studentName}</span>
                                                <span className={cx('score')}>{match.secondPlayer?.point}</span>
                                            </div>
                                            <div className={cx('match-lines')}>
                                                <div className={cx('line', 'one')}></div>
                                                <div className={cx('line', 'two')}></div>
                                            </div>
                                            <div className={cx('match-lines', 'alt')}>
                                                <div className={cx('line', 'one')}></div>
                                            </div>
                                            <div>
                                                <small>
                                                    {match.time
                                                        ? 'Thời gian: ' + moment(match.time).format('hh:mm -- DD-MM')
                                                        : ''}
                                                </small>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={cx(
                                                'match',
                                                'winner-top',
                                                'winner-bottom',
                                                isEdit ? '' : 'hidden',
                                            )}
                                            key={match.id}
                                            onClick={(e) => handleClickResult(e, match)}
                                        >
                                            <div>
                                                <small>{match.area ? 'Địa điểm: ' + match.area : ''}</small>
                                            </div>

                                            <div
                                                className={cx('match-top', 'team', isEdit ? 'draggable' : '')}
                                                draggable={isEdit ? 'true' : ''}
                                                onDragOver={(e) => onDragOver(e)}
                                                onDragStart={(e) =>
                                                    onDragStart(e, { firstPlayer: match.firstPlayer }, i, 0)
                                                }
                                                onDragEnd={() => onDragEnd()}
                                                onDrop={(e) => onDragDrop(e, { firstPlayer: match.firstPlayer }, i, 0)}
                                            >
                                                <span className={cx('image')}></span>
                                                {/* <span className={cx('seed')}>{match.firstPlayer?.studentId}</span> */}
                                                <span className={cx('name')}>{match.firstPlayer?.studentName}</span>
                                                <span className={cx('score')}>{match.firstPlayer?.point}</span>
                                            </div>

                                            <div
                                                className={cx('match-bottom', 'team', isEdit ? 'draggable' : '')}
                                                draggable={isEdit ? 'true' : ''}
                                                onDragOver={(e) => onDragOver(e)}
                                                onDragStart={(e) =>
                                                    onDragStart(e, { secondPlayer: match.secondPlayer }, i, 1)
                                                }
                                                onDragEnd={() => onDragEnd()}
                                                onDrop={(e) =>
                                                    onDragDrop(e, { secondPlayer: match.secondPlayer }, i, 1)
                                                }
                                            >
                                                <span className={cx('image')}></span>
                                                {/* <span className={cx('seed')}>{match.secondPlayer?.studentId}</span> */}
                                                <span className={cx('name')}>{match.secondPlayer?.studentName}</span>
                                                <span className={cx('score')}>{match.secondPlayer?.point}</span>
                                            </div>
                                            <div className={cx('match-lines')}>
                                                <div className={cx('line', 'one')}></div>
                                                <div className={cx('line', 'two')}></div>
                                            </div>
                                            <div className={cx('match-lines', 'alt')}>
                                                <div className={cx('line', 'one')}></div>
                                            </div>
                                            <div>
                                                <small>
                                                    {match.time
                                                        ? 'Thời gian: ' + moment(match.time).format('hh:mm -- DD-MM')
                                                        : ''}
                                                </small>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div
                                        className={cx('match', 'winner-bottom', 'winner-top')}
                                        key={match.id}
                                        onClick={(e) => handleClickResult(e, match)}
                                    >
                                        <div>
                                            <small>{match.area ? 'Địa điểm: ' + match.area : ''}</small>
                                        </div>
                                        <div className={cx('match-top', 'team')}>
                                            <span className={cx('image')}></span>
                                            {/* <span className={cx('seed')}>{match.firstPlayer?.studentId}</span> */}
                                            <span className={cx('name')}>{match.firstPlayer?.studentName}</span>
                                            <span className={cx('score')}>{match.firstPlayer?.point}</span>
                                        </div>
                                        <div className={cx('match-bottom', 'team')}>
                                            <span className={cx('image')}></span>
                                            {/* <span className={cx('seed')}>{match.secondPlayer?.studentId}</span> */}
                                            <span className={cx('name')}>{match.secondPlayer?.studentName}</span>
                                            <span className={cx('score')}>{match.secondPlayer?.point}</span>
                                        </div>

                                        <div className={cx('match-lines')}>
                                            <div className={cx('line', 'one')}></div>
                                            {index === __matches.length - 2 ? (
                                                ''
                                            ) : (
                                                <div className={cx('line', 'two')}></div>
                                            )}
                                        </div>

                                        <div className={cx('match-lines', 'alt')}>
                                            <div className={cx('line', 'one')}></div>
                                        </div>

                                        <div>
                                            <small>
                                                {match.time
                                                    ? 'Thời gian: ' + moment(match.time).format('hh:mm -- DD-MM')
                                                    : ''}
                                            </small>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    );
}

export default CustomMatchBracket;
