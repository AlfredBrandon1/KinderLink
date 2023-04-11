import React from "react";

import Navigation from "../../components/admin/Navigation/Navigation"
import CalendarWidget from "../../components/admin/CalendarWidget";

const ManageAnnouncements = () => {
    return(
        <>
            <Navigation/>
            <p className="page-title"> Announcements and School Calendar </p>
            <div>
            <CalendarWidget/>
            </div>

        </>
    )
}

export default ManageAnnouncements;