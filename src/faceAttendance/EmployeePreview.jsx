


export default function EmployeePreview({ employee }) {
  if (!employee) return null;

  return (
    <div className="flex gap-2 p-4 rounded  mt-2 text-center">
        <div className="mt-2">
      <img
        src={employee.faceImage}
        alt="face"
        className="w-12 h-12 mx-auto rounded-full"
      /></div>
      <div>
      <h3 className="font-bold mt-2">{employee.name}</h3>
      <p className="text-gray-600 text-left">{employee.code}</p>
      </div>
    </div>
  );
}
