import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import TestCarousel from "../component/TestCarousel";
import { useNavigate } from "react-router-dom";
import CieQuestionGenerator from "../component/CieQuestionGenerator";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";

const TeacherHomePage = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
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
    <div className="bg-white h-full w-full">
      <div className="flex h-full">
        <div className="flex w-[450px] h-full bg-[#18122B]  p-4">
          <div className="flex flex-col">
            <Typography class="text-xl font-extrabold text-slate-100">
              Generate Questions and Answers
            </Typography>
            <Typography class="text-base text-slate-100 my-3 content-between">
              Generate a variety of questions and answers by uploading any
              document and Create a test
            </Typography>
            <Button
              class="mb-4 bg-white text-base py-2 text-violet-950 font-bold rounded"
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
              class="mb-4 bg-white text-base py-2 text-violet-950 font-bold rounded"
              onClick={() => {
                navigate("/teacher/performance");
              }}
            >
              Student Performance Analysis
            </Button>
            <Typography class="mt-6 text-xl font-extrabold text-slate-100">
              Generate CIE paper
            </Typography>
            <Typography class="text-base text-slate-100 my-3 content-between">
              Generate a variety of questions and answers by uploading any
              document and Create a test
            </Typography>
            <Button
              class="mb-4 bg-white text-base py-2 text-violet-950 font-bold rounded"
              onClick={() => {
                setShow(true);
              }}
            >
              Generate
            </Button>
            <Modal
              open={show}
              onClose={() => {
                setShow(false);
              }}
            >
              <ModalDialog>
                <CieQuestionGenerator />
                <ModalClose />
              </ModalDialog>
            </Modal>
          </div>
        </div>
        <div className="flex flex-col h-full w-full bg-[#443C68]">
          <div className="text-white text-3xl h-10 p-4 font-bold mb-5">
            Tests Created
          </div>
          <div className="flex h-full overflow-y-auto">
            <TestCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomePage;
