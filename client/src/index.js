import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './Pages/LoginPage/Login';
import Forgot from './Pages/ForgotPassPage/Forgot';
import Chatbot from './Pages/MainPage/Chatbot Pages/Chatbot/Chatbot';
import Compiler from './Pages/MainPage/Chatbot Pages/Compiler/Compiler';
import Quiz from './Pages/MainPage/Chatbot Pages/Quiz/Quiz';
import Settings from './Pages/MainPage/Chatbot Pages/Settings/Settings';
import Tutorials from './Pages/MainPage/Chatbot Pages/Tutorial/Tutorials';
import 'react-notifications/lib/notifications.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "loginpage",
    element: <Login/>,
  },
  {
    path: "forgotpage",
    element: <Forgot/>,
  },
  
  {
    path: "chatbot",
    element: <Chatbot/>,
  },
  {
    path: "compiler",
    element: <Compiler/>,
  },
  {
    path: "quiz",
    element: <Quiz/>,
  },
  {
    path: "tutorials",
    element: <Tutorials/>,
  },
  {
    path: "settings",
    element: <Settings/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
