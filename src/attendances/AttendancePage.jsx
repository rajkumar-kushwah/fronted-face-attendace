import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AttendanceFilter from "../attendances/AttendanceFilter";
import AttendanceTable from "../attendances/AttendanceTable";
import {
  getTodayAttendanceApi,
  getFilteredAttendanceApi
} from "../utils/api";

export default function AttendancePage() {
  const [data, setData] = useState([]);

  const companyId = "6972164941d0a468448c5f2c";

  // page load pe aaj + kal ka data
  const loadInitialData = async () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const fromDate = yesterday.toISOString().split("T")[0];
    const toDate = today.toISOString().split("T")[0];
    
    const res = await getFilteredAttendanceApi({
      companyId,
      fromDate,
      toDate,
    });
    setData(res.data.data);
  }

  // default = today
  // const loadToday = async () => {
  //   const res = await getTodayAttendanceApi(companyId);
  //   setData(res.data);
  // };

  const applyFilter = async (filters) => {
    const res = await getFilteredAttendanceApi({
      companyId,
      ...filters
    });
    setData(res.data.data);
  };

  useEffect(() => {
    // loadToday();
    loadInitialData();
  }, []);

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Attendance</h2>

      {/* FILTER SECTION */}
      <AttendanceFilter onFilter={applyFilter} />

      {/* TABLE */}
      <AttendanceTable data={data} />
    </Layout>
  );
}
