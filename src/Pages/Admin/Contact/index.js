import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import classNames from 'classnames/bind';

import styles from './Contact.module.scss';
import ViewContact from "./ViewContact";

const cx = classNames.bind(styles)

function Contact() {

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h1>Quản lý liên hệ</h1>
                    <Button variant="contained" color="success"><Link to="./edit">Chỉnh sửa thông tin liên hệ</Link></Button>
                </div>
                <ViewContact />
            </div>
        </div>
    );
}

export default Contact;
