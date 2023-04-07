import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'

import Navigation from './components/admin/Navigation/Navigation';

/////Pages
import LoginPage from './pages/common/login/LoginPage';
//admin
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import ManageTeachers from './pages/admin/ManageTeachers/ManageTeachers';
import ManageStudents from './pages/admin/ManageStudents/ManageStudents';
import ManageAdmins from './pages/admin/ManageAdmins/ManageAdmins';
import ManageAnnouncements from './pages/admin/ManageAnnouncements/ManageAnnouncements';
import ManageLearningMaterials from './pages/admin/ManageLearningMaterials/ManageLearningMaterials';
import MyAccount from './pages/admin/MyAccount/MyAccount';

function App() {
  return (
    <Routes>
          <Route exact path="/" element={<LoginPage/>} />
          <Route path ="admin-dashboard" element ={<AdminDashboard/>}/>
          <Route path ="manage-teachers" element ={<ManageTeachers/>}/>
          <Route path ="manage-students" element ={<ManageStudents/>}/>
          <Route path ="manage-admins" element ={<ManageAdmins/>}/>
          <Route path ="manage-announcements" element ={<ManageAnnouncements/>}/>
          <Route path ="manage-learning-materials" element ={<ManageLearningMaterials/>}/>
          <Route path ="my-account" element ={<MyAccount/>}/>
          
    </Routes>
  );
}

export default App;
