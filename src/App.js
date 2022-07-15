import { Routes, Route } from 'react-router-dom';
import { privateRouters, publicRouters } from './router';
import { DefaultLayout } from './Components/Layout';
import { useEffect, useState, Fragment } from 'react';
import productApi from './api/axiosClient';
import { SnackbarProvider } from 'notistack';
import Login from './Pages/Login';

function App() {
    const [login, setLogin] = useState({ authenticated: true, currentUser: null });
    return (
        <SnackbarProvider maxSnack={4} autoHideDuration={5000} preventDuplicate>
            <div className="App">
                <Routes>
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
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </SnackbarProvider>
    );
}

export default App;
