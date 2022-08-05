import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import moment from 'moment';

import styles from './CustomMatchBracket.module.scss';
import { Box } from '@mui/material';

const cx = classNames.bind(styles);

function CustomMatchBracket(params) {
    let i;
    let __matches = [];
    for (i = 1; i <= params.rounds; i++) {
        const round = params.matches.filter((match) => match.round == i);
        __matches.push(round);
    }
    const [matches, setMatches] = useState(__matches);

    useEffect(() => {
        setMatches(__matches);
    }, [params.matches]);

    console.log(matches, params.rounds);

    return (
        <Fragment>
            <Box className={cx('tournament-bracket', 'tournament-bracket--rounded')} sx={{ mt: 2, mb: 2 }}>
                {matches.map((matchs, index) => (
                    <div className={cx('tournament-bracket__round')} key={index}>
                        <h3 className={cx('tournament-bracket__round-title')}>
                            Trận{' '}
                            {index == matches.length - 1
                                ? 'bán kết'
                                : index == matches.length - 2
                                ? 'chung kết'
                                : index + 1}
                        </h3>
                        <ul className={cx('tournament-bracket__list')}>
                            {matchs.map((match, i) =>
                                index === 0 ? (
                                    <li
                                        className={cx(
                                            'tournament-bracket__item',
                                            (match.firstPlayer && match.secondPlayer) || params.status === 1
                                                ? ''
                                                : 'hidden',
                                        )}
                                        key={match.id}
                                    >
                                        <Box sx={{ p: '1em', backgroundColor: '#0000000a', width: '100%' }}>
                                            <div>
                                                <small>{match.area ? 'Địa điểm: ' + match.area : ''}</small>
                                            </div>
                                            <div className={cx('tournament-bracket__match')}>
                                                <Box sx={{ m: '0.5em' }} className={cx('name')}>
                                                    <small>{match.firstPlayer?.studentName}</small>
                                                </Box>
                                                <Box sx={{ m: '0.5em' }} className={cx('score')}>
                                                    <small>{match.firstPlayer?.point}</small>
                                                </Box>
                                            </div>
                                            <div className={cx('tournament-bracket__match')}>
                                                <Box sx={{ m: '0.5em' }} className={cx('name')}>
                                                    <small>{match.secondPlayer?.studentName}</small>
                                                </Box>
                                                <Box sx={{ m: '0.5em' }} className={cx('score')}>
                                                    <small>{match.secondPlayer?.point}</small>
                                                </Box>
                                            </div>
                                            <div>
                                                <small>
                                                    {match.time
                                                        ? 'Thời gian: ' + moment(match.time).format('hh:mm -- DD-MM')
                                                        : ''}
                                                </small>
                                            </div>
                                        </Box>
                                    </li>
                                ) : (
                                    <li className={cx('tournament-bracket__item')} key={match.id}>
                                        <Box sx={{ p: '1em', backgroundColor: '#0000000a', width: '100%' }}>
                                            <div>
                                                <small>{match.area ? 'Địa điểm: ' + match.area : ''}</small>
                                            </div>
                                            <div className={cx('tournament-bracket__match')}>
                                                <Box sx={{ m: '0.5em' }} className={cx('name')}>
                                                    <small>{match.firstPlayer?.studentName}</small>
                                                </Box>
                                                <Box sx={{ m: '0.5em' }} className={cx('score')}>
                                                    <small>{match.firstPlayer?.point}</small>
                                                </Box>
                                            </div>
                                            <div className={cx('tournament-bracket__match')}>
                                                <Box sx={{ m: '0.5em' }} className={cx('name')}>
                                                    <small>{match.secondPlayer?.studentName}</small>
                                                </Box>
                                                <Box sx={{ m: '0.5em' }} className={cx('score')}>
                                                    <small>{match.secondPlayer?.point}</small>
                                                </Box>
                                            </div>
                                            <div>
                                                <small>
                                                    {match.time
                                                        ? 'Thời gian: ' + moment(match.time).format('hh:mm -- DD-MM')
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
        </Fragment>
    );
}

export default CustomMatchBracket;
