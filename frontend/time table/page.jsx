"use client";

import React, { useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timeSlots = [
  "09:00 - 10:50",
  "10:00 - 10:50",
  "11:00 - 11:50",
  "12:00 - 12:50",
  "02:00 - 2:50",
];

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const [classes, setClasses] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    faculty: "",
    room: "",
    time: "09:00 - 10:00",
  });

  function openAddClass() {
    setForm({
      subject: "",
      faculty: "",
      room: "",
      time: "09:00 - 10:00",
    });

    setShowModal(true);
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function saveClass() {
    if (!form.subject || !form.faculty || !form.room) {
      alert("Please fill Subject, Faculty and Room.");
      return;
    }

    const newClass = {
      id: Date.now(),
      day: selectedDay,
      ...form,
    };

    setClasses([...classes, newClass]);
    setShowModal(false);
  }

  function deleteClass(id) {
    setClasses(classes.filter((item) => item.id !== id));
  }

  const filteredClasses = classes.filter(
  (item) => item.day === selectedDay
);

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Timetable</h1>
          <p style={styles.subtitle}>
            BCA · Semester V · Section A
          </p>
        </div>

        <button
          onClick={openAddClass}
          style={styles.addButton}
        >
          + Add Class
        </button>
      </header>

      {/* DAY TABS */}
      <div style={styles.dayContainer}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={
              selectedDay === day
                ? styles.activeDay
                : styles.dayButton
            }
          >
            {day}
          </button>
        ))}
      </div>

      {/* TIMETABLE */}
      <div style={styles.tableCard}>

        <div style={styles.tableHeader}>
          <div style={styles.timeHeader}>Time</div>
          <div style={styles.subjectHeader}>
            {selectedDay}
          </div>
        </div>

        {timeSlots.map((time) => {
          const classItem = dayClasses.find(
            (item) => item.time === time
          );

          return (
            <div style={styles.row} key={time}>

              <div style={styles.timeCell}>
                {time}
              </div>

              <div style={styles.classCell}>
                {classItem ? (
                  <div style={styles.classCard}>

                    <div style={styles.subject}>
                      {classItem.subject}
                    </div>

                    <div style={styles.info}>
                      Faculty: {classItem.faculty}
                    </div>

                    <div style={styles.info}>
                      Room: {classItem.room}
                    </div>

                    <button
                      onClick={() =>
                        deleteClass(classItem.id)
                      }
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>

                  </div>
                ) : (
                  <span style={styles.empty}>
                    No class scheduled
                  </span>
                )}
              </div>

            </div>
          );
        })}

      </div>

      {/* ADD CLASS MODAL */}
      {showModal && (
        <div style={styles.overlay}>

          <div style={styles.modal}>

            <div style={styles.modalHeader}>
              <h2>Add Class</h2>

              <button
                onClick={() => setShowModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            <p style={styles.modalDay}>
              Day: <strong>{selectedDay}</strong>
            </p>

            <label style={styles.label}>
              Subject
            </label>

            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Computer Networks"
              style={styles.input}
            />

            <label style={styles.label}>
              Faculty
            </label>

            <input
              name="faculty"
              value={form.faculty}
              onChange={handleChange}
              placeholder="Faculty name"
              style={styles.input}
            />

            <label style={styles.label}>
              Room
            </label>

            <input
              name="room"
              value={form.room}
              onChange={handleChange}
              placeholder="Room number"
              style={styles.input}
            />

            <label style={styles.label}>
              Time
            </label>

            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              style={styles.input}
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <div style={styles.footer}>

              <button
                onClick={() => setShowModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>

              <button
                onClick={saveClass}
                style={styles.saveButton}
              >
                Save Class
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background: "#0f172a",
    color: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },

  header: {
    maxWidth: "1200px",
    margin: "0 auto 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: "32px",
  },

  subtitle: {
    marginTop: "8px",
    color: "#94a3b8",
  },

  addButton: {
    padding: "12px 18px",
    border: 0,
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  dayContainer: {
    maxWidth: "1200px",
    margin: "0 auto 20px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  dayButton: {
    padding: "11px 18px",
    border: "1px solid #334155",
    borderRadius: "8px",
    background: "#1e293b",
    color: "#cbd5e1",
    cursor: "pointer",
    fontWeight: "bold",
  },

  activeDay: {
    padding: "11px 18px",
    border: "1px solid #3b82f6",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  tableCard: {
    maxWidth: "1200px",
    margin: "0 auto",
    border: "1px solid #334155",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#111827",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    background: "#1e293b",
    borderBottom: "1px solid #334155",
  },

  timeHeader: {
    padding: "16px",
    fontWeight: "bold",
    borderRight: "1px solid #334155",
  },

  subjectHeader: {
    padding: "16px",
    fontWeight: "bold",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    minHeight: "115px",
    borderBottom: "1px solid #334155",
  },

  timeCell: {
    padding: "20px 16px",
    color: "#94a3b8",
    borderRight: "1px solid #334155",
    fontWeight: "bold",
  },

  classCell: {
    padding: "12px",
  },

  classCard: {
    padding: "14px",
    borderRadius: "9px",
    background: "#1e3a8a",
    borderLeft: "4px solid #38bdf8",
  },

  subject: {
    fontSize: "17px",
    fontWeight: "bold",
    marginBottom: "8px",
  },

  info: {
    fontSize: "13px",
    color: "#dbeafe",
    marginTop: "4px",
  },

  empty: {
    color: "#64748b",
    fontSize: "14px",
  },

  deleteButton: {
    marginTop: "10px",
    padding: "6px 10px",
    border: "1px solid #f43f5e",
    borderRadius: "6px",
    background: "transparent",
    color: "#fecdd3",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    width: "480px",
    maxWidth: "90%",
    padding: "26px",
    borderRadius: "14px",
    background: "#1e293b",
    color: "white",
    boxSizing: "border-box",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  closeButton: {
    border: 0,
    background: "#334155",
    color: "white",
    fontSize: "22px",
    width: "34px",
    height: "34px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  modalDay: {
    color: "#94a3b8",
  },

  label: {
    display: "block",
    marginTop: "15px",
    marginBottom: "6px",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    height: "42px",
    padding: "0 12px",
    border: "1px solid #475569",
    borderRadius: "8px",
    background: "#0f172a",
    color: "white",
    boxSizing: "border-box",
  },

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "24px",
  },

  cancelButton: {
    padding: "10px 16px",
    border: 0,
    borderRadius: "8px",
    background: "#334155",
    color: "white",
    cursor: "pointer",
  },

  saveButton: {
    padding: "10px 16px",
    border: 0,
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};