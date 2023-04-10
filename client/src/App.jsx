import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'

import Navigation from './components/admin/Navigation/Navigation';

/////Pages
import LoginPage from './pages/common/login/LoginPage';
//admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageStudents from './pages/admin/ManageStudents';
import ManageAdmins from './pages/admin/ManageAdmins';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageLearningMaterials from './pages/admin/ManageLearningMaterials';
import MyAccount from './pages/admin/MyAccount';

//teacher pages
import TeacherDashboard from './pages/teacher/AdminDashboard/AdminDashboard';

function App() {
  return (
    <Routes>

      {/* Admin routes */}
          <Route exact path="/" element={<LoginPage/>} />
          <Route exact path ="/admin-dashboard" element ={<AdminDashboard/>}/>
          <Route exact path ="/manage-teachers" element ={<ManageTeachers/>}/>
          <Route exact path ="/manage-students" element ={<ManageStudents/>}/>
          <Route exact path ="/manage-admins" element ={<ManageAdmins/>}/>
          <Route exact path ="/manage-announcements" element ={<ManageAnnouncements/>}/>
          <Route exact path ="/manage-learning-materials" element ={<ManageLearningMaterials/>}/>
          <Route exact path ="/my-account" element ={<MyAccount/>}/>
      

      {/* Teacher routes */}
        <Route exact path ="/teacher-dashboard" element ={<TeacherDashboard/>}/>

    </Routes>
  );
}

export default App;
