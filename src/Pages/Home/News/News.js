import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './News.module.scss';
import { Grid } from '@mui/material';
import adminNewsAPI from 'src/api/adminNewsAPI';

const cx = classNames.bind(styles);

function News() {
    const [newsList, setNews] = useState([]);

    const fetchNewsList = async () => {
        try {
            const response = await adminNewsAPI.getNews();
            console.log(response);
            setNews(response.data);
        } catch (error) {
            console.log('Lấy dữ liệu news thất bại');
        }
    };

    useEffect(() => {
        fetchNewsList();
    }, []);

    return (
        <div className={cx('news-container')}>
            <h2>Thông báo</h2>

            {newsList.map((news, index) => (
                <div className={cx('news-item')} key={index}>
                    <Grid container spacing={1} className={cx('news-title')}>
                        <Grid item xs={10}>
                            <h3> * {news.title}</h3>
                        </Grid>
                        {/* <Grid item xs={2} className={cx('news-tag')} >
                            <small>{news.tag}</small>
                        </Grid> */}
                    </Grid>
                    <div className={cx('news-time')}>
                        <small>{news.time}</small>
                    </div>
                </div>
            ))}
            <small className={cx('news-link')}>Xem thêm</small>
        </div>
    );
}

export default News;
