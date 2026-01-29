


export default function EmployeePreview({ employee }) {
  if (!employee) return null;

  return (
    <div className="bg-white p-4 rounded shadow mt-4 text-center">
      <img
        src={employee.faceImage}
        alt="face"
        className="w-24 h-24 mx-auto rounded-full"
      />
      <h3 className="font-bold mt-2">{employee.name}</h3>
      <p className="text-gray-600">{employee.code}</p>
    </div>
  );
}
