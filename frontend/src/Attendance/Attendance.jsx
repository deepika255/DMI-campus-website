import React, { useState } from "react";

function Attendance() {
  const [students, setStudents] = useState([
    { id: 1, name: "Student 1", status: "Present" },
    { id: 2, name: "Student 2", status: "Present" },
    { id: 3, name: "Student 3", status: "Present" },
  ]);

  function changeStatus(id, status) {
    setStudents((oldStudents) =>
      oldStudents.map((student) =>
        student.id === id
          ? { ...student, status }
          : student
      )
    );
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Attendance</h1>

      {students.map((student) => (
        <div
          key={student.id}
          style={{
            padding: "15px",
            marginBottom: "10px",
            background: "#f1f5f9",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <strong>{student.name}</strong>

          <div>
            <button
              onClick={() => changeStatus(student.id, "Present")}
            >
              Present
            </button>

            <button
              onClick={() => changeStatus(student.id, "Absent")}
              style={{ marginLeft: "8px" }}
            >
              Absent
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Attendance;