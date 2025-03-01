import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './home.css'; // Import the new CSS file

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [stats, setStats] = useState({
    treated: 0,
    upcoming: 0,
    followups: 0,
  });

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const today = new Date();
    if (newDate < today) {
      setStats({
        treated: Math.floor(Math.random() * 20),
        upcoming: Math.floor(Math.random() * 10),
        followups: Math.floor(Math.random() * 5),
      });
    } else {
      setStats({
        treated: 0,
        upcoming: Math.floor(Math.random() * 10),
        followups: 0,
      });
    }
  };

  return (
    <main className="main-content">
      <h1>Good afternoon Dr. Samidha :)</h1>
      <div className="stats">
        <div className="stat-done">
          <h2>Patients treated</h2>
          <p>{stats.treated}</p>
        </div>
        <div className="stat-upcoming">
          <h2>Upcoming appointments</h2>
          <p>{stats.upcoming}</p>
        </div>
        <div className="stat-flwups">
          <h2>Pending followups</h2>
          <p>{stats.followups}</p>
        </div>
      </div>
      <div className="calendar-stats">
        <Calendar
          onChange={handleDateChange}
          value={date}
          view="month"
          showNeighboringMonth={false}
        />
        <div className="selected-date-stats">
          <h2>Stats for {date.toDateString()}</h2>
          <p>Patients treated: {stats.treated}</p>
          <p>Upcoming appointments: {stats.upcoming}</p>
          <p>Pending followups: {stats.followups}</p>
        </div>
      </div>
    </main>
  );
};

export default Home;