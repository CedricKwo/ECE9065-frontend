import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {
  HashRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import Login from './view/login/login';
import Register from './view/register/register';
import Home from './view/home/home';
import MyBookList from './view/mybooklist/mybooklist';
import Cart from './view/cart/cart';
import CreateOrder from './view/createOrder/createOrder';
import MyOrder from './view/myOrder/myOrder';
import Profile from './view/profile/profile';
import Admin from './view/admin/admin';
import ForgetPassword from './view/forgetPassword/forgetPassword';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/mybooklist" element={<MyBookList />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/createOrder" element={<CreateOrder />} />
      <Route path="/myOrder" element={<MyOrder />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
    </Routes>
  </Router>
);
