import * as React from 'react';
import classNames from 'classnames/bind';
import Header from '../Components/Header';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />

            <div className={cx('container')}>
                {/* <DrawerHeader /> */}
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
