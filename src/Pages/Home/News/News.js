import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
    Avatar,
    Box,
    Button,
    Collapse,
    Grid,
    Menu,
    MenuItem,
    Pagination,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import QrCodeIcon from '@mui/icons-material/QrCode';

import styles from './News.module.scss';
import userApi from 'src/api/userApi';
import UpNext from 'src/Pages/Admin/Home/UpNext';

const cx = classNames.bind(styles);
function News({ name, studentId, roleName, email, isAdmin, isActive }) {
    const [qrCode, setQrCode] = useState('');
    const [checked, setChecked] = React.useState(true);

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

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
        <Fragment>
            <Paper sx={{ mb: 2 }}>
                <Button startIcon={<QrCodeIcon />} onClick={handleChange} sx={{ padding: '4px 0px 0px 8px' }}>
                    QRCode
                </Button>
                <Collapse in={checked}>
                    <img src={qrCode} alt="qrcode" width="100%" />
                </Collapse>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        padding: '0px 0px 8px 0px',
                        alignItems: 'center',
                    }}
                >
                    {/* <Typography>{roleName}</Typography> */}
                    <Typography>
                        <strong>{studentId}</strong>
                    </Typography>
                    <Typography>
                        <strong>{name}</strong>
                    </Typography>
                    {isActive === true ? (
                        <Box
                            sx={{
                                backgroundColor: '#56f000',
                                color: '#fff',
                                fontSize: '0.9rem',
                                padding: '5px',
                                borderRadius: '8px',
                                fontWeight: 500,
                            }}
                        >
                            Active
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                backgroundColor: '#fc6262',
                                color: '#fff',
                                fontSize: '0.9rem',
                                padding: '5px',
                                borderRadius: '8px',
                                fontWeight: 500,
                            }}
                        >
                            Deactive
                        </Box>
                    )}

                    {isAdmin ? (
                        <>
                            <Button component={Link} to="/admin/attendance">
                                Điểm danh
                            </Button>
                            <Button component={Link} to="/admin">
                                Trang quản trị
                            </Button>
                        </>
                    ) : null}
                </Box>
            </Paper>
        </Fragment>
    );
}

export default News;
