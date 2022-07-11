
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
import styles from '../TournamentBracket/CustomMatchBracket.module.scss';

const cx = classNames.bind(styles);

const _matches = [
    [
        {
            id: 1,
            nextMatchId: 5,
            round: 1,
            startTime: '18:00 26/6/2022',
            state: 'SCORE_DONE',
            players: [
                {
                    id: 11,
                    name: 'Đức',
                    resultText: 'Won',
                    isWinner: true,
                    status: 'PLAYED',
                    seed: 1,
                },
                {
                    id: 22,
                    name: 'Toan',
                    resultText: 'Lost',
                    isWinner: false,
                    status: 'PLAYED',
                    seed: 8,
                },
            ],
        },
        {
            id: 2,
            nextMatchId: 5,
            round: 1,
            startTime: '18:00 26/6/2022',
            state: 'SCHEDULED',
            players: [
                {
                    id: 33,
                    name: 'Linh',
                    resultText: '',
                    isWinner: false,
                    status: '',
                    seed: 2,
                },
                {
                    id: 44,
                    name: 'Tuan',
                    resultText: '',
                    isWinner: false,
                    status: '',
                    seed: 7,
                },
            ],
        },
        {
            id: 3,
            nextMatchId: 6,
            round: 1,
            startTime: '18:00 26/6/2022',
            state: 'SCHEDULED',
            players: [
                {
                    id: 55,
                    name: 'Khoi',
                    resultText: '',
                    isWinner: false,
                    status: '',
                    seed: 3,
                },
                {
                    id: 66,
                    name: 'Ning',
                    resultText: '',
                    isWinner: false,
                    status: '',
                    seed: 6,
                },
            ],
        },
        {
            id: 4,
            nextMatchId: 6,
            round: 1,
            startTime: '18:00 26/6/2022',
            state: 'SCHEDULED',
            players: [
                {
                    id: 77,
                    name: 'Hiep',
                    resultText: '',
                    isWinner: false,
                    status: '',
                    seed: 4,
                },
                {
                    id: 88,
                    name: 'Hieu',
                    resultText: '',
                    isWinner: false,
                    status: '',
                    seed: 5,
                },
            ],
        },
    ],
    [
        {
            id: 5,
            nextMatchId: 7,
            round: 2,
            startTime: '18:00 26/6/2022',
            state: 'SCHEDULED',
            players: [],
        },
        {
            id: 6,
            nextMatchId: 7,
            round: 2,
            startTime: '18:00 26/6/2022',
            state: 'SCHEDULED',
            players: [],
        },
    ],
    [
        {
            id: 7,
            nextMatchId: null,
            round: 3,
            startTime: '18:00 26/6/2022',
            state: 'SCHEDULED',
            players: [],
        },
    ],
];

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

function CustomMatchBracket({ params }) {
    const [matches, setMatches] = useState(_matches);
    let round1 = params.filter((match) => match.round == 1);
    console.log(round1);
    let round2 = params.filter((match) => match.round == 2);
    console.log(round2);
    const [dragItem, setDragItem] = useState({});
    const [dragOverItem, setDragOverItem] = useState({});
    const [open, setOpen] = useState(false);
    const [match, setMatch] = useState();
    const [score1, setScore1] = useState(-1);
    const [score2, setScore2] = useState(-1);

    console.log(params);

    const onDragStart = (e, id, index) => {
        const player = findPlayer(matches[0], id);
        setDragItem({ ...player, index: index });
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    };

    const onDragEnd = () => {
        setDragItem(null);
    };
    const onDragDrop = (e, id, index) => {
        const player = { ...findPlayer(matches[0], id), index: index };
        setDragOverItem(player);
        //if the item is dragged over itself, ignore
        if (dragItem === dragOverItem) {
            return;
        }
        // filter out the currently dragged item
        const playersDrag = matches[0][dragItem.index].players;
        const indexPlayerDrag = playersDrag.findIndex((player) => player.id === dragItem.id);

        const playersDrop = matches[0][player.index].players;
        const indexPlayerDrop = playersDrop.findIndex((p) => p.id === player.id);

        matches[0][dragItem.index].players[indexPlayerDrag] = player;
        matches[0][player.index].players[indexPlayerDrop] = dragItem;
    };

    const handleClickResult = (e, data) => {
        if (data.state != 'SCHEDULED') {
            return;
        }
        setMatch(data);
        setOpen(true);
        console.log(match);
        console.log(data.players[0].name);
    };

    const validationSchema = Yup.object().shape({
        score1: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 39 Kg'),
        score2: Yup.number()
            .required('Không được để trống trường này')
            .typeError('Vui lòng nhập số')
            .min(0, 'Vui lòng nhập giá trị lớn hơn 39Kg'),
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

    function MyFormHelperText() {
        const { onBlur } = useFormControl() || {};

        const helperText = React.useMemo(() => {
            if (onBlur) {
                return 'This field is being focused';
            }

            return 'Helper text';
        }, [onBlur]);

        return <FormHelperText>{helperText}</FormHelperText>;
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate = (data) => {
        console.log(data);

        const player1 = {
            ...match.players[0],
            isWinner: score1 > score2,
            resultText: score1 > score2 ? 'Won' : 'Lost',
            status: 'PLAYED',
        };
        const player2 = {
            ...match.players[1],
            isWinner: score1 < score2,
            resultText: score1 < score2 ? 'Won' : 'Lost',
            status: 'PLAYED',
        };

        const winner = score1 > score2 ? player1 : player2;

        match.players[0] = player1;
        match.players[1] = player2;

        console.log(match.nextMatchId);
        console.log(player1, player2);

        const temp = matches.map((m) =>
            m.map((item) => (item.id === match.nextMatchId ? { ...item, players: [...item.players, winner] } : item)),
        );
        setMatches(temp);
        console.log(temp);
        setOpen(false);
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
                                            <TableCell>{match.players[0].name}</TableCell>
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
                                            <TableCell>{match.players[1].name}</TableCell>
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
                                    <Typography>Nguời chiến thắng: {match.players[0].name} </Typography>
                                ) : (
                                    <Typography>Nguời chiến thắng: {match.players[1].name} </Typography>
                                ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Quay lại</Button>
                            <Button onClick={handleSubmit(handleUpdate)}>Đồng ý</Button>
                        </DialogActions>
                    </div>
                )}
            </Dialog>
            <div className={cx('theme', 'theme-dark')}>
                <div className={cx('bracket', ' disable-image')}>
                    <div className={cx('column')}>
                        {round1.map((match, index) => (
                            <div
                                className={cx('match', 'winner-top', 'winner-bottom')}
                                key={match.id}
                                onClick={(e) => handleClickResult(e, match)}
                            >
                                <div
                                    className={cx('match-top', 'team', 'draggable')}
                                    draggable="true"
                                    onDragOver={(e) => onDragOver(e)}
                                    onDragStart={(e) => onDragStart(e, match.firstPlayer.id, index)}
                                    onDragEnd={() => onDragEnd()}
                                    onDrop={(e) => onDragDrop(e, match.firstPlayer.id, index)}
                                >
                                    <span className={cx('image')}></span>
                                    {/* <span className={cx('seed')}>{match.firstPlayer.seed}</span> */}
                                    <span className={cx('name')}>{match.firstPlayer.name}</span>
                                    <span className={cx('score')}>{match.firstPoint}</span>
                                </div>
                                <div
                                    className={cx('match-bottom', 'team', 'draggable')}
                                    draggable="true"
                                    onDragOver={(e) => onDragOver(e)}
                                    onDragStart={(e) => onDragStart(e, match.secondPlayer.id, index)}
                                    onDragEnd={() => onDragEnd()}
                                    onDrop={(e) => onDragDrop(e, match.secondPlayer.id, index)}
                                >
                                    <span className={cx('image')}></span>
                                    <span className={cx('seed')}>8</span>
                                    <span className={cx('name')}>{match.secondPlayer.name}</span>
                                    <span className={cx('score')}>{match.secondPoint}</span>
                                </div>
                                <div className={cx('match-lines')}>
                                    <div className={cx('line', 'one')}></div>
                                    <div className={cx('line', 'two')}></div>
                                </div>
                                <div className={cx('match-lines', 'alt')}>
                                    <div className={cx('line', 'one')}></div>
                                </div>
                            </div>
                        ))}
                        <div
                            className={cx('match', 'winner-top', 'winner-bottom')}
                            // key={match.id}
                            // onClick={(e) => handleClickResult(e, match)}
                        >
                            <div
                                className={cx('match-top', 'team', 'draggable')}
                                draggable="true"
                                onDragOver={(e) => onDragOver(e)}
                                // onDragStart={(e) => onDragStart(e, match.firstPlayer.id, index)}
                                // onDragEnd={() => onDragEnd()}
                                // onDrop={(e) => onDragDrop(e, match.firstPlayer.id, index)}
                            >
                                <span className={cx('image')}></span>
                                {/* <span className={cx('seed')}>{match.firstPlayer.seed}</span> */}
                                <span className={cx('name')}>hihi</span>
                                <span className={cx('score')}>1</span>
                            </div>
                            {/* <div
                                className={cx('match-bottom', 'team', 'draggable')}
                                draggable="true"
                                onDragOver={(e) => onDragOver(e)}
                                onDragStart={(e) => onDragStart(e, match.secondPlayer.id, index)}
                                onDragEnd={() => onDragEnd()}
                                onDrop={(e) => onDragDrop(e, match.secondPlayer.id, index)}
                            >
                                <span className={cx('image')}></span>
                                <span className={cx('seed')}>8</span>
                                <span className={cx('name')}>{match.secondPlayer.name}</span>
                                <span className={cx('score')}>{match.secondPoint}</span>
                            </div> */}
                            <div className={cx('match-lines')}>
                                <div className={cx('line', 'one')}></div>
                                <div className={cx('line', 'two')}></div>
                            </div>
                            <div className={cx('match-lines', 'alt')}>
                                <div className={cx('line', 'one')}></div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('column')}>
                        {round2.map((match, index) => (
                            <div
                                className={cx('match', 'winner-bottom', 'winner-top')}
                                key={match.id}
                                onClick={(e) => handleClickResult(e, match)}
                            >
                                <div className={cx('match-top', 'team')}>
                                    <span className={cx('image')}></span>
                                    {/* <span className={cx('seed')}>{match.players[0] && match.players[0].seed}</span> */}
                                    <span className={cx('name')}>{match.firstPlayer.name}</span>
                                    <span className={cx('score')}>{match.firstPoint}</span>
                                </div>
                                <div className={cx('match-bottom', 'team')}>
                                    <span className={cx('image')}></span>
                                    <span className={cx('seed')}></span>
                                    <span className={cx('name')}>{match.secondPlayer.name}</span>
                                    <span className={cx('score')}>{match.secondPoint}</span>
                                </div>
                                <div className={cx('match-lines')}>
                                    <div className={cx('line', 'one')}></div>
                                    <div className={cx('line', 'two')}></div>
                                </div>
                                <div className={cx('match-lines', 'alt')}>
                                    <div className={cx('line', 'one')}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* <div className={cx('column')}>
                        {matches[2].map((match, index) => (
                            <div
                                className={cx('match', 'winner-top')}
                                key={match.id}
                                onClick={(e) => handleClickResult(e, match)}
                            >
                                <div className={cx('match-top ', 'team')}>
                                    <span className={cx('image')}></span>
                                    <span className={cx('seed')}>{match.players[0] && match.players[0].seed}</span>
                                    <span className={cx('name')}>{match.players[0] && match.players[0].name}</span>
                                    <span className={cx('score')}>
                                        {match.players[0] && match.players[0].resultText}
                                    </span>
                                </div>
                                <div className={cx('match-bottom', 'team')}>
                                    <span className={cx('image')}></span>
                                    <span className={cx('seed')}></span>
                                    <span className={cx('name')}>{match.players[1] && match.players[1].name}</span>
                                    <span className={cx('score')}>
                                        {match.players[1] && match.players[1].resultText}
                                    </span>
                                </div>
                                <div className={cx('match-lines')}>
                                    <div className={cx('line', 'one')}></div>
                                    <div className={cx('line', 'two')}></div>
                                </div>
                                <div className={cx('match-lines', 'alt')}>
                                    <div className={cx('line', 'one')}></div>
                                </div>
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>
        </Fragment>
    );
}

export default CustomMatchBracket;
