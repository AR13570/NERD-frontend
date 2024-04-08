import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import TestCarousel from "../component/TestCarousel";
import { useNavigate } from "react-router-dom";

const TeacherHomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType == null || userType != "teacher") {
      localStorage.removeItem("userType");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      navigate("/");
    }
  }, []);
  return (
    <div className="bg-violet-900 h-full w-full">
      <div className="flex h-full">
        <div className="flex w-[450px] h-full bg-violet-950 p-4">
          <div className="flex flex-col">
            <Typography class="text-xl font-extrabold text-slate-100">
              Generate Questions and Answers
            </Typography>
            <Typography class="text-base text-slate-100 my-3 content-between">
              Generate a variety of questions and answers by uploading any
              document and Create a test
            </Typography>
            <Button
              class="mb-4 bg-violet-100 text-base py-2 text-violet-950 font-bold rounded"
              onClick={() => {
                navigate("/teacher/generate");
              }}
            >
              Generate Q&A
            </Button>

            <Typography class="mt-6 text-xl font-extrabold text-slate-100">
              Student Performance Analysis
            </Typography>
            <Typography class="text-base text-slate-100 my-3 content-between">
              View the grades of all the students and their respective answers{" "}
            </Typography>
            <Button
              class="mb-4 bg-violet-100 text-base py-2 text-violet-950 font-bold rounded"
              onClick={() => {
                navigate("/teacher/performance");
              }}
            >
              Student Performance Analysis
            </Button>
          </div>
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="text-stone-200 text-center text-2xl h-10 pt-3 font-semibold">
            Tests Created
          </div>
          <div className="flex h-[85.4%] text-indigo-900 overflow-x-auto">
            <TestCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomePage;
