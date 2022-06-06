import './App.css';
import { Routes, Route } from 'react-router-dom';
import { privateRouters } from './router';
import { DefaultLayout } from './Components/Layout';

function App() {
    return (
        <div className="App">
            <Routes>
                {privateRouters.map((route, index) => {
                    const Page = route.component;
                    const Layout = DefaultLayout;
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
