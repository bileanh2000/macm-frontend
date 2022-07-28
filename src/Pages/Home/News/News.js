import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Avatar, Box, Button, Grid, Menu, MenuItem, Pagination, Paper, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import styles from './News.module.scss';
import userApi from 'src/api/userApi';

const cx = classNames.bind(styles);
function News({ name, studentId, roleName, email, isAdmin }) {
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        const generateQrCode = async () => {
            try {
                const params = {
                    email: email,
                    studentId: studentId,
                    name: name,
                    date: new Date(),
                };
                const response = await userApi.generateQrCode(params);
                console.log('QRCode', response);
                console.log('QRCode', response.data);
                setQrCode(response.data);
            } catch (error) {
                console.log('failed when generateQrCode', error);
            }
        };
        generateQrCode();
    }, []);

    return (
        <Paper>
            <img src={qrCode} alt="qrcode" width="100%" />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '0px 0px 8px 0px',
                    alignItems: 'center',
                }}
            >
                <Typography>{roleName}</Typography>
                <Typography>{studentId}</Typography>
                <Typography>{name}</Typography>

                {isAdmin ? (
                    <Button>
                        <Link to="/admin">Chuyển sang trang quản trị</Link>
                    </Button>
                ) : null}
            </Box>
        </Paper>
    );
}

export default News;
