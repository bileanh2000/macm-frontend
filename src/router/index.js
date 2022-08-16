import { HeaderOnly } from '../Components/Layout';
import AdminHomePage from '../Pages/Admin/Home';
// import UserManagementPage from '../Pages/Admin/User-management';

import UserProfile from 'src/Pages/User/Profile/UserProfile';
import EditUserProfile from 'src/Pages/User/Profile/EditUserProfile';
import UserTournament from 'src/Pages/User/Tournament';
import UserTournamentDetail from 'src/Pages/User/Tournament/DetailTournament';

import LoginPage from '../Pages/Login';
import ClubFee from '../Pages/Admin/ClubFee';
import MembershipFee from '../Pages/Admin/ClubFee/MembershipFee';
import FacilityFee from '../Pages/Admin/ClubFee/FacilityFee';
import ListEventsFee from '../Pages/Admin/ClubFee/ListEventsFee';
import EventFee from '../Pages/Admin/ClubFee/ListEventsFee/EventFee';
import ListTournament from 'src/Pages/Admin/ClubFee/ListTournament';
import TournamentFee from 'src/Pages/Admin/ClubFee/ListTournament/TournamentFee';
import TournamentFeeReport from 'src/Pages/Admin/ClubFee/ListTournament/TournamentFeeReport';
import ClubFund from 'src/Pages/Admin/ClubFee/ClubFund';

import ReportMembership from '../Pages/Admin/ClubFee/MembershipFee/ReportMembership';
import ReportEvent from '../Pages/Admin/ClubFee/ListEventsFee/EventFeeReport';
import Report from '../Pages/Admin/ClubFee/Report';
import Contact from '../Pages/Admin/Contact';
import Event from '../Pages/Admin/Event';

import AddEvent from '../Pages/Admin/Event/AddEvent';
// import EventDetails from '../Pages/Admin/Event/EventDetail';
import EventDetails from '../Pages/Admin/Event/EventDetails';
import MemberEvent from '../Pages/Admin/Event/MenberEvent';
import MemberCancelEvent from '../Pages/Admin/Event/MenberEvent/MemberCancelEvent';
import AddToAdmin from '../Pages/Admin/Event/MenberEvent/AddMemberToAdminEvent';

import Facility from '../Pages/Admin/Facility';
import FacilityReport from '../Pages/Admin/ClubFee/FacilityFee/FacilityReport';
import News from '../Pages/Admin/News';
import NewsDetail from '../Pages/Admin/News/NewsDetail/NewsDetail';
import EditNews from '../Pages/Admin/News/EditNews/EditNews';
import CreateNews from '../Pages/Admin/News/CreateNews/CreateNews';
import Rules from '../Pages/Admin/Rules';
import TrainingSchedule from '../Pages/Admin/TrainingSchedule';

import Tournament from '../Pages/Admin/Tournament';
import DetailTournament from '../Pages/Admin/Tournament/DetailTournament';
import CreateTourament from '../Pages/Admin/Tournament/CreateTournament';
import UpdateTournament from '../Pages/Admin/Tournament/UpdateTournament';
import TournamentSchedule from '../Pages/Admin/Tournament/TournamentSchedule';
import UpdateTouramentSchedule from '../Pages/Admin/Tournament/TournamentSchedule/UpdateTouramentSchedule';
import AdminTournament from '../Pages/Admin/Tournament/AdminTournament';
import AddAdminTourament from '../Pages/Admin/Tournament/AdminTournament/AddAdminTourament';
import UpdateAdminTournament from '../Pages/Admin/Tournament/AdminTournament/UpdateAdminTournament';
import MemberTournament from '../Pages/Admin/Tournament/MemberTournament';
import TournamentBracket from '../Pages/Admin/Tournament/TournamentBracket';

import CreateRule from '../Pages/Admin/Rules/CreateRule/CreateRule';
import EditRule from '../Pages/Admin/Rules/EditRule/EditRule';
import EditContact from '../Pages/Admin/Contact/EditContact/EditContact';
import MemberAndCollabPage from '../Pages/Admin/User-management/MemberAndCollaborator';
import HeadOfDepartment from '../Pages/Admin/User-management/HeadOfDepartment';
import UserDetailPage from '../Pages/UserDetail';
import UserDetailEditPage from '../Pages/UserDetail/edit';
import AddUserPage from '../Pages/Admin/addUser';
import Home from '../Pages/Home/index';
import AddTrainingSchedulePage from '../Pages/Admin/TrainingSchedule/addSchedule';
import UpdateTrainingSchedulePage from '../Pages/Admin/TrainingSchedule/editSession';
import addSessionPage from '../Pages/Admin/TrainingSchedule/addSession';
import EditEvent from '../Pages/Admin/Event/EditEvent';

import Attendance from 'src/Pages/Admin/Attendance';
import EditAttendance from 'src/Pages/Admin/Attendance/EditAttendance';
import ReportAttendance from 'src/Pages/Admin/Attendance/ReportAttendance';
import TakeAttendance from 'src/Pages/Admin/Attendance/TakeAttendance';
import ViewEventSchedule from 'src/Pages/Admin/Event/ViewEventSchedule';
import EditEventSchedule from 'src/Pages/Admin/Event/EditEventSchedule';
import ReportFacility from 'src/Pages/Admin/Facility/ReportFacility';
import QRScanner from 'src/Pages/Admin/Attendance/QRScan';
import CheckAttendanceDate from 'src/Pages/Admin/Attendance/QRScan/CheckAttendanceDate';
import AddMemberToEvent from 'src/Pages/Admin/Event/MenberEvent/AddMemberToEvent';
import ForbiddenPage from 'src/Pages/ForbiddenPage';

import EventListPage from 'src/Pages/User/Events';
import ErrorPage from 'src/Pages/ErrorPage';
import EventDetail from 'src/Pages/User/Events/EventDetail';
import Notification from 'src/Pages/Notification';
import AttendanceReport from 'src/Pages/Home/AttendanceReport';
import Rule from 'src/Pages/User/Rule';

import UserEventDetails from 'src/Pages/User/Events/EventDetails';

const adminRouters = [
    // { path: '/:userId', component: UserProfile, layout: HeaderOnly },
    // { path: '/:userId/edit', component: EditUserProfile, layout: HeaderOnly },
    // { path: '/tournament', component: UserTournament, layout: HeaderOnly },
    // { path: '/tournament/:tournamentId', component: UserTournamentDetail, layout: HeaderOnly },

    { path: '/home', component: Home, layout: HeaderOnly },
    { path: '/admin', component: AdminHomePage },
    { path: '/admin/headofdepartment', component: HeadOfDepartment },
    { path: '/admin/member', component: MemberAndCollabPage },
    { path: '/admin/member/:userId', component: UserDetailPage },
    { path: '/admin/headofdepartment/:userId', component: UserDetailPage },
    { path: '/admin/member/:userId/edit', component: UserDetailEditPage },
    { path: '/admin/headofdepartment/:userId/edit', component: UserDetailEditPage },
    // { path: '/admin/adduser', component: AddUserPage },
    { path: '/admin/trainingschedule', component: TrainingSchedule },

    // Training schedule paths
    { path: '/admin/trainingschedules', component: TrainingSchedule },

    //Contact paths
    { path: '/admin/contact', component: Contact },
    { path: '/admin/contact/edit', component: EditContact },

    //Attendance paths
    { path: '/admin/attendance', component: Attendance },
    { path: '/admin/editattendance', component: EditAttendance },
    { path: '/admin/attendance/take', component: TakeAttendance },
    { path: '/admin/attendance/report', component: ReportAttendance },
    { path: '/admin/attendance/scanqrcode', component: CheckAttendanceDate },

    //Club fee paths
    // { path: '/admin/clubfee', component: ClubFee },
    { path: '/admin/membership', component: MembershipFee },
    { path: '/admin/membership/report', component: ReportMembership },
    { path: '/admin/clubfee/event', component: ListEventsFee },
    { path: '/admin/clubfee/event/:eventId', component: EventFee },
    { path: '/admin/clubfee/event/:eventId/report', component: ReportEvent },
    { path: '/admin/clubfee/tournaments', component: ListTournament },
    { path: '/admin/clubfee/tournaments/:tournamentId', component: TournamentFee },
    { path: '/admin/clubfee/tournaments/:tournamentId/report/:typeId', component: TournamentFeeReport },
    { path: '/admin/fund', component: ClubFund },

    //Rule paths
    { path: '/admin/rules/*', component: Rules },
    { path: '/admin/rules/create', component: CreateRule },
    { path: '/admin/rules/edit', component: EditRule },

    //Tournament
    { path: '/admin/tournament', component: Tournament },
    { path: '/admin/tournament/:tournamentId', component: DetailTournament },
    // { path: '/admin/tournament/create', component: CreateTourament },
    // { path: '/admin/tournament/:tournamentId/update', component: UpdateTournament },
    // { path: '/admin/tournament/:tournamentId/tournamentschedule', component: TournamentSchedule },
    {
        path: '/admin/tournament/:tournamentId/tournamentschedule/:tournamentScheduleId/update',
        component: UpdateTouramentSchedule,
    },
    { path: '/admin/tournament/:tournamentId/admin', component: AdminTournament },
    { path: '/admin/tournament/:tournamentId/admin/addadmin', component: AddAdminTourament },
    { path: '/admin/tournament/:tournamentId/admin/update', component: UpdateAdminTournament },
    { path: '/admin/tournament/:tournamentId/members', component: MemberTournament },
    { path: '/admin/tournament/:tournamentId/tournamentbracket', component: TournamentBracket },

    //News paths
    { path: '/admin/news', component: News },
    { path: '/admin/news/create', component: CreateNews },
    { path: '/admin/news/:newsId/edit', component: EditNews },
    { path: '/admin/news/:newsId', component: NewsDetail },

    //Event paths
    { path: '/admin/events', component: Event },
    { path: '/admin/events/:id', component: EventDetails },
    { path: '/admin/events/add', component: AddEvent },
    { path: '/admin/events/:id/edit', component: EditEvent },
    { path: '/admin/events/:id/edit/eventschedule', component: EditEventSchedule },
    // { path: '/admin/events/:id/eventschedule/:eventScheduleId/edit', component: EditEventSchedule },
    { path: '/admin/events/:id/members', component: MemberEvent },
    { path: '/admin/events/:id/membercancel', component: MemberCancelEvent },
    { path: '/admin/events/:id/member/addtoadmin', component: AddToAdmin },
    { path: '/admin/events/:id/member/addmember', component: AddMemberToEvent },
    // Facility paths
    // { path: '/admin/facility', component: Facility },
    // { path: '/admin/facility/reports', component: ReportFacility },
    //Login
    // { path: '/', component: LoginPage, layout: null },
    // Notifications
    { path: '/notifications', component: Notification, layout: HeaderOnly },

    //User
];

const userRouter = [
    { path: '/events', component: EventListPage, layout: HeaderOnly },
    { path: '/events/:id', component: UserEventDetails, layout: HeaderOnly },
    { path: '/home', component: Home, layout: HeaderOnly },

    { path: '/rule', component: Rule, layout: HeaderOnly },
    //{ path: '/:userId', component: UserProfile, layout: HeaderOnly },
    //{ path: '/:userId/edit', component: EditUserProfile, layout: HeaderOnly },

    { path: '/rule', component: Rule, layout: HeaderOnly },
    { path: '/profile/:userId', component: UserProfile, layout: HeaderOnly },
    { path: '/profile/:userId/edit', component: EditUserProfile, layout: HeaderOnly },

    { path: '/tournament', component: UserTournament, layout: HeaderOnly },
    { path: '/tournament/:tournamentId', component: UserTournamentDetail, layout: HeaderOnly },
    // 403 Page
    { path: '/forbidden', component: ForbiddenPage, layout: null },

    // 404 Page
    { path: '*', component: ErrorPage, layout: null },

    // Notifications
    { path: '/notifications', component: Notification, layout: HeaderOnly },

    //Attendance Report

    { path: '/report/attendance', component: AttendanceReport, layout: HeaderOnly },
];

export { adminRouters, userRouter };
