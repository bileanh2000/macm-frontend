import React, { useState } from 'react';
import classNames from 'classnames/bind';

import styles from '../TournamentBracket/CustomMatchBracket.module.scss';
import { array } from 'yup';

const cx = classNames.bind(styles);

const matches = [
    [
        {
            id: 1,
            nextMatchId: 4,
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
            nextMatchId: 4,
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
            nextMatchId: 5,
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
            nextMatchId: 5,
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

function CustomMatchBracket() {
    const [dragItem, setDragItem] = useState({});
    const [dragOverItem, setDragOverItem] = useState({});

    const onDragStart = (e, id, index) => {
        console.log(id, index);
        const player = findPlayer(matches[0], id);
        setDragItem({ ...player, index: index });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.parentNode);
        // e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    };

    const onDragOver = (id, index) => {
        const player = { ...findPlayer(matches[0], id), index: index };
        setDragOverItem(player);

        // if the item is dragged over itself, ignore
        if (dragItem === dragOverItem) {
            return;
        }
        // filter out the currently dragged item
        const playersDrag = matches[0][dragItem.index].players;
        const indexPlayerDrag = playersDrag.findIndex((player) => player.id === dragItem.id);

        console.log(player.index);
        const playersDrop = matches[0][player.index].players;
        const indexPlayerDrop = playersDrop.findIndex((p) => p.id === player.id);

        matches[0][dragItem.index].players[indexPlayerDrag] = player;
        matches[0][player.index].players[indexPlayerDrop] = dragItem;
    };

    const onDragEnd = () => {
        setDragItem(null);
    };

    return (
        <div className={cx('theme', 'theme-dark')}>
            <div className={cx('bracket', ' disable-image')}>
                <div className={cx('column')}>
                    {matches[0].map((match, index) => (
                        <div className={cx('match', 'winner-top')} key={match.id}>
                            <div
                                className={cx('match-top', 'team', 'draggable')}
                                draggable="true"
                                onDragOver={() => onDragOver(match.players[0].id, index)}
                                onDragStart={(e) => onDragStart(e, match.players[0].id, index)}
                                onDragEnd={onDragEnd}
                            >
                                <span className={cx('image')}></span>
                                <span className={cx('seed')}>{match.players[0].seed}</span>
                                <span className={cx('name')}>{match.players[0].name}</span>
                                <span className={cx('score')}>{match.players[0].resultText}</span>
                            </div>
                            <div
                                className={cx('match-bottom', 'team', 'draggable')}
                                draggable="true"
                                onDragOver={() => onDragOver(match.players[1].id, index)}
                                onDragStart={(e) => onDragStart(e, match.players[1].id, index)}
                                onDragEnd={onDragEnd}
                            >
                                <span className={cx('image')}></span>
                                <span className={cx('seed')}>8</span>
                                <span className={cx('name')}>{match.players[1].name}</span>
                                <span className={cx('score')}>{match.players[1].resultText}</span>
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

                    {/* <div className={cx('match', 'winner-bottom')}>
                        <div className={cx('match-top', 'team', 'draggable')} draggable="true">
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>4</span>
                            <span className={cx('name')}>New Orleans Rockstars</span>
                            <span className={cx('score')}>1</span>
                        </div>
                        <div className={cx('match-bottom', 'team', 'draggable')} draggable="true">
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>5</span>
                            <span className={cx('name')}>West Virginia Runners</span>
                            <span className={cx('score')}>2</span>
                        </div>
                        <div className={cx('match-lines')}>
                            <div className={cx('line', 'one')}></div>
                            <div className={cx('line', 'two')}></div>
                        </div>
                        <div className={cx('match-lines', 'alt')}>
                            <div className={cx('line', 'one')}></div>
                        </div>
                    </div>

                    <div className={cx('match', 'winner-top')}>
                        <div className={cx('match-top', 'team', 'draggable')} draggable="true">
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>2</span>
                            <span className={cx('name')}>Denver Demon Horses</span>
                            <span className={cx('score')}>2</span>
                        </div>
                        <div className={cx('match-bottom', 'team', 'draggable')} draggable="true">
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>7</span>
                            <span className={cx('name')}>Chicago Pistons</span>
                            <span className={cx('score')}>0</span>
                        </div>
                        <div className={cx('match-lines')}>
                            <div className={cx('line', 'one')}></div>
                            <div className={cx('line', 'two')}></div>
                        </div>
                        <div className={cx('match-lines ', 'alt')}>
                            <div className={cx('line', 'one')}></div>
                        </div>
                    </div>

                    <div className={cx('match', 'winner-top')}>
                        <div className={cx('match-top', 'team', 'draggable')} draggable="true">
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>3</span>
                            <span className={cx('name')}>San Francisco Porters</span>
                            <span className={cx('score')}>2</span>
                        </div>
                        <div className={cx('match-bottom', 'team', 'draggable')} draggable="true">
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>6</span>
                            <span className={cx('name')}>Seattle Climbers</span>
                            <span className={cx('score')}>1</span>
                        </div>
                        <div className={cx('match-lines')}>
                            <div className={cx('line', 'one')}></div>
                            <div className={cx('line', 'two')}></div>
                        </div>
                        <div className={cx('match-lines ', 'alt')}>
                            <div className={cx('line', 'one')}></div>
                        </div>
                    </div> */}
                </div>

                <div className={cx('column')}>
                    <div className={cx('match', 'winner-bottom')}>
                        <div className={cx('match-top', 'team')}>
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>1</span>
                            <span className={cx('name')}>Orlando Jetsetters</span>
                            <span className={cx('score')}>1</span>
                        </div>
                        <div className={cx('match-bottom', 'team')}>
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>5</span>
                            <span className={cx('name')}>West Virginia Runners</span>
                            <span className={cx('score')}>2</span>
                        </div>
                        <div className={cx('match-lines')}>
                            <div className={cx('line', 'one')}></div>
                            <div className={cx('line', 'two')}></div>
                        </div>
                        <div className={cx('match-lines', 'alt')}>
                            <div className={cx('line', 'one')}></div>
                        </div>
                    </div>

                    <div className={cx('match', 'winner-bottom')}>
                        <div className={cx('match-top', 'team')}>
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>2</span>
                            <span className={cx('name')}>Denver Demon Horses</span>
                            <span className={cx('score')}>1</span>
                        </div>
                        <div className={cx('match-bottom', 'team')}>
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>3</span>
                            <span className={cx('name')}>San Francisco Porters</span>
                            <span className={cx('score')}>2</span>
                        </div>
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
                    <div className={cx('match', 'winner-top')}>
                        <div className={cx('match-top ', 'team')}>
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>5</span>
                            <span className={cx('name')}>West Virginia Runners</span>
                            <span className={cx('score')}>3</span>
                        </div>
                        <div className={cx('match-bottom', 'team')}>
                            <span className={cx('image')}></span>
                            <span className={cx('seed')}>3</span>
                            <span className={cx('name')}>San Francisco Porters</span>
                            <span className={cx('score')}>2</span>
                        </div>
                        <div className={cx('match-lines')}>
                            <div className={cx('line', 'one')}></div>
                            <div className={cx('line', 'two')}></div>
                        </div>
                        <div className={cx('match-lines', 'alt')}>
                            <div className={cx('line', 'one')}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomMatchBracket;
