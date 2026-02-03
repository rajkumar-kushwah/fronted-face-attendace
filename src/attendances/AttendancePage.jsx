
import { useState } from "react";
import Layout from "../components/Layout";
import EmployeesPage from "./EmployeesPage";

export default function AttendancePage() {


  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Attendance</h2>

     

      {/* EMPLOYEES + ATTENDANCE TABLE */}
      <EmployeesPage />
    </Layout>
  );
}
