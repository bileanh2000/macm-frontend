import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import loginApi from 'src/api/loginApi';
function Login() {
    return (
        <Fragment>
            <h1>Login Page</h1>
            <div id="signInDiv"></div>
        </Fragment>
    );
}

export default Login;
