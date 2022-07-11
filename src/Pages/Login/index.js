import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import loginApi from 'src/api/loginApi';

function Login() {
    let navigate = useNavigate();

    const login = () => {
        loginApi.login().then((res) => {
            console.log(res);
        });
    };
    return (
        <Fragment>
            <h1>Login Page</h1>
            <div id="signInDiv"></div>
        </Fragment>
    );
}

export default Login;
