import React from "react";
import { Slide } from 'react-slideshow-image'
import classNames from 'classnames/bind';
import Avatar from '@mui/material/Avatar';

import styles from './Slideshow.module.scss';
import 'react-slideshow-image/dist/styles.css'

const cx = classNames.bind(styles)

const slideImages = [
    {
        url: 'https://www.dungplus.com/wp-content/uploads/2019/12/girl-xinh-1-480x600.jpg',
        caption: 'Chủ nhiệm câu lạc bộ',
        name: 'Nguyễn Văn A'
    },
    {
        url: 'https://haycafe.vn/wp-content/uploads/2022/02/Tai-anh-gai-xinh-Viet-Nam-de-thuong.jpg',
        caption: 'Phó chủ nhiệm câu lạc bộ',
        name: 'Nguyễn Thị B'
    },
    {
        url: 'https://anhdep123.com/wp-content/uploads/2021/02/hinh-nen-gai-xinh-full-hd-cho-dien-thoai.jpg',
        caption: 'Trưởng ban văn hóa',
        name: 'Phùng Văn D'
    },
];
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
                slidesToShow: 1,
                slidesToScroll: 2,
            },
        },
    ],
}
function SlideShow() {
    return (
        <div className={cx('slide-container')}>
            <Slide {...properties}>
                {slideImages.map((slideImage, index) => (
                    <div className={cx("out")} key={index}>
                        <div className={cx('card')}>
                            <img
                                className={cx("rounded-circle")}
                                alt={"users here"}
                                src={`${slideImage.url}`}
                                height={250}
                                width={250}
                            />
                            <div className={cx("card-body")}>
                                <br />
                                <p className={cx("card-text")}>{slideImage.caption}</p>
                                <br />
                                <small className={cx("card-title")}>
                                    {slideImage.name}
                                </small>
                                <br />
                            </div>
                        </div>
                    </div>
                ))}
            </Slide>
        </div>
    );
}

export default SlideShow;