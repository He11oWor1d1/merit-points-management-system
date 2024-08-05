import AdminDashboardSidebar from "./AdminDashboardSidebar.jsx"
import AdminOverview from "./AdminOverview.jsx"
import AdminManageStudents from "./AdminManageStudents.jsx"
import '../css/AdminDashboard.css'
import { Routes, Route } from "react-router-dom"
import { useLocation } from 'react-router-dom'
import AdminManageTeachers from "./AdminManageTeachers.jsx"
import AdminTransactionHistory from "./AdminTransactionHistory.jsx"
import AdminMeritPointRules from "./AdminMeritPointRules.jsx"
import AdminAddRule from "./AdminAddRule.jsx"
import AdminEditMeritPoints from "./AdminEditMeritPoints.jsx"

function AdminDashboard(){
  const location = useLocation().pathname;

  return(
    <>
      <div style={{ display: "flex" }}>
        <AdminDashboardSidebar />
        { location == '/' && <AdminOverview /> }
        { location == '/manage/students' && <AdminManageStudents /> }
        { location == '/manage/teachers' && <AdminManageTeachers /> }
        { location == '/transaction_history' && <AdminTransactionHistory /> }
        { location == '/merit_points_rules' && <AdminMeritPointRules /> }
        { location == '/edit_merit_points' && <AdminEditMeritPoints />}
        { location == '/add_rule' && <AdminAddRule />}
      </div>
    </>
  );
}

export default AdminDashboard