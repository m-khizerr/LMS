const Assignment = () => {
  const assignments = [
    {
      id: 1,
      title: "Database Systems - Midterm Assignment",
      description:
        "Design an ER diagram and normalize it up to 3NF. Submit the report in PDF format.",
      dueDate: "Sep 15, 2025",
      status: "Pending",
      progress: 30,
    },
    {
      id: 2,
      title: "Data Structures - Coding Task",
      description:
        "Implement a binary search tree in C++ and include test cases.",
      dueDate: "Sep 20, 2025",
      status: "Submitted",
      progress: 100,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📚 Assignments</h1>
        <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
          + New Assignment
        </button>
      </div>

      {/* Assignment Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="border rounded-2xl shadow-md p-5 bg-white hover:shadow-lg transition"
          >
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {assignment.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-3">{assignment.description}</p>

            {/* Due Date */}
            <p className="text-sm text-gray-500 mb-2">
              📅 Due: <span className="font-medium">{assignment.dueDate}</span>
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
              <div
                className={`h-2 rounded-full ${
                  assignment.progress === 100 ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${assignment.progress}%` }}
              ></div>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              {assignment.status === "Pending" ? (
                <button className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
                  Upload
                </button>
              ) : (
                <span className="text-green-600 font-semibold">✅ Submitted</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignment;
