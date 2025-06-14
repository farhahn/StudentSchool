import React, { useState } from 'react';

const TeacherTimetable = () => {
  // Sample teacher data with their schedules
  const teachersData = {
    "Shivam Verma (9002)": {
      Monday: [
        { class: "Class 1(A)", subject: "English (210)", time: "9:00 AM - 09:40 AM", room: "120" },
        { class: "Class 3(A)", subject: "English (210)", time: "9:30 AM - 10:15 AM", room: "115" },
        { class: "Class 4(A)", subject: "English (210)", time: "9:30 AM - 10:10 AM", room: "110" },
        { class: "Class 2(C)", subject: "Science (111)", time: "10:00 AM - 10:40 AM", room: "102" },
        { class: "Class 4(B)", subject: "English (210)", time: "10:00 AM - 10:40 AM", room: "115" },
      ],
      Tuesday: [
        { class: "Class 3(A)", subject: "English (210)", time: "9:30 AM - 10:15 AM", room: "115" },
        { class: "Class 2(B)", subject: "English (210)", time: "9:30 AM - 10:10 AM", room: "120" },
        { class: "Class 4(B)", subject: "English (210)", time: "10:00 AM - 10:40 AM", room: "115" },
        { class: "Class 2(A)", subject: "Science (111)", time: "10:10 AM - 10:50 AM", room: "125G" },
      ],
      Wednesday: [
        { class: "Class 1(A)", subject: "Hindi (230)", time: "9:00 AM - 09:40 AM", room: "110" },
        { class: "Class 2(A)", subject: "Science (111)", time: "9:30 AM - 10:10 AM", room: "125G" },
        { class: "Class 3(A)", subject: "English (210)", time: "9:30 AM - 10:10 AM", room: "115" },
        { class: "Class 4(A)", subject: "Mathematics (110)", time: "9:30 AM - 10:10 AM", room: "110" },
        { class: "Class 2(B)", subject: "Hindi (230)", time: "9:30 AM - 10:10 AM", room: "125G" },
      ],
      Thursday: [
        { class: "Class 4(B)", subject: "Science (111)", time: "12:00 PM - 12:40 PM", room: "115" },
        { class: "Class 3(A)", subject: "English (210)", time: "9:30 AM - 10:10 AM", room: "115" },
        { class: "Class 2(B)", subject: "English (210)", time: "9:30 AM - 10:10 AM", room: "120" },
        { class: "Class 4(A)", subject: "Mathematics (110)", time: "9:30 AM - 10:10 AM", room: "110" },
      ],
      Friday: [
        { class: "Class 1(A)", subject: "Hindi (230)", time: "9:00 AM - 09:40 AM", room: "110" },
        { class: "Class 2(A)", subject: "English (210)", time: "9:30 AM - 10:10 AM", room: "125G" },
        { class: "Class 3(A)", subject: "English (210)", time: "9:30 AM - 10:10 AM", room: "115" },
        { class: "Class 1(A)", subject: "English (210)", time: "9:40 AM - 10:20 AM", room: "110" },
        { class: "Class 4(B)", subject: "Hindi (230)", time: "9:30 AM - 10:10 AM", room: "110" },
      ],
      Saturday: [
        { class: "Class 2(A)", subject: "English (210)", time: "9:30 AM - 10:10 AM", room: "125G" },
        { class: "Class 3(A)", subject: "English (210)", time: "9:30 AM - 10:10 AM", room: "115" },
        { class: "Class 1(A)", subject: "Mathematics (110)", time: "9:40 AM - 10:20 AM", room: "110" },
        { class: "Class 2(B)", subject: "English (210)", time: "9:30 AM - 10:10 AM", room: "120" },
        { class: "Class 4(B)", subject: "Hindi (230)", time: "9:30 AM - 10:10 AM", room: "110" },
      ],
      Sunday: [],
    },
    "Amit Sharma (9003)": {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  };

  // State for selected teacher and whether to show the timetable
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showTimetable, setShowTimetable] = useState(false);

  // Handle teacher selection
  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
    setShowTimetable(false); // Hide timetable when teacher changes
  };

  // Handle search button click
  const handleSearch = () => {
    if (selectedTeacher) {
      setShowTimetable(true);
    }
  };

  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="teacher-timetable-container">
      <style>
        {`
          .teacher-timetable-container {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, rgb(234, 187, 79), #d9e2ec);
            min-height: 100vh;
          }

          h2 {
            color: #2c3e50;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .teacher-selection {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            gap: 15px;
          }

          .teacher-selection label {
            font-size: 16px;
            color: #34495e;
            margin-right: 10px;
            font-weight: 600;
          }

          .teacher-selection select {
            padding: 8px;
            font-size: 14px;
            border: 1px solid #ddd;
            border-radius: 5px;
            transition: border-color 0.3s ease;
          }

          .teacher-selection select:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
          }

          .search-btn {
            background: #3498db;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background 0.3s ease;
          }

          .search-btn:hover {
            background: #2980b9;
          }

          .timetable {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
          }

          .day-column {
            flex: 1;
            min-width: 180px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 15px;
            transition: transform 0.3s ease;
          }

          .day-column:hover {
            transform: translateY(-5px);
          }

          .day-column h3 {
            color: #2c3e50;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
            text-transform: uppercase;
          }

          .schedule-card {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
            border-left: 4px solid #3498db;
            transition: background 0.3s ease;
          }

          .schedule-card:hover {
            background: #e9ecef;
          }

          .schedule-card p {
            margin: 5px 0;
            font-size: 14px;
            color: #34495e;
          }

          .schedule-card .subject {
            color: #27ae60;
            font-weight: bold;
          }

          .schedule-card .time {
            font-size: 13px;
            color: #7f8c8d;
          }

          .schedule-card .room {
            font-size: 13px;
            color: #7f8c8d;
          }

          .not-scheduled {
            color: #e74c3c;
            font-weight: bold;
            text-align: center;
            padding: 10px;
          }

          @media (max-width: 768px) {
            .timetable {
              flex-direction: column;
            }

            .day-column {
              min-width: 100%;
            }

            .teacher-selection {
              flex-direction: column;
              align-items: flex-start;
            }

            .teacher-selection select {
              width: 100%;
              margin-bottom: 10px;
            }

            .search-btn {
              width: 100%;
            }
          }
        `}
      </style>

      {/* Teacher Selection */}
      <h2>Teacher Time Table</h2>
      <div className="teacher-selection">
        <label>Teachers <span style={{ color: 'red' }}>*</span></label>
        <select value={selectedTeacher} onChange={handleTeacherChange}>
          <option value="">Select</option>
          {Object.keys(teachersData).map((teacher) => (
            <option key={teacher} value={teacher}>
              {teacher}
            </option>
          ))}
        </select>
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

      {/* Timetable Display */}
      {showTimetable && selectedTeacher && (
        <div className="timetable">
          {days.map((day) => (
            <div key={day} className="day-column">
              <h3>{day}</h3>
              {teachersData[selectedTeacher][day].length > 0 ? (
                teachersData[selectedTeacher][day].map((schedule, index) => (
                  <div key={index} className="schedule-card">
                    <p>Class: {schedule.class}</p>
                    <p className="subject">Subject: {schedule.subject}</p>
                    <p className="time">{schedule.time}</p>
                    <p className="room">Room No.: {schedule.room}</p>
                  </div>
                ))
              ) : (
                <div className="not-scheduled">Not Scheduled</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherTimetable;