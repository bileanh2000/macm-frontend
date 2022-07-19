import * as React from 'react';
import classNames from 'classnames/bind';
import Header from '../Components/Header';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children, onLogout }) {
    return (
        <div>
            <Header onLogout={onLogout} />

            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
