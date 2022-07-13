import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useState } from 'react'
import classNames from 'classnames/bind';

import styles from './CreatePreview.module.scss';
import { Box } from '@mui/system';
import adminTournament from 'src/api/adminTournamentAPI';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function CreatePreview({ title, params, isOpen, handleClose, onSucess }) {
    // console.log(params.listPlayer);
    // const matches = params.listPlayer.filter(match => match.round == 1)
    // console.log(matches)
    let i;
    let __matches = [];
    for (i = 1; i <= 4; i++) {
        const round = params.listPlayer.filter(match => match.round == i)
        __matches.push(round);
    }
    // console.log(__matches)
    const [matches, setMatches] = useState(__matches)
    const [dragItem, setDragItem] = useState({});
    const [dragOverItem, setDragOverItem] = useState({});
    const navigator = useNavigate()

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
        console.log({ ...match, index: index, isFirst: isFirst })
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
    const onDragDrop = (e, match, index, isFirst) => {
        const player = { ...match, index: index, isFirst: isFirst };
        console.log(player)
        setDragOverItem(player);
        //if the item is dragged over itself, ignore
        if (dragItem === dragOverItem) {
            return;
        }
        // filter out the currently dragged item
        const indexPlayerDrag = dragItem.isFirst
        const indexPlayerDrop = player.isFirst;

        if (indexPlayerDrag === 0 && indexPlayerDrop === 0) {
            if ((matches[0][dragItem.index].secondStudentId === null && matches[0][player.index].secondStudentId == null) && dragItem.index != player.index) {
                matches[0][dragItem.index] = { ...matches[0][dragItem.index], firstStudentId: player.firstStudentId, firstName: player.firstName }
                matches[0][player.index] = { ...matches[0][player.index], firstStudentId: dragItem.firstStudentId, firstName: dragItem.firstName }
            }
            else if ((matches[0][dragItem.index].secondStudentId === null || matches[0][player.index].firstStudentId == null) && dragItem.index != player.index) {
                return;
            }
            matches[0][dragItem.index] = { ...matches[0][dragItem.index], firstStudentId: player.firstStudentId, firstName: player.firstName }
            matches[0][player.index] = { ...matches[0][player.index], firstStudentId: dragItem.firstStudentId, firstName: dragItem.firstName }

        } else if (indexPlayerDrag === 0 && indexPlayerDrop === 1) {
            if ((matches[0][dragItem.index].secondStudentId === null || matches[0][player.index].firstStudentId == null) && dragItem.index != player.index) {
                return;
            }
            matches[0][dragItem.index] = { ...matches[0][dragItem.index], firstStudentId: player.secondStudentId, firstName: player.secondName }
            matches[0][player.index] = { ...matches[0][player.index], secondStudentId: dragItem.firstStudentId, secondName: dragItem.firstName }

        } else if (indexPlayerDrag === 1 && indexPlayerDrop === 1) {
            if ((matches[0][dragItem.index].firstStudentId === null && matches[0][player.index].firstStudentId == null) && dragItem.index != player.index) {
                matches[0][dragItem.index] = { ...matches[0][dragItem.index], firstStudentId: player.firstStudentId, firstName: player.firstName }
                matches[0][player.index] = { ...matches[0][player.index], firstStudentId: dragItem.firstStudentId, firstName: dragItem.firstName }
            }
            else if ((matches[0][dragItem.index].firstStudentId === null || matches[0][player.index].secondStudentId == null) && dragItem.index != player.index) {
                return;
            }
            matches[0][dragItem.index] = { ...matches[0][dragItem.index], secondStudentId: player.secondStudentId, secondName: player.secondName }
            matches[0][player.index] = { ...matches[0][player.index], secondStudentId: dragItem.secondStudentId, secondName: dragItem.secondName }

        } else if (indexPlayerDrag === 1 && indexPlayerDrop === 0) {
            if ((matches[0][dragItem.index].firstStudentId === null || matches[0][player.index].secondStudentId == null) && dragItem.index != player.index) {
                return;
            }
            matches[0][dragItem.index] = { ...matches[0][dragItem.index], secondStudentId: player.firstStudentId, secondName: player.firstName }
            matches[0][player.index] = { ...matches[0][player.index], firstStudentId: dragItem.secondStudentId, firstName: dragItem.secondName }

        }

    };

    const updateListMatchsPlayer = async (params) => {
        try {
            await adminTournament.updateListMatchsPlayer(params);
        } catch (error) {
            console.log('Khong the update')
        }
    }

    const handleSubmit = () => {
        console.log(matches[0])
        updateListMatchsPlayer(matches[0])
        handleClose && handleClose()
        navigator({ pathname: `/admin/tournament/${params.tournamentId}/tournamentbracket` })

    }

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
                            {matches.map((matchs, index) =>
                                <div className={cx('column')} key={index}>
                                    {matchs.map((match, i) =>
                                        index === 0 ?
                                            <div
                                                className={cx('match', 'winner-top', 'winner-bottom')}
                                                key={match.id}
                                            >
                                                <div
                                                    className={cx('match-top', 'team', 'draggable')}
                                                    draggable="true"
                                                    onDragOver={(e) => onDragOver(e)}
                                                    onDragStart={(e) => onDragStart(e, { firstStudentId: match.firstStudentId, firstName: match.firstName }, i, 0)}
                                                    onDragEnd={() => onDragEnd()}
                                                    onDrop={(e) => onDragDrop(e, { firstStudentId: match.firstStudentId, firstName: match.firstName }, i, 0)}
                                                >
                                                    <span className={cx('image')}></span>
                                                    <span className={cx('seed')}>{match.firstStudentId}</span>
                                                    <span className={cx('name')}>{match.firstName}</span>
                                                    <span className={cx('score')}>{match.firstPoint}</span>
                                                </div>
                                                <div
                                                    className={cx('match-bottom', 'team', 'draggable')}
                                                    draggable="true"
                                                    onDragOver={(e) => onDragOver(e)}
                                                    onDragStart={(e) => onDragStart(e, { secondStudentId: match.secondStudentId, secondName: match.secondName }, i, 1)}
                                                    onDragEnd={() => onDragEnd()}
                                                    onDrop={(e) => onDragDrop(e, { secondStudentId: match.secondStudentId, secondName: match.secondName }, i, 1)}
                                                >
                                                    <span className={cx('image')}></span>
                                                    <span className={cx('seed')}>{match.secondStudentId}</span>
                                                    <span className={cx('name')}>{match.secondName}</span>
                                                    <span className={cx('score')}>{match.secondPoint}</span>
                                                </div>
                                                <div className={cx('match-lines')}>
                                                    <div className={cx('line', 'one')}></div>
                                                    <div className={cx('line', 'two')}></div>
                                                </div>
                                                <div className={cx('match-lines', 'alt')}>
                                                    <div className={cx('line', 'one')}></div>
                                                </div>
                                            </div> : <div
                                                className={cx('match', 'winner-bottom', 'winner-top')}
                                                key={match.id}
                                            >
                                                <div className={cx('match-top', 'team')}>
                                                    <span className={cx('image')}></span>
                                                    <span className={cx('seed')}>{match.firstStudentId}</span>
                                                    <span className={cx('name')}>{match.firstName}</span>
                                                    <span className={cx('score')}>{match.firstPoint}</span>
                                                </div>
                                                <div className={cx('match-bottom', 'team')}>
                                                    <span className={cx('image')}></span>
                                                    <span className={cx('seed')}>{match.secondStudentId}</span>
                                                    <span className={cx('name')}>{match.secondName}</span>
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
                                    )}
                                </div>
                            )}
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
    )
}

export default CreatePreview