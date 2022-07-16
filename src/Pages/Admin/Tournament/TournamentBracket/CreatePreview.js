import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './CreatePreview.module.scss';
import { Box } from '@mui/system';
import adminTournament from 'src/api/adminTournamentAPI';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const data = [
    {
        id: 48,
        round: 1,
        time: null,
        area: null,
        status: null,
        firstPlayer: {
            studentId: 'HE140860',
            studentName: 'dam van toan 06',
            point: null,
        },
        secondPlayer: null,
        // secondPlayer: {
        //     studentId: 'HE140860',
        //     studentName: 'dam van toan 06',
        //     point: null,
        // },
        // firstPlayer: null,
    },
    {
        id: 49,
        round: 1,
        time: null,
        area: null,
        status: null,
        firstPlayer: {
            studentId: 'HE140862',
            studentName: 'dam van toan 08',
            point: null,
        },
        secondPlayer: null,
    },
    {
        id: 50,
        round: 1,
        time: null,
        area: null,
        status: null,
        firstPlayer: {
            studentId: 'HE140864',
            studentName: 'Đàm Zăn Toán',
            point: null,
        },
        secondPlayer: null,
    },
    {
        id: 51,
        round: 1,
        time: null,
        area: null,
        status: null,
        firstPlayer: {
            studentId: 'HE140865',
            studentName: 'dam van toan 11',
            point: null,
        },
        secondPlayer: null,
    },
    {
        id: 52,
        round: 1,
        time: null,
        area: null,
        status: null,
        firstPlayer: {
            studentId: 'HE140866',
            studentName: 'dam van toan 12',
            point: null,
        },
        secondPlayer: null,
    },
    {
        id: 53,
        round: 1,
        time: null,
        area: null,
        status: null,
        firstPlayer: {
            studentId: 'HE140868',
            studentName: 'dam van toan 14',
            point: null,
        },
        secondPlayer: null,
    },
    {
        id: 54,
        round: 1,
        time: null,
        area: null,
        status: null,
        firstPlayer: {
            studentId: 'HA141277',
            studentName: 'Lê Anh HE',
            point: null,
        },
        secondPlayer: {
            studentId: 'HE140972',
            studentName: 'dam van toan 19',
            point: null,
        },
    },
    {
        id: 55,
        round: 1,
        time: null,
        area: null,
        status: null,
        firstPlayer: {
            studentId: 'HE141273',
            studentName: 'Lê Anh Linh',
            point: null,
        },
        secondPlayer: {
            studentId: 'HE150002',
            studentName: 'dam van toan 23',
            point: null,
        },
    },
    {
        id: 56,
        round: 2,
        time: null,
        area: null,
        status: null,
        firstPlayer: null,
        secondPlayer: null,
    },
    {
        id: 57,
        round: 2,
        time: null,
        area: null,
        status: null,
        firstPlayer: null,
        secondPlayer: null,
    },
    {
        id: 58,
        round: 2,
        time: null,
        area: null,
        status: null,
        firstPlayer: null,
        secondPlayer: null,
    },
    {
        id: 59,
        round: 2,
        time: null,
        area: null,
        status: null,
        firstPlayer: null,
        secondPlayer: null,
    },
    {
        id: 60,
        round: 3,
        time: null,
        area: null,
        status: null,
        firstPlayer: null,
        secondPlayer: null,
    },
    {
        id: 61,
        round: 3,
        time: null,
        area: null,
        status: null,
        firstPlayer: null,
        secondPlayer: null,
    },
    {
        id: 62,
        round: 4,
        time: null,
        area: null,
        status: null,
        firstPlayer: null,
        secondPlayer: null,
    },
    {
        id: 63,
        round: 5,
        time: null,
        area: null,
        status: null,
        firstPlayer: null,
        secondPlayer: null,
    },
];

function CreatePreview({ title, params, isOpen, handleClose, onSucess }) {
    // console.log(params.listPlayer);
    // const matches = params.listPlayer.filter(match => match.round == 1)
    // console.log(matches)
    let i;
    let __matches = [];
    for (i = 1; i <= 4; i++) {
        // const round = params.listPlayer.filter((match) => match.round == i);
        const round = data.filter((match) => match.round == i);
        __matches.push(round);
    }
    // console.log(__matches)
    const [matches, setMatches] = useState(__matches);
    const [dragItem, setDragItem] = useState({});
    const [dragOverItem, setDragOverItem] = useState({});
    const navigator = useNavigate();

    // const findPlayer = (array, id) => {
    //     let i, j;
    //     let player;
    //     for (i = 0; i < array.length; i++) {
    //         for (j = 0; j < array[i].players.length; j++) {
    //             if (array[i].players[j].id === id) {
    //                 player = array[i].players[j];
    //             }
    //         }
    //     }
    //     return player;
    // };

    const onDragStart = (e, match, index, isFirst) => {
        //const player = findPlayer(matches[0], id);
        setDragItem({ ...match, index: index, isFirst: isFirst });
        console.log('drag', { ...match, index: index, isFirst: isFirst });
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    };

    const onDragEnd = () => {
        setDragItem(null);
        setDragOverItem(null);
    };
    const onDragDrop = (e, match, index, isFirst) => {
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

    const updateListMatchsPlayer = async (params) => {
        try {
            await adminTournament.updateListMatchsPlayer(params);
        } catch (error) {
            console.log('Khong the update');
        }
    };

    const handleSubmit = () => {
        console.log(matches[0]);
        updateListMatchsPlayer(matches[0]);
        handleClose && handleClose();
        navigator({ pathname: `/admin/tournament/${params.tournamentId}/tournamentbracket` });
    };

    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={!!isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        '& .MuiTextField-root': { mb: 2 },
                    }}
                >
                    <Typography variant="body1">*Kéo thả để chỉnh sửa thứ tự thi đấu của tuyển thủ</Typography>
                    <div className={cx('theme', 'theme-dark')}>
                        <div className={cx('bracket', ' disable-image')}>
                            {matches.map((matchs, index) => (
                                <div className={cx('column')} key={index}>
                                    {matchs.map((match, i) =>
                                        index === 0 ? (
                                            <div className={cx('match', 'winner-top', 'winner-bottom')} key={match.id}>
                                                <div
                                                    className={cx('match-top', 'team', 'draggable')}
                                                    draggable="true"
                                                    onDragOver={(e) => onDragOver(e)}
                                                    onDragStart={(e) =>
                                                        onDragStart(e, { firstPlayer: match.firstPlayer }, i, 0)
                                                    }
                                                    onDragEnd={() => onDragEnd()}
                                                    onDrop={(e) =>
                                                        onDragDrop(e, { firstPlayer: match.firstPlayer }, i, 0)
                                                    }
                                                >
                                                    <span className={cx('image')}></span>
                                                    <span className={cx('seed')}>{match.firstPlayer?.studentId}</span>
                                                    <span className={cx('name')}>{match.firstPlayer?.studentName}</span>
                                                    <span className={cx('score')}>{match.firstPlayer?.point}</span>
                                                </div>
                                                <div
                                                    className={cx('match-bottom', 'team', 'draggable')}
                                                    draggable="true"
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
                                                    <span className={cx('seed')}>{match.secondPlayer?.studentId}</span>
                                                    <span className={cx('name')}>
                                                        {match.secondPlayer?.studentName}
                                                    </span>
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
                                            <div className={cx('match', 'winner-bottom', 'winner-top')} key={match.id}>
                                                <div className={cx('match-top', 'team')}>
                                                    <span className={cx('image')}></span>
                                                    <span className={cx('seed')}>{match.firstPlayer?.studentId}</span>
                                                    <span className={cx('name')}>{match.firstPlayer?.studentName}</span>
                                                    <span className={cx('score')}>{match.firstPlayer?.point}</span>
                                                </div>
                                                <div className={cx('match-bottom', 'team')}>
                                                    <span className={cx('image')}></span>
                                                    <span className={cx('seed')}>{match.secondPlayer?.studentId}</span>
                                                    <span className={cx('name')}>
                                                        {match.secondPlayer?.studentName}
                                                    </span>
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
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleSubmit} autoFocus>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreatePreview;
