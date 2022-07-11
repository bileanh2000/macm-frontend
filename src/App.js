import { Routes, Route } from 'react-router-dom';
import { privateRouters } from './router';
import { DefaultLayout } from './Components/Layout';
import { useEffect, useState, Fragment } from 'react';
import productApi from './api/axiosClient';
import { Google } from '@mui/icons-material';

function App() {
    return (
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
    );
}

export default App;
