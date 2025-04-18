import React, { JSX } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UrlsTable from './components/UrlsTable';
import { AuthProvider, useAuth } from './context/AuthContext';
import UrlInfo from './components/UrlInfo';
import AboutView from './components/AboutView';
import AboutEdit from './components/AboutEdit';


function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('jwtToken');
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const { role } = useAuth();
  return role === 'Admin' ? children : <Navigate to="/urls" replace />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/urls" element={<PrivateRoute><UrlsTable/></PrivateRoute>} />
        <Route path="/url/:id" element={<PrivateRoute><UrlInfo/></PrivateRoute>} />
        <Route path="/:code" element={<UrlInfo/>} />
        <Route path="/about" element={<AboutView/>} />
        <Route path="/about/edit" element={<AdminRoute><AboutEdit/></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);  
