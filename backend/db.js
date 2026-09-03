const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "timetable.json");

function loadTimetable() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveTimetable(timetable) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(timetable, null, 2)
  );
}

module.exports = {
  loadTimetable,
  saveTimetable,
};