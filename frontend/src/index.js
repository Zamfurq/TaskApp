import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import RootLayout from './layout/layout';
import Register from './pages/Register';
import Login from './pages/Login';
import Error from './pages/Error';
import TaskList from './pages/TaskList';
import Protected from './component/protected';
import TaskUpsert from './pages/TaskUpsert';
import {store} from './store/store';
import {Provider} from 'react-redux';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={ <RootLayout />}>
      <Route path='/' element={<App />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/Login' element={<Login />} />
      <Route path='*' element={<Error />}/>
      <Route element={<Protected />}>
        <Route path='/TaskList' element={<TaskList />}/>
        <Route path='/TaskUpsert' element={<TaskUpsert />}/>
        <Route path='/TaskUpsert/:taskID' element={<TaskUpsert />}/>
      </Route>
    </Route>
  
))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />  
    </Provider>
  </React.StrictMode>
);


