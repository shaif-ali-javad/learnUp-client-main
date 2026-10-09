import { createBrowserRouter } from "react-router";
import HomeLayout from "../Layout/HomeLayout";
import Home from "../pages/Home";
import AuthLayOut from "../Layout/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFoundPage from './../pages/NotFoundPage';
import FindTutors from "../pages/FindTutors";
import TutorDetails from "../pages/TutorDetails";
import AddTutorial from "../pages/AddTutorial";
import MyTutorials from "../pages/MyTutorials";
import BookedTutors from "../pages/BookedTutors";
import ProtectedRoute from "./ProtectedRoute";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "find-tutors",
        Component: FindTutors,
        loader: async () => { return await fetch('https://learnup-server-73jb.onrender.com/my-tutorials').then(res => res.json()) }
      },
      {
        path: "tutor/:id",
        element: <ProtectedRoute><TutorDetails /></ProtectedRoute>,
        loader: async ({ params }) => { return await fetch(`https://learnup-server-73jb.onrender.com/tutor/${params.id}`).then(res => res.json()) }
      },

      {
        path: "add-tutorial",
        element: <ProtectedRoute><AddTutorial /></ProtectedRoute>,

      },
      {
        path: "/my-tutorials",
        element: <ProtectedRoute><MyTutorials /></ProtectedRoute>,
        loader: async () => { return await fetch('https://learnup-server-73jb.onrender.com/my-tutorials').then(res => res.json()) }

      },
      {
        path: "booked-tutors",
        element: <ProtectedRoute><BookedTutors /></ProtectedRoute>,
        loader: async () => {
          const res = await fetch(`https://learnup-server-73jb.onrender.com/booked-tutors`)
          return res.json();
        }
      },


      {
        path: "*",
        element: <NotFoundPage />,



      },
    ]

  },

      {
        path: '/auth',
        Component: AuthLayOut,
        children: [
          {
            path: '/auth/login',
            Component: Login,
          },
          {
            path: '/auth/register',
            Component: Register,
          },
        ]
      },
])
export default Router;
