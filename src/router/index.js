import { HeaderOnly } from '../Components/Layout';
import AdminHomePage from '../Pages/Admin/Home';
import UserManagementPage from '../Pages/Admin/User-management';
import LoginPage from '../Pages/Login';
import ClubFee from '../Pages/Admin/ClubFee';
import Contact from '../Pages/Admin/Contact';
import Event from '../Pages/Admin/Event';
import Facility from '../Pages/Admin/Facility';
import News from '../Pages/Admin/News';
import NewsDetail from '../Pages/Admin/News/NewsDetail/NewsDetail';
import EditNews from '../Pages/Admin/News/EditNews/EditNews';
import CreateNews from '../Pages/Admin/News/CreateNews/CreateNews';
import Rules from '../Pages/Admin/Rules';
import TrainingSchedule from '../Pages/Admin/TrainingSchedule';
import Tournament from '../Pages/Admin/Tournament';
import CreateRule from '../Pages/Admin/Rules/CreateRule/CreateRule';
import EditRule from '../Pages/Admin/Rules/EditRule/EditRule';
import EditContact from '../Pages/Admin/Contact/EditContact/EditContact';
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

    //Contact paths
    { path: '/admin/contact', component: Contact },
    { path: '/admin/contact/edit', component: EditContact },

    { path: '/admin/clubfee', component: ClubFee },

    //Rule paths
    { path: '/admin/rules/*', component: Rules },
    { path: '/admin/rules/create', component: CreateRule },
    { path: '/admin/rules/edit', component: EditRule },

    { path: '/admin/tournament', component: Tournament },

    //News paths
    { path: '/admin/news', component: News },
    { path: '/admin/news/create', component: CreateNews },
    { path: '/admin/news/:newsId/edit', component: EditNews },
    { path: '/admin/news/:newsId', component: NewsDetail },


    { path: '/admin/events', component: Event },
];

const publicRouters = [];

export { privateRouters, publicRouters };
