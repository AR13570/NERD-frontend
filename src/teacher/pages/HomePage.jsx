import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import TestCarousel from "../component/TestCarousel";
import { useNavigate } from "react-router-dom";
import CieQuestionGenerator from "../component/CieQuestionGenerator";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const TeacherHomePage = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [buttonshow, setButtonshow] = useState(false);
  const [Generating, setGenerating] = useState(false);
  const [response, setresponse] = useState("");
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
      <Modal open={buttonshow} onClose={() => setButtonshow(false)}>
        <ModalDialog>
          <div>
            <div>
              <div className="text-xl font-bold flex justify-center">
                Bulk upload
              </div>
              <div className="flex flex-row gap-x-2 mt-4"></div>
            </div>
            <div className="text-base font-medium mb-2">Upload files</div>
            Upload a csv file with student details to register them
            <input
              className="flex justify-center mb-4"
              type="file"
              accept=".csv"
              onChange={(event) => {
                setFile(event.target.files[0]);
              }}
            />
            <Button
              className="border border-slate-400 rounded-full px-3 py-2 text-base font-medium bg-[#18122B] text-white  flex justify-center w-full my-4"
              onClick={async () => {
                const formData = new FormData();
                formData.append("file", file);
                setError("");
                try {
                  setGenerating(true);
                  const response = await axios.post(
                    "http://localhost:8000/student/register/bulk",
                    formData
                  );
                  setresponse(response);
                  console.log(response);
                } catch (error) {
                  console.log(error);
                  setError("Error: " + error.response.data.detail);
                } finally {
                  setGenerating(false);
                }
              }}
              disabled={Generating}
            >
              {Generating ? "Uploading..." : "Upload CSV"}
            </Button>
            {error != "" && (
              <p className="text-red-500 font-medium flex justify-center my-4">
                {error}
              </p>
            )}
            {response && (
              <div className="text-green-400 text-sm font-medium text-center">
                Students registed Successfully
              </div>
            )}
          </div>
          <ModalClose />
        </ModalDialog>
      </Modal>
      <div className="flex h-full">
        <div className="flex w-[450px] h-full bg-[#18122B]  p-4 overflow-y-auto">
          <div className="flex flex-col">
            <Typography class="text-xl font-extrabold text-slate-100">
              Bulk registration
            </Typography>
            <Typography class="text-base text-slate-100 my-3 content-between">
              Register students from a CSV file
            </Typography>
            <Button
              class="mb-4 bg-white text-base py-2 text-violet-950 font-bold rounded"
              onClick={() => {
                setButtonshow(true);
              }}
            >
              Register
            </Button>

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
