import { HeaderOnly } from '../Components/Layout';
import AdminHomePage from '../Pages/Admin/Home';
import UserManagementPage from '../Pages/Admin/User-management';
import LoginPage from '../Pages/Login';
import ClubFee from '../Pages/Admin/ClubFee';
import MembershipFee from '../Pages/Admin/ClubFee/MembershipFee';
import FacilityFee from '../Pages/Admin/ClubFee/FacilityFee';
import ListEventsFee from '../Pages/Admin/ClubFee/ListEventsFee';
import EventFee from '../Pages/Admin/ClubFee/ListEventsFee/EventFee';
import ReportMembership from '../Pages/Admin/ClubFee/MembershipFee/ReportMembership';
import ReportEvent from '../Pages/Admin/ClubFee/ListEventsFee/EventFeeReport';
import Report from '../Pages/Admin/ClubFee/Report';
import Contact from '../Pages/Admin/Contact';
import Event from '../Pages/Admin/Event';

import AddEvent from '../Pages/Admin/Event/AddEvent';
import EventDetails from '../Pages/Admin/Event/EventDetail';
import MemberEvent from '../Pages/Admin/Event/MenberEvent';
import MemberCancelEvent from '../Pages/Admin/Event/MenberEvent/MemberCancelEvent';
import AddToAdmin from '../Pages/Admin/Event/MenberEvent/AddMemberToAdminEvent';

import Facility from '../Pages/Admin/Facility';
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
import MemberTournament from '../Pages/Admin/Tournament/MemberTournament';

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
import TakeAttendance from 'src/Pages/Admin/Attendance/TakeAttendance';
import ViewEventSchedule from 'src/Pages/Admin/Event/ViewEventSchedule';
import EditEventSchedule from 'src/Pages/Admin/Event/EditEventSchedule';

const privateRouters = [
    { path: '/', component: LoginPage, layout: null },
    { path: '/home', component: Home, layout: HeaderOnly },
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

    { path: '/admin/trainingschedules', component: TrainingSchedule },
    { path: '/admin/trainingschedules/add', component: AddTrainingSchedulePage },
    { path: '/admin/trainingschedules/addsession', component: addSessionPage },
    { path: '/admin/trainingschedules/:scheduleId/edit', component: UpdateTrainingSchedulePage },

    //Contact paths
    { path: '/admin/contact', component: Contact },
    { path: '/admin/contact/edit', component: EditContact },

    //Attendance paths
    { path: '/admin/attendance', component: Attendance },
    { path: '/admin/attendance/take', component: TakeAttendance },

    //Club fee paths
    { path: '/admin/clubfee', component: ClubFee },
    { path: '/admin/clubfee/membership', component: MembershipFee },
    { path: '/admin/clubfee/event', component: ListEventsFee },
    { path: '/admin/clubfee/event/:eventId', component: EventFee },
    { path: '/admin/clubfee/event/:eventId/report', component: ReportEvent },
    { path: '/admin/clubfee/facility', component: FacilityFee },
    { path: '/admin/clubfee/membership/report', component: ReportMembership },

    //Rule paths
    { path: '/admin/rules/*', component: Rules },
    { path: '/admin/rules/create', component: CreateRule },
    { path: '/admin/rules/edit', component: EditRule },

    //Tournament
    { path: '/admin/tournament', component: Tournament },
    { path: '/admin/tournament/:tournamentId', component: DetailTournament },
    { path: '/admin/tournament/create', component: CreateTourament },
    { path: '/admin/tournament/:tournamentId/update', component: UpdateTournament },
    { path: '/admin/tournament/:tournamentId/tournamentschedule', component: TournamentSchedule },
    { path: '/admin/tournament/:tournamentId/tournamentschedule/:update', component: UpdateTouramentSchedule },
    { path: '/admin/tournament/:tournamentId/admin', component: AdminTournament },
    { path: '/admin/tournament/:tournamentId/addadmin', component: AddAdminTourament },
    { path: '/admin/tournament/:tournamentId/members', component: MemberTournament },

    //News paths
    { path: '/admin/news', component: News },
    { path: '/admin/news/create', component: CreateNews },
    { path: '/admin/news/:newsId/edit', component: EditNews },
    { path: '/admin/news/:newsId', component: NewsDetail },

    //Event path
    { path: '/admin/events', component: Event },
    { path: '/admin/events/:id', component: EventDetails },
    { path: '/admin/events/add', component: AddEvent },
    { path: '/admin/events/:id/edit', component: EditEvent },
    { path: '/admin/events/:id/eventschedule', component: ViewEventSchedule },
    { path: '/admin/events/:id/eventschedule/:eventScheduleId/edit', component: EditEventSchedule },
    { path: '/admin/events/:id/members', component: MemberEvent },
    { path: '/admin/events/:id/membercancel', component: MemberCancelEvent },
    { path: '/admin/events/:id/member/addtoadmin', component: AddToAdmin },
];

const publicRouters = [];

export { privateRouters, publicRouters };
