import { useState } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';
import { Link, useLocation } from "react-router-dom";
import classNames from 'classnames/bind';

import styles from '../Rules/ViewRule/ListRule.module.scss';
import ListRule from '../Rules/ViewRule/ListRule'


const cx = classNames.bind(styles)

function Rules() {
    return (
        <div className={cx('wrapper')} >
            <div className={cx('container')}>
                <h1>Quản lý nội quy</h1>
                <Button variant="contained" color="success"><Link to="./create" style={{ color: "white" }}>Tạo nội quy mới</Link></Button>
            </div>
            <ListRule />
        </div>
    )
}

export default Rules;
