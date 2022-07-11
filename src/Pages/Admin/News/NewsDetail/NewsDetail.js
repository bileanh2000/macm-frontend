import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Visibility, VisibilityOff, Edit, Delete } from '@mui/icons-material';
import { Button } from '@mui/material';

import styles from './NewDeatil.module.scss';
import adminNewsAPI from 'src/api/adminNewsAPI';
import DialogCommon from "src/Components/Dialog/Dialog";

const cx = classNames.bind(styles)

function NewsDetail() {
    const location = useLocation();
    const news = location.state?.news;
    const history = useNavigate()

    console.log('detail', news)

    const [dialog, setDialog] = useState({
        message: "",
        isLoading: false,
        params: -1
    });
    const handleDialog = (message, isLoading, params) => {
        setDialog({
            message,
            isLoading,
            params
        });
    };

    const areUSureDelete = (choose) => {
        if (choose) {
            handleDeleteNews(dialog.params)
            handleDialog("", false, -1);
        } else {
            console.log(dialog);
            handleDialog("", false, -1);
        }
    };

    const handleDelete = params => {
        handleDialog("Bạn có chắc chắn muốn xóa không?", true, params);
    }

    const handleDeleteNews = async (id) => {
        try {
            await adminNewsAPI.deleteNews(id)
            history(
                { pathname: '/admin/news' },
                {
                    state:
                    {
                        isSuccess: true,
                        message: "Xóa news thành công",
                        openSnackBar: true
                    }
                })
        } catch (error) {
            history(
                { pathname: '/admin/news' },
                {
                    state:
                    {
                        isSuccess: false,
                        message: "Xóa news thất bại",
                        openSnackBar: true
                    }
                })
        }
    }
    const handleUpdateStatusNews = async (news) => {
        try {
            await adminNewsAPI.updateStatusNews({ ...news, status: !news.status })
            news.status = !news.status
            history(
                { pathname: '/admin/news' },
                {
                    state:
                    {
                        isSuccess: true,
                        message: "Cập nhật trạng thái news thành công",
                        openSnackBar: true
                    }
                })
        } catch (error) {
            history(
                { pathname: '/admin/news' },
                {
                    state:
                    {
                        isSuccess: false,
                        message: "Cập nhật trạng thái news thất bại",
                        openSnackBar: true
                    }
                })
        }
    }
    return (
        <div className={cx('wrapper')}>
            {news && (
                <div className={cx('container')}>
                    <div className={cx('header')}>
                        <h1>{news.title}</h1>
                        <span className={cx('header-button')}>
                            <span style={{ marginRight: 20 }} onClick={() => handleUpdateStatusNews(news)}>
                                {news.status === true ? <Visibility /> : <VisibilityOff />}
                            </span>
                            <span style={{ marginRight: 20 }}
                                onClick={() => history(
                                    { pathname: `/admin/news/${news.id}/edit` },
                                    {
                                        state: {
                                            id: news.id,
                                            title: news.title,
                                            description: news.description
                                        }
                                    })}
                            >
                                <Edit />
                            </span>
                            <span style={{ marginRight: 20 }} onClick={() => handleDelete(news.id)}>
                                <Delete />
                            </span>
                            <span>
                                <Button variant="contained" color="error">
                                    <Link to="/admin/news">Quay lại</Link>
                                </Button>
                            </span>
                        </span>
                    </div>
                    <div className={cx('content')}>
                        <p>{news.description}</p>
                    </div>
                </div>
            )}
            {dialog.isLoading && (
                <DialogCommon
                    onDialog={areUSureDelete}
                    message={dialog.message}
                    id={dialog.params}
                />
            )}
        </div >
    )
}

export default NewsDetail