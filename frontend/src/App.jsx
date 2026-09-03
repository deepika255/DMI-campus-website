import React, { useEffect, useState } from "react";
const API_URL = "http://10.184.25.3:5000/api/timetable";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const emptyForm = {
  day: "Monday",
  subject: "",
  faculty: "",
  room: "",
  startTime: "",
  endTime: "",
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [activePage, setActivePage] = useState("Timetable");

  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
  });

  const [profile, setProfile] = useState({
    name: "Teacher",
    department: "Computer Applications",
    email: "teacher@dmi.edu",
    role: "Teacher",
  });

  const [darkMode, setDarkMode] = useState(true);

  const background = darkMode ? "#09090b" : "#f4f4f5";
  const cardBackground = darkMode ? "#18181b" : "#ffffff";
  const textColor = darkMode ? "#f4f4f5" : "#18181b";
  const secondaryText = darkMode ? "#a1a1aa" : "#52525b";
  const borderColor = darkMode ? "#27272a" : "#d4d4d8";

  // LOAD TIMETABLE
  const loadTimetable = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load timetable");
      }

      const data = await response.json();

      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      loadTimetable();
    }
  }, [loggedIn]);

  // LOGIN
  const handleLogin = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password");
      return;
    }

    setLoggedIn(true);
  };

  // LOGOUT
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setActivePage("Timetable");
  };

  // FORM CHANGE
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ADD / UPDATE CLASS
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.subject.trim()) {
      alert("Please enter Subject");
      return;
    }

    if (!form.faculty.trim()) {
      alert("Please enter Faculty");
      return;
    }

    if (!form.room.trim()) {
      alert("Please enter Room");
      return;
    }

    if (!form.startTime || !form.endTime) {
      alert("Please select start and end time");
      return;
    }

    if (form.startTime >= form.endTime) {
      alert("End Time must be after Start Time");
      return;
    }

    try {
      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Operation failed");
        return;
      }

      if (isEditing) {
        setClasses((previous) =>
          previous.map((item) =>
            item.id === editingId ? data.class : item
          )
        );
      } else {
        setClasses((previous) => [
          ...previous,
          data.class,
        ]);
      }

      setForm(emptyForm);
      setEditingId(null);

      alert(
        isEditing
          ? "Class updated successfully"
          : "Class added successfully"
      );
    } catch (error) {
      console.error("SAVE ERROR:", error);
      alert(
        "Backend is not running. Start the backend server first."
      );
    }
  };

  // EDIT CLASS
  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      day: item.day || "Monday",
      subject: item.subject || "",
      faculty: item.faculty || "",
      room: item.room || "",
      startTime: item.startTime || "",
      endTime: item.endTime || "",
    });

    setActivePage("Timetable");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE CLASS
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      setClasses((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      alert("Class deleted successfully");
    } catch (error) {
      console.error("DELETE ERROR:", error);
      alert("Failed to delete class");
    }
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // GET CLASSES
  const getClassesForDay = (day) => {
    return classes
      .filter((item) => item.day === day)
      .sort((a, b) =>
        (a.startTime || "").localeCompare(
          b.startTime || ""
        )
      );
  };

  // ATTENDANCE
  const markPresent = () => {
    setAttendance((previous) => ({
      ...previous,
      present: previous.present + 1,
    }));
  };

  const markAbsent = () => {
    setAttendance((previous) => ({
      ...previous,
      absent: previous.absent + 1,
    }));
  };

  const totalAttendance =
    attendance.present + attendance.absent;

  const attendancePercentage =
    totalAttendance === 0
      ? 0
      : Math.round(
          (attendance.present / totalAttendance) * 100
        );

  // LOGIN SCREEN
  if (!loggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background,
          color: textColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            background: cardBackground,
            border: `1px solid ${borderColor}`,
            borderRadius: "20px",
            padding: "35px",
            boxSizing: "border-box",
          }}
        >
          <h1 style={{ textAlign: "center" }}>
            DMI CAMPUS
          </h1>

          <p
            style={{
              textAlign: "center",
              color: secondaryText,
            }}
          >
            Teacher Login
          </p>

          <form onSubmit={handleLogin}>
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter username"
              style={{
                width: "100%",
                padding: "13px",
                marginTop: "8px",
                marginBottom: "20px",
                boxSizing: "border-box",
                borderRadius: "10px",
                border: `1px solid ${borderColor}`,
                background,
                color: textColor,
              }}
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "13px",
                marginTop: "8px",
                marginBottom: "25px",
                boxSizing: "border-box",
                borderRadius: "10px",
                border: `1px solid ${borderColor}`,
                background,
                color: textColor,
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN APPLICATION
  return (
    <div
      style={{
        minHeight: "100vh",
        background,
        color: textColor,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          padding: "20px 30px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            DMI CAMPUS
          </h1>

          <p style={{ color: secondaryText }}>
            Teacher Dashboard
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: `1px solid ${borderColor}`,
            background: cardBackground,
            color: textColor,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      {/* NAVIGATION */}
      <nav
        style={{
          display: "flex",
          gap: "10px",
          padding: "18px 30px",
          borderBottom: `1px solid ${borderColor}`,
          overflowX: "auto",
        }}
      >
        {[
          "Timetable",
          "Attendance",
          "Profile",
          "Settings",
        ].map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            style={{
              padding: "11px 18px",
              borderRadius: "9px",
              border: `1px solid ${borderColor}`,
              background:
                activePage === page
                  ? "#2563eb"
                  : cardBackground,
              color: textColor,
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {page}
          </button>
        ))}
      </nav>

      <main
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        {/* TIMETABLE PAGE */}
        {activePage === "Timetable" && (
          <>
            <h2>Timetable</h2>

            <p style={{ color: secondaryText }}>
              BCA · Semester V · Section A
            </p>

            {/* FORM */}
            <section
              style={{
                background: cardBackground,
                border: `1px solid ${borderColor}`,
                borderRadius: "18px",
                padding: "25px",
                marginTop: "20px",
                marginBottom: "30px",
              }}
            >
              <h3>
                {editingId !== null
                  ? "Edit Class"
                  : "Add New Class"}
              </h3>

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label>Day</label>

                    <select
                      name="day"
                      value={form.day}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "7px",
                        borderRadius: "9px",
                        border: `1px solid ${borderColor}`,
                        background,
                        color: textColor,
                      }}
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Subject</label>

                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "7px",
                        boxSizing: "border-box",
                        borderRadius: "9px",
                        border: `1px solid ${borderColor}`,
                        background,
                        color: textColor,
                      }}
                    />
                  </div>

                  <div>
                    <label>Faculty</label>

                    <input
                      name="faculty"
                      value={form.faculty}
                      onChange={handleChange}
                      placeholder="Enter faculty"
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "7px",
                        boxSizing: "border-box",
                        borderRadius: "9px",
                        border: `1px solid ${borderColor}`,
                        background,
                        color: textColor,
                      }}
                    />
                  </div>

                  <div>
                    <label>Room</label>

                    <input
                      name="room"
                      value={form.room}
                      onChange={handleChange}
                      placeholder="Enter room"
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "7px",
                        boxSizing: "border-box",
                        borderRadius: "9px",
                        border: `1px solid ${borderColor}`,
                        background,
                        color: textColor,
                      }}
                    />
                  </div>

                  <div>
                    <label>Start Time</label>

                    <input
                      type="time"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "7px",
                        boxSizing: "border-box",
                        borderRadius: "9px",
                        border: `1px solid ${borderColor}`,
                        background,
                        color: textColor,
                      }}
                    />
                  </div>

                  <div>
                    <label>End Time</label>

                    <input
                      type="time"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "7px",
                        boxSizing: "border-box",
                        borderRadius: "9px",
                        border: `1px solid ${borderColor}`,
                        background,
                        color: textColor,
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <button
                    type="submit"
                    style={{
                      padding: "12px 20px",
                      border: "none",
                      borderRadius: "9px",
                      background: "#2563eb",
                      color: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {editingId !== null
                      ? "Update Class"
                      : "Save Class"}
                  </button>

                  {editingId !== null && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      style={{
                        padding: "12px 20px",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "9px",
                        background: cardBackground,
                        color: textColor,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* WEEKLY TIMETABLE */}
            <h2>Weekly Timetable</h2>

            {loading ? (
              <p style={{ color: secondaryText }}>
                Loading timetable...
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "15px",
                }}
              >
                {days.map((day) => {
                  const dayClasses =
                    getClassesForDay(day);

                  return (
                    <div
                      key={day}
                      style={{
                        background: cardBackground,
                        border: `1px solid ${borderColor}`,
                        borderRadius: "16px",
                        padding: "18px",
                        minHeight: "250px",
                      }}
                    >
                      <h3
                        style={{
                          textAlign: "center",
                          marginTop: 0,
                        }}
                      >
                        {day}
                      </h3>

                      {dayClasses.length === 0 ? (
                        <p
                          style={{
                            color: secondaryText,
                            textAlign: "center",
                          }}
                        >
                          No classes
                        </p>
                      ) : (
                        dayClasses.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              border: `1px solid ${borderColor}`,
                              borderRadius: "12px",
                              padding: "14px",
                              marginBottom: "12px",
                              background,
                            }}
                          >
                            <h4
  style={{
    margin: "0 0 8px",
    fontSize: "18px",
  }}
>
  {item.subject}
</h4>

<p
  style={{
    margin: "5px 0",
    color: secondaryText,
  }}
>
  👨‍🏫 {item.faculty}
</p>

<p
  style={{
    margin: "5px 0",
    color: secondaryText,
  }}
>
  🏫 Room: {item.room}
</p>

<p
  style={{
    margin: "5px 0 12px",
    fontWeight: "bold",
  }}
>
  ⏰ {item.startTime} - {item.endTime}
</p>

<div
  style={{
    display: "flex",
    gap: "8px",
  }}
>
  <button
    type="button"
    onClick={() => handleEdit(item)}
    style={{
      flex: 1,
      padding: "8px",
      border: "none",
      borderRadius: "7px",
      background: "#2563eb",
      color: "white",
      cursor: "pointer",
    }}
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDelete(item.id)}
    style={{
      flex: 1,
      padding: "8px",
      border: "none",
      borderRadius: "7px",
      background: "#dc2626",
      color: "white",
      cursor: "pointer",
    }}
  >
    Delete
  </button>
</div>
</div>
))
)}
</div>
);
})}
</div>
)}
</>
)}

{/* ATTENDANCE PAGE */}
{activePage === "Attendance" && (
  <section
    style={{
      background: cardBackground,
      border: `1px solid ${borderColor}`,
      borderRadius: "18px",
      padding: "25px",
    }}
  >
    <h2>Attendance</h2>

    <p style={{ color: secondaryText }}>
      Track your class attendance.
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
        marginTop: "25px",
      }}
    >
      <div
        style={{
          padding: "20px",
          border: `1px solid ${borderColor}`,
          borderRadius: "12px",
        }}
      >
        <h3>Present</h3>

        <p style={{ fontSize: "32px", fontWeight: "bold" }}>
          {attendance.present}
        </p>

        <button
          onClick={markPresent}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#16a34a",
            color: "white",
            cursor: "pointer",
          }}
        >
          Mark Present
        </button>
      </div>

      <div
        style={{
          padding: "20px",
          border: `1px solid ${borderColor}`,
          borderRadius: "12px",
        }}
      >
        <h3>Absent</h3>

        <p style={{ fontSize: "32px", fontWeight: "bold" }}>
          {attendance.absent}
        </p>

        <button
          onClick={markAbsent}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#dc2626",
            color: "white",
            cursor: "pointer",
          }}
        >
          Mark Absent
        </button>
      </div>

      <div
        style={{
          padding: "20px",
          border: `1px solid ${borderColor}`,
          borderRadius: "12px",
        }}
      >
        <h3>Attendance Percentage</h3>

        <p style={{ fontSize: "32px", fontWeight: "bold" }}>
          {attendancePercentage}%
        </p>

        <p style={{ color: secondaryText }}>
          Total: {totalAttendance}
        </p>
      </div>
    </div>
  </section>
)}

{/* PROFILE PAGE */}
{activePage === "Profile" && (
  <section
    style={{
      background: cardBackground,
      border: `1px solid ${borderColor}`,
      borderRadius: "18px",
      padding: "25px",
      maxWidth: "700px",
    }}
  >
    <h2>Teacher Profile</h2>

    <div style={{ marginTop: "20px" }}>
      <label>Name</label>

      <input
        value={profile.name}
        onChange={(event) =>
          setProfile({
            ...profile,
            name: event.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "7px",
          boxSizing: "border-box",
          borderRadius: "9px",
          border: `1px solid ${borderColor}`,
          background,
          color: textColor,
        }}
      />
    </div>

    <div style={{ marginTop: "16px" }}>
      <label>Department</label>

      <input
        value={profile.department}
        onChange={(event) =>
          setProfile({
            ...profile,
            department: event.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "7px",
          boxSizing: "border-box",
          borderRadius: "9px",
          border: `1px solid ${borderColor}`,
          background,
          color: textColor,
        }}
      />
    </div>

    <div style={{ marginTop: "16px" }}>
      <label>Email</label>

      <input
        type="email"
        value={profile.email}
        onChange={(event) =>
          setProfile({
            ...profile,
            email: event.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "7px",
          boxSizing: "border-box",
          borderRadius: "9px",
          border: `1px solid ${borderColor}`,
          background,
          color: textColor,
        }}
      />
    </div>

    <div style={{ marginTop: "16px" }}>
      <label>Role</label>

      <input
        value={profile.role}
        onChange={(event) =>
          setProfile({
            ...profile,
            role: event.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "7px",
          boxSizing: "border-box",
          borderRadius: "9px",
          border: `1px solid ${borderColor}`,
          background,
          color: textColor,
        }}
      />
    </div>
  </section>
)}

{/* SETTINGS PAGE */}
{activePage === "Settings" && (
  <section
    style={{
      background: cardBackground,
      border: `1px solid ${borderColor}`,
      borderRadius: "18px",
      padding: "25px",
      maxWidth: "700px",
    }}
  >
    <h2>Settings</h2>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "25px",
        padding: "18px",
        border: `1px solid ${borderColor}`,
        borderRadius: "12px",
      }}
    >
      <div>
        <h3 style={{ margin: 0 }}>
          Dark Mode
        </h3>

        <p
          style={{
            color: secondaryText,
            marginBottom: 0,
          }}
        >
          Change the dashboard appearance.
        </p>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
        }}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  </section>
)}
      </main>
    </div>
  );
}

export default App;
                            
