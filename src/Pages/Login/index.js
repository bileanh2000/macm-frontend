import { Box, Button, Grid, Link, Paper, Typography } from '@mui/material';
import { Fragment, Component } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import loginApi from 'src/api/loginApi';
import { GOOGLE_AUTH_URL, GOOGE_LOGO } from '../../constants';
import GoogleIcon from '@mui/icons-material/Google';
import loginImage from 'src/loginImage.png';
import { useGlobalState } from 'src/state';
import { useSnackbar } from 'notistack';

function Login() {
    const [errorStatus] = useGlobalState('loginErrorStatus');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    if (errorStatus) {
        enqueueSnackbar('Tài khoản của bạn không được phép đăng nhập vào hệ thống', { variant: 'error' });
    }

    return (
        <div className="social-login" style={{ display: 'flex', justifyContent: 'center' }}>
            <Box
                component="a"
                href={GOOGLE_AUTH_URL}
                sx={{
                    display: 'flex',
                    // border: '1px solid black',
                    // backgroundColor: '#1976d2',
                    boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
                    borderRadius: '5px',
                    width: 'fit-content',
                    padding: 1,
                }}
            >
                <img src={GOOGE_LOGO} alt="LOGO GOOGLE" width="25px" />
                <Typography sx={{ ml: 1 }}>Đăng nhập với Email FPT</Typography>
            </Box>
        </div>
    );
}
export default Login;
