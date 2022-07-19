import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { adminRouters, userRouter } from './router';
import { DefaultLayout } from './Components/Layout';
import { useEffect, useState, Fragment, Component } from 'react';
import productApi from './api/axiosClient';
import { SnackbarProvider } from 'notistack';
import Login from './Pages/Login';
import { getCurrentUser } from './api/APIUtils';

import LoadingProgress from './Components/LoadingProgress';
import { ACCESS_TOKEN } from './constants';
// import PrivateRoute from './Components/Common/PrivateRoute';
import OAuth2RedirectHandler from './oauth2/OAuth2RedirectHandler';
import Home from './Pages/Admin/Home';
import ErrorPage from './Pages/ErrorPage';

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
// const USER_ROLE_ID = JSON.parse(localStorage.getItem('currentUser')).role.name || 10;

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
        // this.userRoleId = this.userRoleId.bind(this);
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
    getCurrentUser() {
        if (localStorage.getItem('currentUser')) {
            return JSON.parse(localStorage.getItem('currentUser')).role.id;
        }
    }
    isAdmin() {
        if (
            this.getCurrentUser() === 1 ||
            this.getCurrentUser() === 2 ||
            this.getCurrentUser() === 3 ||
            this.getCurrentUser() === 4 ||
            this.getCurrentUser() === 5 ||
            this.getCurrentUser() === 6 ||
            this.getCurrentUser() === 7 ||
            this.getCurrentUser() === 8 ||
            this.getCurrentUser() === 9
        ) {
            return true;
        } else {
            return false;
        }
    }

    componentDidMount() {
        this.loadCurrentlyLoggedInUser();
    }

    render() {
        // console.log('url path', UrlPath);
        if (this.state.loading) {
            return <LoadingProgress />;
        }

        return (
            <SnackbarProvider maxSnack={4} autoHideDuration={5000} preventDuplicate>
                <div className="app">
                    <Routes>
                        <Route
                            path="/"
                            // render={(props) => <Login authenticated={this.state.authenticated} {...props} />}
                            element={this.state.authenticated ? <Navigate to="/home" /> : <Login />}
                            // element={<Login />}
                        ></Route>
                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />}></Route>
                        {userRouter.map((route, index) => {
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
                        {this.isAdmin()
                            ? adminRouters.map((route, index) => {
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
                              })
                            : null}
                    </Routes>
                    {/* {console.log(this.isAdmin())} */}
                    {/* {alert(JSON.parse(localStorage.getItem('currentUser')).role.id)} */}
                    {/* {window.location.pathname.startsWith('/admin') ? <Navigate to="/forbidden" /> : ''} */}

                    {/* <Alert stack={{ limit: 3 }} timeout={3000} position="top-right" effect="slide" offset={65} /> */}
                </div>
            </SnackbarProvider>
        );
    }
}

export default App;
