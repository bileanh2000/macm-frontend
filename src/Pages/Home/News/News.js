

import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './News.module.scss';
import { Grid, Pagination, Stack } from '@mui/material';

import adminNewsAPI from 'src/api/adminNewsAPI';

const cx = classNames.bind(styles);

function News() {
    const [newsList, setNews] = useState([]);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);


    const fetchNewsList = async (pageNo) => {
        try {

            const response = await adminNewsAPI.getAllNotification(pageNo);
            console.log(response);
            setNews(response.data);
            setTotal(response.totalPage);

        } catch (error) {
            console.log('Lấy dữ liệu news thất bại');
        }
    };

    useEffect(() => {

        fetchNewsList(page - 1);
        window.scrollTo({ behavior: 'smooth', top: '0px' });
    }, [page]);

    const handleChange = (event, value) => {
        setPage(value);
    };


    return (
        <div className={cx('news-container')}>
            <h2>Thông báo</h2>

            {newsList.map((news, index) => (
                <div className={cx('news-item')} key={index}>
                    <Grid container spacing={1} className={cx('news-title')}>
                        <Grid item xs={10}>

                            <h3> * {news.message}</h3>
                        </Grid>
                        <Grid item xs={2} className={cx('news-tag')}>
                            <small>
                                {news.notificationType == 0
                                    ? 'Giải đấu'
                                    : news.notificationType == 1
                                    ? 'Sự kiện'
                                    : 'Lịch tập'}
                            </small>
                        </Grid>

                    </Grid>
                    <div className={cx('news-time')}>
                        <small>{news.time}</small>
                    </div>
                </div>
            ))}
            {total > 1 && (
                <Stack spacing={2}>
                    <Pagination count={total} page={page} onChange={handleChange} />
                </Stack>
            )}
        </div>
    );
}

export default News;
