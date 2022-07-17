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
    FormHelperText,
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

import adminTournament from 'src/api/adminTournamentAPI';
import styles from './CustomMatchBracket.module.scss';
import { Box } from '@mui/system';

const cx = classNames.bind(styles);

const findPlayer = (array, id) => {
    let i, j;
    let player;
    for (i = 0; i < array.length; i++) {
        for (j = 0; j < array[i].players.length; j++) {
            if (array[i].players[j].id === id) {
                player = array[i].players[j];
            }
        }
    }
    return player;
};

function CustomMatchBracket(params) {
    console.log(params);
    // const [matches, setMatches] = useState(_matches);
    let i;
    let __matches = [];
    for (i = 1; i <= params.rounds; i++) {
        const round = params.matches.filter((match) => match.round == i);
        __matches.push(round);
    }
    const [matches, setMatches] = useState(__matches);
    const [dragItem, setDragItem] = useState({});
    const [dragOverItem, setDragOverItem] = useState({});
    const [open, setOpen] = useState(false);
    const [match, setMatch] = useState();
    const [score1, setScore1] = useState(-1);
    const [score2, setScore2] = useState(-1);
    const [isEdit, setEdit] = useState(false);

    console.log(params);

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
            await adminTournament.updateListMatchsPlayer(params);
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
            console.log('cap nhat time');
        }
    };

    const validationSchema = Yup.object().shape({
        score1: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
        score2: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
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

    const handleClose = () => {
        setOpen(false);
        reset({
            score1: -1,
            score2: -1,
        });
    };

    const updateRedsult = async (params) => {
        try {
            await adminTournament.updateResultMatch(params);
        } catch (error) {
            console.log('khong the cap nhat ket quá');
        }
    };

    console.log('reload');
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
            match.firstPoint = data.score1;
            match.secondPoint = data.score2;
            console.log(match);
            console.log(__matches);
            var merged = [].concat.apply([], __matches);
            console.log(merged);
            params.onUpdareResult(merged);
            setMatch(match);
            updateRedsult(match);
            setOpen(false);
            reset({
                score1: -1,
                score2: -1,
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
                                            <TableCell>{match.firstName}</TableCell>
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
                                            <TableCell>{match.secondName}</TableCell>
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
                                    <Typography>Nguời chiến thắng: {match.firstName} </Typography>
                                ) : score1 < score2 ? (
                                    <Typography>Nguời chiến thắng: {match.secondName} </Typography>
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
            <Typography variant="caption">*Chọn vào 1 cặp trận để cập nhật tỉ số</Typography>
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
                        <div className={cx('column')} key={index}>
                            {matchs.map((match, i) =>
                                index === 0 ? (
                                    <div
                                        className={cx('match', 'winner-top', 'winner-bottom')}
                                        key={match.id}
                                        onClick={(e) => handleClickResult(e, match)}
                                    >
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
                                            <span className={cx('seed')}>{match.firstPlayer?.studentId}</span>
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
                                            onDrop={(e) => onDragDrop(e, { secondPlayer: match.secondPlayer }, i, 1)}
                                        >
                                            <span className={cx('image')}></span>
                                            <span className={cx('seed')}>{match.secondPlayer?.studentId}</span>
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
                                    </div>
                                ) : (
                                    <div
                                        className={cx('match', 'winner-bottom', 'winner-top')}
                                        key={match.id}
                                        onClick={(e) => handleClickResult(e, match)}
                                    >
                                        <div className={cx('match-top', 'team')}>
                                            <span className={cx('image')}></span>
                                            <span className={cx('seed')}>{match.firstPlayer?.studentId}</span>
                                            <span className={cx('name')}>{match.firstPlayer?.studentName}</span>
                                            <span className={cx('score')}>{match.firstPlayer?.point}</span>
                                        </div>
                                        <div className={cx('match-bottom', 'team')}>
                                            <span className={cx('image')}></span>
                                            <span className={cx('seed')}>{match.secondPlayer?.studentId}</span>
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
