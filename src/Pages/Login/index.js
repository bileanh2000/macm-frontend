import { Box, Button, Grid, Link, Paper, Typography } from '@mui/material';
import { Fragment, Component } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import loginApi from 'src/api/loginApi';
import { GOOGLE_AUTH_URL, GOOGE_LOGO } from '../../constants';
// import GoogleIcon from '@mui/icons-material/Google';
import loginImage from 'src/loginImage.png';
import logoImage from 'src/logo.png';
import { useGlobalState } from 'src/state';
import { useSnackbar } from 'notistack';
import GoogleIcon from '@mui/icons-material/Google';
import { Container } from '@mui/system';

function Login() {
    const [errorStatus] = useGlobalState('loginErrorStatus');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    if (errorStatus) {
        enqueueSnackbar('Tài khoản của bạn không được phép đăng nhập vào hệ thống', { variant: 'error' });
    }

    return (
        // <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 4, height: '100vh', flexWrap: 'nowrap' }}>
        //     <Box>
        //         <img src={logoImage} alt="macm logo" style={{ width: '120px' }} />
        //         <Box sx={{ mt: 8 }}>
        //             <Typography
        //                 sx={{ fontSize: '3.5vw', fontWeight: 'bold', lineHeight: '1', color: '#1a2f70', mb: 2 }}
        //             >
        //                 FPTU Martial Arts Clubs Management
        //             </Typography>
        //             <Typography sx={{ color: '#162342', mb: 9, fontWeight: 'bold' }}>
        //                 Ứng Dụng Quản Lý Các Câu Lạc Bộ Võ Thuật tại Đại Học FPT Hòa Lạc
        //             </Typography>
        //             <Box
        //                 component="a"
        //                 href={GOOGLE_AUTH_URL}
        //                 sx={{
        //                     display: 'flex',
        //                     // border: '1px solid black',
        //                     backgroundColor: '#1163c7',
        //                     boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
        //                     borderRadius: '25px',
        //                     width: 'fit-content',
        //                     padding: 1.5,
        //                     color: 'white',
        //                 }}
        //             >
        //                 {/* <img src={GOOGE_LOGO} alt="LOGO GOOGLE" width="25px" /> */}
        //                 <GoogleIcon />
        //                 <Typography sx={{ ml: 1 }}>Đăng nhập với Email FPT</Typography>
        //             </Box>
        //         </Box>
        //     </Box>
        //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
        //         <img src={loginImage} alt="hehe" style={{ width: '55vw' }} />
        //     </Box>
        // </Box>
        <Box
            sx={{
                height: '100vh',
                background:
                    'linear-gradient(0deg, rgba(153,178,255,0.36) 0%, rgba(189,205,255,0.36) 19%, rgba(204,216,255,0.2049194677871149) 43%, rgba(255,255,255,1) 100%)',
            }}
        >
            <Container maxWidth="xl" sx={{ p: 2 }}>
                <img src={logoImage} alt="macm logo" style={{ width: '120px' }} />
                <Box sx={{ padding: '5rem 0 0 0' }}>
                    <Grid container spacing={2}>
                        <Grid item md={6}>
                            <Box sx={{ mt: 8 }}>
                                <Typography
                                    sx={{
                                        fontSize: '3rem',
                                        fontWeight: 'bold',
                                        lineHeight: '1',
                                        color: '#1a2f70',
                                        mb: 2,
                                    }}
                                >
                                    FPTU Martial Arts Club Management
                                </Typography>
                                <Typography sx={{ color: '#162342', mb: 9, fontWeight: 'bold' }}>
                                    Ứng Dụng Quản Lý Câu Lạc Bộ Võ Thuật tại Đại Học FPT Hòa Lạc
                                </Typography>
                                <Box
                                    component="a"
                                    href={GOOGLE_AUTH_URL}
                                    sx={{
                                        display: 'flex',
                                        // border: '1px solid black',
                                        backgroundColor: '#1163c7',
                                        boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
                                        borderRadius: '25px',
                                        width: 'fit-content',
                                        padding: 1.5,
                                        color: 'white',
                                    }}
                                >
                                    {/* <img src={GOOGE_LOGO} alt="LOGO GOOGLE" width="25px" /> */}
                                    <GoogleIcon />
                                    <Typography sx={{ ml: 1 }}>Đăng nhập với Email FPT</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item md={6}>
                            <img src={loginImage} alt="hehe" style={{ maxWidth: '100%', height: 'auto' }} />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
export default Login;
