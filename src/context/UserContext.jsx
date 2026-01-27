import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, getOfficeHolidaysApi, getPayrolls } from "../utils/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // user
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(!user);

  // office holidays
  const [officeHolidays, setOfficeHolidays] = useState(() => {
    const stored = localStorage.getItem("officeHolidays");
    return stored ? JSON.parse(stored) : [];
  });
  const [holidayLoaded, setHolidayLoaded] = useState(!!officeHolidays.length);

  // payrolls
  const [payrolls, setPayrolls] = useState(() => {
    const stored = localStorage.getItem("payrolls");
    return stored ? JSON.parse(stored) : [];
  });
  const [payrollLoaded, setPayrollLoaded] = useState(!!payrolls.length);

  // employees
  const [employees, setEmployees] = useState(() => {
    const stored = localStorage.getItem("employees");
    return stored ? JSON.parse(stored) : [];
  });

  // save user
  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // save officeHolidays
  useEffect(() => {
    localStorage.setItem("officeHolidays", JSON.stringify(officeHolidays));
  }, [officeHolidays]);

  // save payrolls
  useEffect(() => {
    localStorage.setItem("payrolls", JSON.stringify(payrolls));
  }, [payrolls]);

  // save employees
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  // add a new employee
  const addEmployeeLocal = (newEmp) => {
    setEmployees(prev => [...prev, newEmp]);
  };

  const logout = () => {
    setUser(null);
    setOfficeHolidays([]);
    setPayrolls([]);
    setEmployees([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("officeHolidays");
    localStorage.removeItem("payrolls");
    localStorage.removeItem("employees");
    window.location.href = "/login";
  };

  // 🔹 USER PROFILE FETCH
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await getProfile();
        if (res.data) updateUser(res.data);
        
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔹 OFFICE HOLIDAY FETCH
  useEffect(() => {
    const fetchOfficeHolidays = async () => {
      if (!user || user.role === "employee" || holidayLoaded) return;
      try {
        const res = await getOfficeHolidaysApi();
        if (res.data?.data) setOfficeHolidays(res.data.data);
        setHolidayLoaded(true);
      } catch (err) {
        console.error("Office holiday fetch failed", err);
      }
    };
    fetchOfficeHolidays();
  }, [user, holidayLoaded]);

  // 🔹 PAYROLL FETCH
  useEffect(() => {
    const fetchPayrolls = async () => {
      if (!user || payrollLoaded) return;
      try {
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const currentDate = new Date();
        const month = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        const res = await getPayrolls({ month });
        if (res.data && Array.isArray(res.data.data)) setPayrolls(res.data.data);
        setPayrollLoaded(true);
      } catch (err) {
        console.error("Payroll fetch failed", err);
      }
    };
    fetchPayrolls();
  }, [user, payrollLoaded]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: updateUser,
        logout,
        loading,
        officeHolidays,
        setOfficeHolidays,
        payrolls,
        setPayrolls,
        employees,
        setEmployees,
        addEmployeeLocal, //  use this to save a new employee
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
