import React from 'react'
import classNames from 'classnames/bind'

import styles from './News.module.scss'
import { Grid } from '@mui/material'

const cx = classNames.bind(styles)

const newsList = [
    {
        title: 'Nghỉ tập do trời mưa',
        tag: 'tin tức',
        time: '10:30 - 01/06/2022'
    },
    {
        title: 'Đăng ký tham gia tổ chức sinh nhật thành viên kỳ Spring',
        tag: 'Sự kiện',
        time: '11:30 - 25/05/2022'
    },
    {
        title: 'Thông tin giải đấu nội bộ SU22',
        tag: 'Giải đấu',
        time: '09:10 - 01/06/2022'
    },
    {
        title: 'Du lịch Tam Đảo - Team Building',
        tag: 'Sự kiện',
        time: '10:30 - 26/06/2022'
    }
]

function News() {
    return (
        <div className={cx('news-container')}>
            <h2>News</h2>

            {newsList.map((news, index) => (
                <div className={cx('news-item')} key={index}>
                    <Grid container spacing={1} className={cx('news-title')}>
                        <Grid item xs={10}><h3> * {news.title}</h3></Grid>
                        <Grid item xs={2} className={cx('news-tag')} >
                            <small>{news.tag}</small>
                        </Grid>
                    </Grid>
                    <div className={cx('news-time')}>
                        <small>{news.time}</small>
                    </div>
                </div>
            ))}
            <small className={cx('news-link')}>Xem thêm</small>
        </div>
    )
}

export default News