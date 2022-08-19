import React, { useEffect, useState } from 'react';
import { Slide } from 'react-slideshow-image';
import classNames from 'classnames/bind';
import userApi from 'src/api/userApi';
import adminContactAPI from 'src/api/adminContactAPI';

import styles from './Slideshow.module.scss';
import 'react-slideshow-image/dist/styles.css';
import { Paper } from '@mui/material';

const cx = classNames.bind(styles);

const url = 'https://cdn.discordapp.com/attachments/981216469176180778/986325284724830288/unknown.png';

const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true,
    slidesToShow: 3,
    responsive: [
        {
            breakpoint: 960,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 425,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 375,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 320,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};
function SlideShow() {
    const [adminList, setAdminList] = useState([]);

    const fetchUserList = async () => {
        try {
            const response = await userApi.getAllAdmin();
            console.log(response);
            setAdminList(response.data);
        } catch (error) {
            console.log('Failed to fetch user list: ', error);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, []);

    return (
        <div className={cx('slide-container')}>
            <Slide {...properties}>
                {adminList.map((admin, index) => (
                    <Paper elevation={3} className={cx('out')} key={index}>
                        <div className={cx('card')}>
                            <img
                                className={cx('rounded-circle')}
                                alt={'users here'}
                                src={admin.image == null ? url : admin.image}
                                // height={250}
                                width="100%"
                                style={{ borderRadius: '5px' }}
                            />
                            <div className={cx('card-body')}>
                                <p className={cx('card-title')}>{admin.name}</p>
                                <p className={cx('card-text')}>{admin.roleName}</p>
                                <p className={cx('card-text')}>
                                    <a href={'tel:' + admin.phone}>{admin.phone}</a>
                                </p>
                            </div>
                        </div>
                    </Paper>
                ))}
            </Slide>
        </div>
    );
}

export default SlideShow;
