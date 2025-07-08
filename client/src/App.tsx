import { Route, Routes } from 'react-router-dom';
import { 
  Archived, 
  AuthLayout, 
  Dashboard, 
  DashboardLayout,
  ForgotPassword, 
  Home, 
  Members, 
  MyTasks, 
  NotFound, 
  Profile, 
  ProjectDetails, 
  ProjectSettings, 
  ResetPassword, 
  SignIn, 
  SignUp, 
  TaskDetails, 
  UserLayout, 
  Verify2FAEnabledOtp, 
  VerifyEmail, 
  WorkspaceDetails, 
  WorkspaceInvite, 
  Workspaces, 
  WorkspaceSettings
 } from './pages/routes';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthLayout />}>
                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="verify-email" element={<VerifyEmail />} />
                <Route path="verify-otp" element={<Verify2FAEnabledOtp />} />
            </Route>
            <Route path="/" element={<DashboardLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="workspaces" element={<Workspaces />} />
                <Route path="workspaces/:workspaceId" element={<WorkspaceDetails />} />
                <Route
                    path="workspaces/:workspaceId/projects/:projectId"
                    element={<ProjectDetails />}
                />
                <Route
                    path="workspaces/:workspaceId/projects/:projectId/settings"
                    element={<ProjectSettings />}
                />
                <Route
                    path="workspaces/:workspaceId/projects/:projectId/tasks/:taskId"
                    element={<TaskDetails />}
                />
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="members" element={<Members />} />
                <Route path="archived" element={<Archived />} />
                <Route path="workspace-invite/:workspaceId" element={<WorkspaceInvite />} />
                <Route path="settings" element={<WorkspaceSettings />} />
            </Route>

            <Route path="/user" element={<UserLayout />}>
                <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
