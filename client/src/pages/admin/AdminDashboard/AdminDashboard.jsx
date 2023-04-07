import React from 'react';

import Navigation from '../../../components/admin/Navigation/Navigation';

const AdminDashboard = () =>{
    return(
        <div>
        <Navigation/>
            <p> Welcome, Master Admin! </p>
            <div> This is the admin dashboard </div>
        </div>
    )
}

export default AdminDashboard;