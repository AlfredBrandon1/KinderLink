import React from "react";

import Navigation from "../../components/admin/Navigation/Navigation"
import CalendarWidget from "../../components/admin/CalendarWidget";

const ManageAnnouncements = () => {
    return(
        <div>
            <Navigation/>
            This is the Manage announcements page
            <CalendarWidget/>
        </div>
    )
}

export default ManageAnnouncements;