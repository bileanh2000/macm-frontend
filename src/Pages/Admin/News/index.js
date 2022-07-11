import React from 'react'
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import classNames from 'classnames/bind';

import styles from './News.module.scss';
import NewsList from "./NewsList/NewsList";

const cx = classNames.bind(styles)

function News() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h1>Quản lý tin tức</h1>
                    <Button variant="contained" color="success"><Link to="./create" color='white'>Tạo tin mới</Link></Button>
                </div>
                <NewsList />
            </div>
        </div>
    )
}

export default News
