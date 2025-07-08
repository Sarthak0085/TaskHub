import Home from '@/pages/home';
import NotFound from '@/pages/not-found';
import AuthLayout from '@/pages/auth/auth-layout';
import SignIn from '@/pages/auth/sign-in';
import SignUp from '@/pages/auth/sign-up';
import ForgotPassword from '@/pages/auth/forgot-password';
import ResetPassword from '@/pages/auth/reset-password';
import VerifyEmail from '@/pages/auth/verify-email';
import DashboardLayout from '@/pages/dashboard/dashboard-layout';
import Workspaces from '@/pages/dashboard/workspaces';
import Dashboard from '@/pages/dashboard';
import WorkspaceDetails from '@/pages/dashboard/workspaces/workspace-details';
import ProjectDetails from '@/pages/dashboard/project/project-details';
import TaskDetails from '@/pages/dashboard/task/task-details';
import MyTasks from '@/pages/dashboard/my-tasks';
import Members from '@/pages/dashboard/members';
import WorkspaceInvite from '@/pages/dashboard/workspaces/workspace-invite';
import Profile from '@/pages/user/profile';
import UserLayout from '@/pages/user/user-layout';
import ProjectSettings from '@/pages/dashboard/project/project-settings';
import WorkspaceSettings from '@/pages/dashboard/workspaces/workspace-settings';
import Archived from '@/pages/dashboard/archived';
import Verify2FAEnabledOtp from '@/pages/auth/verify-otp';


export {
    Home,
    NotFound,
    SignIn,
    SignUp,
    AuthLayout,
    ForgotPassword,
    ResetPassword,
    VerifyEmail,
    Verify2FAEnabledOtp,
    DashboardLayout,
    Dashboard,
    TaskDetails,
    WorkspaceDetails,
    WorkspaceInvite,
    Workspaces,
    WorkspaceSettings,
    Profile,
    ProjectDetails,
    ProjectSettings,
    UserLayout,
    Members,
    MyTasks,
    Archived
}
