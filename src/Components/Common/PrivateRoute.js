import React from 'react';
import { Route, Navigate, Routes, Fragment } from 'react-router-dom';
import { privateRouters } from 'src/router';
import { DefaultLayout } from '../Layout';

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
    // <Routes>
    //     {privateRouters.map((route, index) => {
    //         const Page = route.component;
    //         let Layout = DefaultLayout;

    //         if (route.layout) {
    //             Layout = route.layout;
    //         } else if (route.layout === null) {
    //             Layout = Fragment;
    //         }
    //         return (
    //             <Route
    //                 key={index}
    //                 path={route.path}
    //                 element={
    //                     <Layout>
    //                         <Page />
    //                     </Layout>
    //                 }
    //             />
    //         );
    //     })}
    // </Routes>

    <Route
        {...rest}
        render={(props) =>
            authenticated ? (
                <Component {...rest} {...props} />
            ) : (
                <Navigate
                    to={{
                        pathname: '/',
                        state: { from: props.location },
                    }}
                />
            )
        }
    />
);

export default PrivateRoute;
