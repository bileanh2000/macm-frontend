import { Button } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Contact.module.scss';
import ViewContact from './ViewContact';
import { IfAnyGranted } from 'react-authorization';

const cx = classNames.bind(styles);

function Contact() {
    return (
        <IfAnyGranted
            expected={['ROLE_ViceHeadClub', 'ROLE_HeadClub', 'ROLE_HeadCommunication', 'ROLE_ViceHeadCommunication']}
            actual={JSON.parse(localStorage.getItem('currentUser')).role.name}
            unauthorized={<Navigate to="/forbidden" />}
        >
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('header')}>
                        <h1>Quản lý liên hệ</h1>
                        <Button variant="contained" color="success">
                            <Link to="./edit">Chỉnh sửa thông tin liên hệ</Link>
                        </Button>
                    </div>
                    <ViewContact />
                </div>
            </div>
        </IfAnyGranted>
    );
}

export default Contact;
