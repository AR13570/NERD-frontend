import React, { useState, useEffect } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const TestTakingPage = ({ timeAllotted = 100 }) => {
  const [answers, setAnswers] = useState({});
  const { state } = useLocation();
  const [timerExpired, setTimerExpired] = useState(false);
  const [open, setOpen] = useState(false);
  const testDetails = state?.testDetails;
  const [timeRemaining, setTimeRemaining] = useState(
    testDetails["duration"] * 60
  ); // Convert minutes to seconds

  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]); //testDetails.subjective.concat(testDetails.mcq);
  const [submitText, setSubmitText] = useState([
    "Are you sure you want to submit the test?",
    "Submit",
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      } else {
        handleTimerExpiration();
      }
    }, 1000); // Update every second

    return () => clearTimeout(timer);
  }, [timeRemaining]);

  const onExitFullscreen = (e) => {
    if (!document.fullscreenElement) {
      setTimerExpired(true);
      setOpen(true);
      setSubmitText(["Timer Expired", "Submitting automatically..."]);

      setTimeout(() => {
        // handleSubmit();
        navigate("/student", { replace: true });
      }, 3000);
    } else {
      console.log("full");
    }
  };
  const onRefresh = (e) => {
    e.preventDefault();
    window.location = "/student";
    // setTimerExpired(true);
    // setOpen(true);
    // setSubmitText(["Timer Expired", "Submitting automatically..."]);
    // setQuestions([]);
  };

  useEffect(() => {
    setQuestions(testDetails.subjective.concat(testDetails.mcq));
    document.addEventListener("fullscreenchange", onExitFullscreen);
    window.addEventListener("beforeunload", onRefresh);
    return () => {
      window.removeEventListener("beforeunload", onRefresh);
      document.addEventListener("fullscreenchange", onExitFullscreen);
    };
  }, []);

  const handleTimerExpiration = () => {
    setTimerExpired(true);
    setOpen(true);
    setSubmitText(["Timer Expired", "Submitting automatically..."]);
    setTimeout(() => {
      // handleSubmit();
      navigate("/student", { replace: true });
    }, 3000);
  };

  const handleAnswerChange = (index, answer) => {
    if (typeof answer == "string" && !answer.trim())
      setAnswers((prev) => {
        const newObj = prev;
        delete newObj[index];
        return newObj;
      });
    else {
      setAnswers({ ...answers, [index]: answer });
    }
  };

  const handleSubmit = () => {
    if (true || !submitted) {
      setSubmitted(true);
      // Separate subjective and mcq questions
      const subjectiveQuestions = [];
      const mcqQuestions = [];

      questions.forEach((question, index) => {
        if (answers[index] !== undefined) {
          if ("options" in question) {
            mcqQuestions.push({
              question: question.question,
              key: question.answer.toString(),
              answer: (answers[index] + 1).toString(),
            });
          } else {
            subjectiveQuestions.push({
              question: question.question,
              key: question.answer,
              answer: answers[index],
            });
          }
        }
      });
      const submissionData = {
        teacher_id: testDetails.teacher_id,
        subject: testDetails.subject,
        test_id: testDetails._id,
        student_usn: "1ms20cs024",
        subjective: subjectiveQuestions,
        mcq: mcqQuestions,
      };
      console.log(submissionData);
      setOpen(true);
      const access_token = localStorage.getItem("accessToken");
      axios
        .post("http://localhost:8000/test/submit", submissionData, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          document.exitFullscreen();
          navigate("/student", { replace: true });
        })
        .catch((e) => {
          console.log(e);
          alert("An error occured while submitting");
        });
    }

    // Store submitted data in state
  };

  const scrollToQuestion = (index) => {
    const questionElement = document.getElementById(`question-${index}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    // <div style={{ display: 'flex' }}>
    //   <div style={{ width: '30%', marginRight: '20px' }}>
    //     <h2>Questions</h2>
    //       {questions.map((question, index) => (
    //         <div key={index} onClick={() => scrollToQuestion(index)} style={{ cursor: 'pointer' }}>
    //           {index + 1}
    //         </div>
    //       ))}
    //     <p>Time Remaining: {Math.floor(timeRemaining / 60)} minutes {timeRemaining % 60} seconds</p>
    //     <button onClick={handleSubmit} disabled={timerExpired}>Submit</button>
    //   </div>
    //   <div style={{ width: '70%', overflowY: 'scroll', maxHeight: '100vh' }}>
    //     <h1>Test</h1>
    // {questions.map((question, index) => (
    //   <div key={index} id={`question-${index}`} style={{ marginBottom: '20px' }}>
    //     {renderQuestion(question, index)}
    //   </div>
    // ))}
    //     <div>
    //       {submittedData && (
    //         <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    //           <h2>Submitted Data</h2>
    //           {timerExpired && (
    //         <span>Timer Expired. Submitting automatically...</span>
    //       )}
    //           <pre>{JSON.stringify(submittedData, null, 2)}</pre>
    //           <button onClick={exitFullscreen}>Submit</button>
    //           <button disabled={timerExpired} onClick={cancelSubmit}>Cancel</button>
    //         </div>
    //       )}s
    //     </div>
    //   </div>
    // </div>
    <div className="w-full h-full flex flex-row">
      <Modal
        open={open}
        onClose={() => {
          if (!timerExpired) setOpen(false);
        }}
      >
        <ModalDialog>
          <div className="text-lg font-bold">Submit?</div>
          <div>{submitText[0]}</div>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`border border-slate-100 text-black font-bold  py-1 rounded-md text-center ${
                  index in answers ? "bg-green-400" : "bg-red-300"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <ModalClose />
          <Button onClick={handleSubmit} disabled={timerExpired}>
            {submitText[1]}
          </Button>
        </ModalDialog>
      </Modal>
      <div className=" relative flex text-white flex-col opacity-100 space-y-4 w-[400px] h-full  overflow-y-auto bg-cover bg-center bg-[url('C:/Users/arnav/Downloads/FinalProject/frontend/src/assets/bg.jpg')]">
        <div className="space-y-4 z-20 bg-gradient-to-t from-[#0a0430] to bg-transparent/20   h-full px-4 py-8">
          <div className="text-2xl font-bold -mb-2 ">Questions</div>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                onClick={() => scrollToQuestion(index)}
                className={`border border-slate-100 text-black font-bold  py-1 rounded-md text-center ${
                  index in answers ? "bg-green-400" : "bg-red-300"
                }`}
                style={{ cursor: "pointer" }}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="text-lg font-semibold">
            Time Remaining: {Math.floor(timeRemaining / 60)} mins{" "}
            {timeRemaining % 60} secs
          </div>
          <Button onClick={() => setOpen(true)} className="w-full">
            Submit
          </Button>
        </div>
      </div>
      <div className="flex w-1 bg-black h-full"></div>
      <div className="flex w-full h-full">
        <div className=" flex flex-col w-full h-full p-4 overflow-y-auto">
          <div className="text-4xl font-bold mb-8">Quiz</div>

          <div className="relative w-full h-full space-y-3">
            {questions.map((question, index) => (
              <div
                key={question.question}
                id={`question-${index}`}
                className="flex flex-col w-full rounded-lg border border-slate-200  bg-slate-100 px-4 py-2 delay-75"
              >
                <div className="flex w-full items-baseline gap-x-3">
                  <div className="text-sm font-bold whitespace-nowrap">
                    {" "}
                    Question {" " + (index + 1)}
                  </div>
                  <div className="font-medium w-full mb-4">
                    {question.question}
                  </div>
                </div>
                {question.options ? (
                  <>
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex flex-row items-baseline gap-x-4 my-2 ml-24 pr-[11.36rem] w-full cursor-pointer"
                      >
                        <div className="text-sm font-bold">
                          Option:{optionIndex + 1}
                        </div>
                        <div
                          id={`option-${optionIndex}`}
                          name={`question-${index}`}
                          className={`w-full  border-blue-500 cursor-pointer  rounded-lg px-4 py-2 text-blue-600 hover:bg-blue-100 ${
                            answers[index] === optionIndex
                              ? "bg-blue-100 font-semibold border-[3px]"
                              : " bg-white font-regular border"
                          }`}
                          style={{ cursor: "pointer !important" }}
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          checked={answers[index] === optionIndex}
                          onClick={() => {
                            handleAnswerChange(index, optionIndex);
                          }}
                        >
                          {option}
                        </div>
                        {/* <label htmlFor={`option-${optionIndex}`}>{option}</label> */}
                      </div>
                    ))}{" "}
                    <div className="flex flex-row items-baseline gap-x-4 my-4 w-fit">
                      <div className=" text-sm font-bold">Selected answer</div>
                      {index in answers ? (
                        <div className=" text-base font-bold bg-purple-100 border border-dashed border-purple-800 py-2 px-4 rounded-lg">
                          {question.options[answers[index]]}
                        </div>
                      ) : (
                        <div className=" text-base font-bold text-red-500">
                          Not Answered
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <Textarea
                    size="sm"
                    placeholder="Type your answer here"
                    value={answers[index] || ""}
                    minRows={3}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTakingPage;
