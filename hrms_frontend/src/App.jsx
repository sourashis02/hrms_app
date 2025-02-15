import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PageLayout from "./components/PageLayout";
import Employees from "./pages/Employees";
import Leaves from "./pages/Leaves";
import LeaveRequest from "./pages/LeaveRequest";
import CreateEmployee from "./pages/CreateEmployee";

export const API_URL = `${import.meta.env.VITE_API_URL}`;

function PrivateRoute({ element }) {
  const { auth } = useSelector(state => state.auth);
  return auth ? element : <Navigate to="/login" replace />;
}

function PublicRoute({ element }) {
  const { auth } = useSelector(state => state.auth);
  return !auth ? element : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoute element={<Login />} />
  },
  {
    path: "/",
    element: <PrivateRoute element={<PageLayout />} />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "employees",
        element: <Employees />
      },
      {
        path: "leaves",
        element: <Leaves />
      },
      {
        path: "leaverequest",
        element: <LeaveRequest />
      },
      {
        path: "createemployee",
        element: <CreateEmployee />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
