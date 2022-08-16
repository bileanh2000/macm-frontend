import { ACCESS_TOKEN } from '../constants';
import { Navigate } from 'react-router-dom';
import { useGlobalState, setGlobalState } from 'src/state';

// class OAuth2RedirectHandler extends Component {
//     getUrlParameter(name) {
//         name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
//         var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

//         var results = regex.exec(window.location);
//         return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
//     }

//     render() {
//         const token = this.getUrlParameter('token');
//         const error = this.getUrlParameter('error');

//         if (token) {
//             localStorage.setItem(ACCESS_TOKEN, token);
//             localStorage.setItem('toShowPopup', 'true');
//             return (
//                 <Navigate
//                     to={{
//                         pathname: '/home',
//                         // state: { from: this.props.location },
//                     }}
//                 />
//             );
//         } else {
//             alert(error);
//             return (
//                 <Navigate
//                     to={{
//                         pathname: '/',
//                         state: {
//                             from: this.props.location,
//                             error: error,
//                         },
//                     }}
//                 />
//             );
//         }
//     }
// }
function OAuth2RedirectHandler() {
    const [errorStatus, setErrorStatus] = useGlobalState('loginErrorStatus');
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(window.location);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    const token = getUrlParameter('token');
    const error = getUrlParameter('error');
    if (token) {
        localStorage.setItem(ACCESS_TOKEN, token);
        localStorage.setItem('toShowPopup', 'true');
        localStorage.setItem('toShowRegister', 'true');
        return (
            <Navigate
                to={{
                    pathname: '/',
                    // state: { from: this.props.location },
                }}
            />
        );
    } else {
        setErrorStatus(error);
        return (
            <Navigate
                to={{
                    pathname: '/',
                    // state: {
                    //     from: this.props.location,
                    //     error: error,
                    // },
                }}
            />
        );
    }
    // return ();
}

export default OAuth2RedirectHandler;
