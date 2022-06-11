import { HeaderOnly } from '../Components/Layout';
import AdminHomePage from '../Pages/Admin/Home';
import UserManagementPage from '../Pages/Admin/User-management';
import LoginPage from '../Pages/Login';
import ClubFee from '../Pages/Admin/ClubFee';
import Contact from '../Pages/Admin/Contact';
import Event from '../Pages/Admin/Event';
import Facility from '../Pages/Admin/Facility';
import News from '../Pages/Admin/News';
import Rules from '../Pages/Admin/Rules';
import TrainingSchedule from '../Pages/Admin/TrainingSchedule';
import Tournament from '../Pages/Admin/Tournament';
import MemberAndCollabPage from '../Pages/Admin/User-management/MemberAndCollaborator';
import HeadOfDepartment from '../Pages/Admin/User-management/HeadOfDepartment';
import UserDetailPage from '../Pages/UserDetail';
import UserDetailEditPage from '../Pages/UserDetail/edit';
import AddUserPage from '../Pages/Admin/addUser';

const privateRouters = [
    { path: '/', component: LoginPage, layout: null },
    { path: '/admin', component: AdminHomePage },
    { path: '/admin/headofdepartment', component: HeadOfDepartment },
    { path: '/admin/member', component: MemberAndCollabPage },
    { path: '/admin/member/:userId', component: UserDetailPage },
    { path: '/admin/headofdepartment/:userId', component: UserDetailPage },
    { path: '/admin/member/:userId/edit', component: UserDetailEditPage },
    { path: '/admin/headofdepartment/:userId/edit', component: UserDetailEditPage },
    { path: '/admin/adduser', component: AddUserPage },
    { path: '/admin/facility', component: Facility },
    { path: '/admin/trainingschedule', component: TrainingSchedule },
    { path: '/admin/contact', component: Contact },
    { path: '/admin/clubfee', component: ClubFee },
    { path: '/admin/rules', component: Rules },
    { path: '/admin/tournament', component: Tournament },
    { path: '/admin/news', component: News },
    { path: '/admin/events', component: Event },
];

const publicRouters = [];

export { privateRouters, publicRouters };
