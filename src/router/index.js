import { HeaderOnly } from '../Components/Layout';
import AdminHomePage from '../Pages/Admin/Home';
import UserManagementPage from '../Pages/Admin/User-management';
import LoginPage from '../Pages/Login';

const privateRouters = [
    { path: '/', component: LoginPage, layout: null },
    { path: '/admin', component: AdminHomePage },
    { path: '/admin/users', component: UserManagementPage },
];

const publicRouters = [];

export { privateRouters, publicRouters };
