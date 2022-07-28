import { Box, Button, Grid, Link, Paper, Typography } from '@mui/material';
import { Fragment, Component } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import loginApi from 'src/api/loginApi';
import { GOOGLE_AUTH_URL, GOOGE_LOGO } from '../../constants';
import GoogleIcon from '@mui/icons-material/Google';
class Login extends Component {
    // componentDidMount() {
    //     // If the OAuth2 login encounters an error, the user is redirected to the /login page with an error.
    //     // Here we display the error and then remove the error query parameter from the location.
    //     if (this.props.location.state && this.props.location.state.error) {
    //         setTimeout(() => {
    //             //   Alert.error(this.props.location.state.error, {
    //             //     timeout: 5000
    //             //   });
    //             this.props.history.replace({
    //                 pathname: this.props.location.pathname,
    //                 state: {},
    //             });
    //         }, 100);
    //     }
    // }

    render() {
        // if (this.props.authenticated) {
        //     return (
        //         <Navigate
        //             to={{
        //                 pathname: '/',
        //                 state: { from: this.props.location },
        //             }}
        //         />
        //     );
        // }

        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{
                    minHeight: '100vh',
                    backgroundImage:
                        'url(https://trovetuoitho.com/wp-content/uploads/2020/03/Webp.net-compress-image-16.jpg)',
                    backgroundSize: 'cover',
                }}
            >
                <Grid item xs={3}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h5">MACM - Martial Arts Club Management</Typography>
                        <SampleLogin />
                    </Paper>
                </Grid>
            </Grid>
            // <div className="login-container">
            //     <div className="login-content">
            //         <h1 className="login-title">Login</h1>
            //         <SampleLogin />
            //     </div>
            // </div>
        );
    }
}

class SampleLogin extends Component {
    render() {
        return (
            <div className="social-login">
                {/* <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/300px-Google_%22G%22_Logo.svg.png"
                        alt="logo google"
                    />
                    Đăng nhập bằng Google
                </a> */}

                <Box component="a" href={GOOGLE_AUTH_URL}>
                    <img src={GOOGE_LOGO} alt="LOGO GOOGLE" width="50px" />
                    <Typography>Đăng nhập với Google</Typography>
                </Box>
            </div>
        );
    }
}

export default Login;
