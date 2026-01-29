import { useEffect, useState } from "react";
import { getTodayAttendanceApi } from "../utils/api";
import Layout from "../components/Layout";

export default function AttendanceTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getTodayAttendanceApi("6972164941d0a468448c5f2c")
      .then(res => setData(res.data));
  }, []);

  return (
    <Layout>
    <table className="w-full border mt-6">
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>In Time</th>
          <th>Out Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row._id}>
            <td>{row.employeeName}</td>
            <td>{row.employeeCode}</td>
            <td>{row.inTime?.slice(11,16)}</td>
            <td>{row.outTime?.slice(11,16)}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </Layout>
  );
}
