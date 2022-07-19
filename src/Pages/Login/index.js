import { Fragment, Component } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import loginApi from 'src/api/loginApi';
import { GOOGLE_AUTH_URL } from '../../constants';
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
            <div className="login-container">
                <div className="login-content">
                    <h1 className="login-title">Login</h1>
                    <SampleLogin />
                </div>
            </div>
        );
    }
}

class SampleLogin extends Component {
    render() {
        return (
            <div className="social-login">
                <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                    Login voi google cdmm
                </a>
            </div>
        );
    }
}

export default Login;
