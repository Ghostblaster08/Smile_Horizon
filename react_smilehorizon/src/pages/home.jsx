import React, { useState, useRef } from "react";
import Calendar from "react-calendar";
import Greeting from "../components/greeting";
import "react-calendar/dist/Calendar.css";
import "./home.css"; // Import the new CSS file
import DashboardStats from "../components/dashboardstats";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  return (
    <>
      <Greeting />
      <DashboardStats />
    </>
  );
};

export default Home;
