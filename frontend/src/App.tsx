import { useContext } from "react";
import {
 BrowserRouter as Router,
 Routes,
 Route,
 Navigate,
 Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTask from "./pages/Admin/ManageTask";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTask from "./pages/User/MyTask";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import UserContextProvider from "./context/UserContext";
import { UserContext } from "./context/userContextValue";

const App = () => {
 return (
  <UserContextProvider>
   <>
    <Router>
     <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />

      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
       <Route path="/admin/dashboard" element={<Dashboard />} />
       <Route path="/admin/tasks" element={<ManageTask />} />
       <Route path="/admin/create-task" element={<CreateTask />} />
       <Route path="/admin/users" element={<ManageUsers />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["user", "member"]} />}>
       <Route path="/user/dashboard" element={<UserDashboard />} />
       <Route path="/user/tasks" element={<MyTask />} />
       <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
      </Route>

      <Route path="/" element={<Root />}/>
      <Route path="*" element={<Navigate to="/" replace />} />
     </Routes>
    </Router>
   </>

   <Toaster
    toastOptions={{
     className: "",
     style: {
      fontSize: "13px",
     },
    }}
   />
  </UserContextProvider>
 );
};

export default App;

const Root = () => {
  const {user, loading} = useContext(UserContext)!

  if (loading) return <Outlet />

  if(!user){
    return <Navigate to="/login"  />
  }

  return user.role === 'admin' ? <Navigate to="/admin/dashboard"  /> : <Navigate to="/user/dashboard"  />
}
