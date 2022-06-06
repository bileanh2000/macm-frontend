import AdminHomePage from '../Pages/Admin/Home';
import UserManagementPage from '../Pages/Admin/User-management';

const privateRouters = [
    { path: '/admin', component: AdminHomePage },
    { path: '/admin/users', component: UserManagementPage },
];

const publicRouters = [];

export { privateRouters, publicRouters };
