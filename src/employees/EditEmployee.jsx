import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployeeById, updateEmployeeProfile } from "../utils/api";
import Webcam from "react-webcam";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [avatarFile, setAvatarFile] = useState(null);
  const [faceImage, setFaceImage] = useState("");
  const [capturedImage, setCapturedImage] = useState("");
  const [useCamera, setUseCamera] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [department, setDepartment] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [status, setStatus] = useState("active");
  const [basicSalary, setBasicSalary] = useState("");

  // const [loading, setLoading] = useState(true);

  // ================= FETCH EMPLOYEE =================
  useEffect(() => {
    if (!id) return navigate("/employees");

    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeById(id);
        console.log("Edit Employee API ", res.data);

        const emp =
          res.data.employee ||
          res.data.emp ||
          res.data.data ||
          res.data;

        setName(emp.name || "");
        setEmail(emp.email || "");
        setPhone(emp.phone || "");
        setDob(emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "");
        setJobRole(emp.jobRole || "");
        setDepartment(emp.department || "");
        setJoinDate(emp.joinDate ? emp.joinDate.split("T")[0] : "");
        setStatus(emp.status || "active");
        setBasicSalary(emp.basicSalary || "");
        setFaceImage(emp.faceImage || "");
      } catch (err) {
        console.error(err);
        alert("Employee load failed");
        navigate("/employees");
      } finally {
        // setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("dateOfBirth", dob);
      formData.append("jobRole", jobRole);
      formData.append("department", department);
      formData.append("joinDate", joinDate);
      formData.append("status", status);
      formData.append("basicSalary", basicSalary);

      if (password) formData.append("password", password);

      // Upload file or captured camera image
      if (avatarFile) {
        formData.append("faceImage", avatarFile);
      } else if (capturedImage) {
        const res = await fetch(capturedImage);
        const blob = await res.blob();
        formData.append("faceImage", blob, "camera.jpg");
      }

      await updateEmployeeProfile(id, formData);

      alert("Employee updated successfully!");
      navigate("/employees");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // if (loading) {
  //   return (
  //     <Layout>
  //       <div className="p-6 text-center text-sm">Loading...</div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      <div className="text-left">
        <h2 className="font-semibold mb-4">Edit Employee</h2>
      </div>
      <div className="max-w-2xl mx-auto mt-6 p-5 rounded-lg shadow text-sm">
        <button
          type="button"
          onClick={() => navigate("/employees")}
          className="px-2 py-1 bg-gray-400 cursor-pointer text-white rounded"
        >
          Back
        </button>

        <form onSubmit={handleUpdate} className="space-y-3">
          {/* Avatar / Camera */}
          <div className="flex flex-col items-center">
            {useCamera ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="w-40 h-40 rounded-full object-cover border mb-2"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-500 cursor-pointer text-white rounded text-xs"
                    onClick={() => {
                      const imageSrc = webcamRef.current.getScreenshot();
                      setCapturedImage(imageSrc);
                      setUseCamera(false);
                    }}
                  >
                    Capture
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-500 cursor-pointer text-white rounded text-xs"
                    onClick={() => setUseCamera(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <img
                  src={
                    capturedImage
                      ? capturedImage
                      : avatarFile
                        ? URL.createObjectURL(avatarFile)
                        : faceImage || "/default-avatar.png"
                  }
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border mb-2"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-500 cursor-pointer text-white rounded text-xs"
                    onClick={() => setUseCamera(true)}
                  >
                    Use Camera
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setAvatarFile(e.target.files[0])}
                    className="text-xs cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1">Name</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* DOB + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Date of Birth</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1"
                value={dob}
                onChange={e => setDob(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Phone + Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Phone</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Department</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={department}
                onChange={e => setDepartment(e.target.value)}
              />
            </div>
          </div>

          {/* Job Role + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Job Role</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={jobRole}
                onChange={e => setJobRole(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Status</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Join Date + Salary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Join Date</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1"
                value={joinDate}
                onChange={e => setJoinDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Basic Salary</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={basicSalary}
                onChange={e => setBasicSalary(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-2">


            <button
              type="submit"
              className="px-2 py-1 w-full cursor-pointer text-gray-700 bg-gray-200 rounded-2xl hover:bg-gray-300  rounde"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
