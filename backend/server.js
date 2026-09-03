const express = require("express");
const cors = require("cors");
const { loadTimetable, saveTimetable } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// GET - Load timetable
app.get("/api/timetable", (req, res) => {
  try {
    const timetable = loadTimetable();
    res.json(timetable);
  } catch (error) {
    console.error("LOAD ERROR:", error);
    res.status(500).json({
      message: "Failed to load timetable",
    });
  }
});

// POST - Add class
app.post("/api/timetable", (req, res) => {
  try {
    const {
      day,
      subject,
      faculty,
      room,
      startTime,
      endTime,
    } = req.body;

    if (!day || !subject || !faculty || !room || !startTime || !endTime) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const timetable = loadTimetable();

    const newClass = {
      id: Date.now(),
      day,
      subject,
      faculty,
      room,
      startTime,
      endTime,
      time: `${startTime}-${endTime}`,
    };

    timetable.push(newClass);

    saveTimetable(timetable);

    res.status(201).json({
      message: "Class added successfully",
      class: newClass,
    });
  } catch (error) {
    console.error("ADD ERROR:", error);
    res.status(500).json({
      message: "Failed to save class",
    });
  }
});

// PUT - Edit class
app.put("/api/timetable/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      day,
      subject,
      faculty,
      room,
      startTime,
      endTime,
    } = req.body;

    if (!day || !subject || !faculty || !room || !startTime || !endTime) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const timetable = loadTimetable();

    const index = timetable.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    timetable[index] = {
      ...timetable[index],
      day,
      subject,
      faculty,
      room,
      startTime,
      endTime,
      time: `${startTime}-${endTime}`,
    };

    saveTimetable(timetable);

    res.json({
      message: "Class updated successfully",
      class: timetable[index],
    });
  } catch (error) {
    console.error("EDIT ERROR:", error);
    res.status(500).json({
      message: "Failed to update class",
    });
  }
});

// DELETE - Delete class
app.delete("/api/timetable/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const timetable = loadTimetable();

    const newTimetable = timetable.filter(
      (item) => item.id !== id
    );

    if (newTimetable.length === timetable.length) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    saveTimetable(newTimetable);

    res.json({
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      message: "Failed to delete class",
    });
  }
});

// Start server
const PORT = 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Backend server running at http://localhost:${PORT}`
  );
});