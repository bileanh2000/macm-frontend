import { Routes, Route, Navigate } from 'react-router-dom';
import { privateRouters, publicRouters } from './router';
import { DefaultLayout } from './Components/Layout';
import { useEffect, useState, Fragment, Component } from 'react';
import productApi from './api/axiosClient';
import { SnackbarProvider } from 'notistack';
import Login from './Pages/Login';
import { getCurrentUser } from './api/APIUtils';

import LoadingProgress from './Components/LoadingProgress';
import { ACCESS_TOKEN } from './constants';
import PrivateRoute from './Components/Common/PrivateRoute';
import OAuth2RedirectHandler from './oauth2/OAuth2RedirectHandler';
import Home from './Pages/Admin/Home';

// function App() {
//     const [login, setLogin] = useState({ authenticated: true, currentUser: null });
//     return (
//         <SnackbarProvider maxSnack={4} autoHideDuration={5000} preventDuplicate>
//             <div className="App">
//                 <Routes>
//                     {privateRouters.map((route, index) => {
//                         const Page = route.component;
//                         let Layout = DefaultLayout;

//                         if (route.layout) {
//                             Layout = route.layout;
//                         } else if (route.layout === null) {
//                             Layout = Fragment;
//                         }
//                         return (
//                             <Route
//                                 key={index}
//                                 path={route.path}
//                                 element={
//                                     <Layout>
//                                         <Page />
//                                     </Layout>
//                                 }
//                             />
//                         );
//                     })}
//                 </Routes>
//             </div>
//         </SnackbarProvider>
//     );
// }

// export default App;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            currentUser: null,
            loading: false,
        };

        this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    loadCurrentlyLoggedInUser() {
        this.setState({
            loading: true,
        });

        getCurrentUser()
            .then((response) => {
                this.setState({
                    currentUser: response,
                    authenticated: true,
                    loading: false,
                });
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                });
            });
    }

    handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem('currentUser');
        this.setState({
            authenticated: false,
            currentUser: null,
        });
        console.log('logout thanh cong');
    }

    componentDidMount() {
        this.loadCurrentlyLoggedInUser();
    }

    render() {
        if (this.state.loading) {
            return <LoadingProgress />;
        }

        return (
            <div className="app">
                <Routes>
                    <Route
                        path="/"
                        // render={(props) => <Login authenticated={this.state.authenticated} {...props} />}
                        // element={this.state.authenticated ? <Navigate to="/home" /> : <Login />}
                        element={<Login />}
                    ></Route>
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />}></Route>
                    {privateRouters.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    localStorage.getItem(ACCESS_TOKEN) ? (
                                        <Layout onLogout={this.handleLogout}>
                                            <Page />
                                        </Layout>
                                    ) : (
                                        <Navigate to="/" />
                                    )
                                }
                            />
                        );
                    })}
                </Routes>

                {/* <Alert stack={{ limit: 3 }} timeout={3000} position="top-right" effect="slide" offset={65} /> */}
            </div>
        );
    }
}

export default App;
