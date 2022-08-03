import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import moment from 'moment';

import styles from './CustomMatchBracket.module.scss';

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

    return (
        <Fragment>
            <div className={cx('theme', 'theme-dark')}>
                <div className={cx('bracket', ' disable-image')}>
                    {matches.map((matchs, index) => (
                        <div className={cx('column')} key={index}>
                            {matchs.map((match, i) =>
                                index === 0 ? (
                                    match.firstPlayer && match.secondPlayer ? (
                                        <div className={cx('match', 'winner-top', 'winner-bottom')} key={match.id}>
                                            <div>
                                                <small>{match.area ? 'Địa điểm: ' + match.area : ''}</small>
                                            </div>
                                            <div className={cx('match-top', 'team')}>
                                                <span className={cx('image')}></span>
                                                <span className={cx('name')}>{match.firstPlayer?.studentName}</span>
                                                <span className={cx('score')}>{match.firstPlayer?.point}</span>
                                            </div>

                                            <div className={cx('match-bottom', 'team')}>
                                                <span className={cx('image')}></span>
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
                                            className={cx('match', 'winner-top', 'winner-bottom', 'hidden')}
                                            key={match.id}
                                        >
                                            <div>
                                                <small>{match.area ? 'Địa điểm: ' + match.area : ''}</small>
                                            </div>

                                            <div className={cx('match-top', 'team')}>
                                                <span className={cx('image')}></span>
                                                <span className={cx('name')}>{match.firstPlayer?.studentName}</span>
                                                <span className={cx('score')}>{match.firstPlayer?.point}</span>
                                            </div>

                                            <div className={cx('match-bottom', 'team')}>
                                                <span className={cx('image')}></span>
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
                                    <div className={cx('match', 'winner-bottom', 'winner-top')} key={match.id}>
                                        <div>
                                            <small>{match.area ? 'Địa điểm: ' + match.area : ''}</small>
                                        </div>
                                        <div className={cx('match-top', 'team')}>
                                            <span className={cx('image')}></span>
                                            <span className={cx('name')}>{match.firstPlayer?.studentName}</span>
                                            <span className={cx('score')}>{match.firstPlayer?.point}</span>
                                        </div>
                                        <div className={cx('match-bottom', 'team')}>
                                            <span className={cx('image')}></span>
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
