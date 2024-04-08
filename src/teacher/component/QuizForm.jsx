import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionGroup from "@mui/joy/AccordionGroup";
import AccordionSummary from "@mui/joy/AccordionSummary";
import { q_gen_dummy } from "../../assets/output";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import Divider from "@mui/joy/Divider";
import Snackbar from "@mui/joy/Snackbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuizForm = ({ jsonData }) => {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [semSection, setSemSection] = useState("");
  const [durationMins, setDurationMins] = useState(10);
  const navigate = useNavigate();
  // parse generatedQuestions
  useEffect(() => {
    // jsonData = q_gen_dummy;
    if (jsonData) {
      const mcqQuestions = jsonData.mcq.map((q) => ({
        id: uuidv4(),
        type: "mcq",
        question: q.question,
        options: q.options,
        answer: q.answer,
      }));
      const subjectiveQuestions = jsonData.subjective.map((q) => ({
        id: uuidv4(),
        type: "subjective",
        question: q.question,
        answer: q.answer,
      }));
      setGeneratedQuestions([...mcqQuestions, ...subjectiveQuestions]);
    }
  }, [jsonData]);

  // prevent refresh
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Some browsers require a return value to display the alert
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleAddQuestion = (variant) => {
    if (variant == "mcq") {
      setCustomQuestions([
        ...customQuestions,
        {
          id: uuidv4(),
          type: "mcq",
          question: "",
          options: ["", "", "", ""],
          answer: null,
          isNew: true,
        },
      ]);
    } else {
      setCustomQuestions([
        ...customQuestions,
        {
          id: uuidv4(),
          type: "subjective",
          question: "",
          answer: "",
        },
      ]);
    }
  };

  const handleDeleteQuestion = (id, variant) => {
    if (variant == "generated") {
      setGeneratedQuestions(
        generatedQuestions.filter((question) => question.id !== id)
      );
    } else {
      setCustomQuestions(
        customQuestions.filter((question) => question.id !== id)
      );
    }
  };

  const handleQuestionChange = (id, event, variant) => {
    const { name, value } = event.target;
    if (variant == "generated") {
      const updatedQuestions = generatedQuestions.map((question) =>
        question.id === id ? { ...question, [name]: value } : question
      );
      setGeneratedQuestions(updatedQuestions);
    } else {
      const updatedQuestions = customQuestions.map((question) =>
        question.id === id ? { ...question, [name]: value } : question
      );
      setCustomQuestions(updatedQuestions);
    }
  };

  const handleOptionChange = (questionId, optionIndex, event, variant) => {
    const { value } = event.target;
    if (variant == "generated") {
      const updatedQuestions = generatedQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [
                ...question.options.slice(0, optionIndex),
                value,
                ...question.options.slice(optionIndex + 1),
              ],
            }
          : question
      );
      setGeneratedQuestions(updatedQuestions);
    } else {
      {
        const updatedQuestions = customQuestions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                options: [
                  ...question.options.slice(0, optionIndex),
                  value,
                  ...question.options.slice(optionIndex + 1),
                ],
              }
            : question
        );
        setCustomQuestions(updatedQuestions);
      }
    }
  };

  const handleAnswerChange = (id, event, variant) => {
    const { value } = event.target;
    if (variant == "generated") {
      const updatedQuestions = generatedQuestions.map((question) =>
        question.id === id ? { ...question, answer: value } : question
      );
      setGeneratedQuestions(updatedQuestions);
    } else {
      const updatedQuestions = customQuestions.map((question) =>
        question.id === id ? { ...question, answer: value } : question
      );
      setCustomQuestions(updatedQuestions);
    }
  };

  useEffect(() => {
    if (error)
      setTimeout(() => {
        setError("");
      }, [5000]);
  }, [error]);

  const handleSave = (e) => {
    e.preventDefault();
    const allQuestions = generatedQuestions.concat(customQuestions);
    if (allQuestions.length < 5) {
      setError("You need atleast 5 questions to create a test!");
      return;
    }
    const teacherId = "";
    const dataToSend = {
      teacher_id: teacherId,
      subject: subject,
      sem: semSection,
      duration: durationMins,
      description: description,
      subjective: allQuestions
        .filter((question) => question.type === "subjective")
        .map(({ question, answer }) => ({
          question,
          answer,
        })),
      mcq: allQuestions
        .filter((question) => question.type === "mcq")
        .map(({ question, options, answer }) => ({
          question,
          options,
          answer: parseInt(answer) || 0,
        })),
    };
    const access_token = localStorage.getItem("accessToken");

    axios
      .post("http://localhost:8000/test/create", dataToSend, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        navigate("/teacher", { replace: true });
      })
      .catch((e) => {
        console.log(e);
      });
    // setJsonDataDisplay(JSON.stringify(dataToDisplay, null, 2));
  };
  const color_list = ["warning", "danger", "primary", "success"];
  return (
    <div className=" flex flex-col w-full h-full p-4  ">
      <div className="h-full flex flex-col overflow-y-auto">
        <div className="text-4xl font-bold mb-8">Create Quiz</div>

        <div className="relative w-full h-full">
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-10 items-baseline mb-4 ">
              <div className="text-base font-semibold col-span-2">Subject</div>{" "}
              <Input
                required
                className="w-fit col-span-8"
                size="sm"
                placeholder="Subject name"
                onChange={(e) => setSubject(e.target.value)}
              ></Input>
            </div>
            <div className="grid grid-cols-10 items-baseline mb-4">
              <div className="text-base font-semibold whitespace-nowrap col-span-2">
                Duration <span className="font-light text-xs">(in mins)</span>
              </div>{" "}
              <Input
                required
                className="w-fit col-start-3 col-span-8"
                size="sm"
                type="number"
                placeholder="Time"
                value={durationMins}
                onChange={(e) => setDurationMins(parseInt(e.target.value))}
              ></Input>
            </div>
            <div className="grid grid-cols-10 items-baseline mb-4">
              <div className="text-base font-semibold whitespace-nowrap col-span-2">
                Semester
              </div>{" "}
              <Input
                required
                className="w-fit col-start-3 col-span-8"
                size="sm"
                type="number"
                placeholder="Semester"
                value={semSection}
                onChange={(e) => setSemSection(parseInt(e.target.value))}
              ></Input>
            </div>
            <div className="grid grid-cols-10 items-baseline mb-8">
              <div className="text-base font-semibold col-span-2">
                Description
              </div>{" "}
              <Textarea
                required
                className="w-full mr-4 col-span-8"
                minRows={2}
                size="sm"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              ></Textarea>
            </div>
            <AccordionGroup>
              <Accordion
                defaultExpanded
                disabled={generatedQuestions.length == 0}
              >
                <AccordionSummary>
                  Generated questions ({generatedQuestions.length})
                </AccordionSummary>
                <AccordionDetails className="overflow-y-scroll">
                  <div className="space-y-4">
                    {generatedQuestions.map((question, index) => (
                      <div
                        key={question.id}
                        className="flex flex-col w-full rounded-lg border border-slate-200 hover:bg-blue-50 bg-slate-100 px-4 py-2 delay-75"
                      >
                        <div className="flex w-full items-baseline gap-x-3">
                          <div className="text-sm font-bold whitespace-nowrap">
                            {" "}
                            Question {" " + (index + 1)}
                          </div>
                          <Input
                            type="text"
                            variant="outlined"
                            required
                            size="sm"
                            className="font-medium w-full"
                            name="question"
                            placeholder={`Question ${index + 1}`}
                            value={question.question}
                            onChange={(e) =>
                              handleQuestionChange(question.id, e, "generated")
                            }
                          />
                          <Button
                            color="danger"
                            variant="soft"
                            onClick={() =>
                              handleDeleteQuestion(question.id, "generated")
                            }
                          >
                            Delete
                          </Button>
                        </div>

                        {question.type === "mcq" &&
                          question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex flex-row items-baseline gap-x-4 my-2 ml-24 pr-[11.36rem] w-full"
                            >
                              <div className="text-sm font-bold">
                                Option:{optionIndex + 1}
                              </div>
                              <Input
                                variant="soft"
                                required
                                key={optionIndex}
                                color={color_list[optionIndex]}
                                type="text"
                                size="sm"
                                className="w-full border border-slate-300"
                                placeholder={`Option ${optionIndex + 1}`}
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    question.id,
                                    optionIndex,
                                    e,
                                    "generated"
                                  )
                                }
                              />
                            </div>
                          ))}
                        {question.type === "mcq" && (
                          <div className="flex flex-row items-baseline gap-x-4  w-fit">
                            <div className=" text-sm font-bold">
                              {" "}
                              Correct answer
                            </div>
                            <input
                              type="number"
                              required
                              className="flex w-16 pl-4 border border-slate-400 bg-green-200 rounded-lg font-bold"
                              value={question.answer}
                              onChange={(e) =>
                                handleAnswerChange(question.id, e, "generated")
                              }
                              min={1}
                              max={4}
                            />
                          </div>
                        )}
                        {question.type === "subjective" && (
                          <div className="flex flex-row items-baseline gap-x-4 m-2 w-full">
                            <div className=" text-sm font-bold whitespace-nowrap ">
                              {" "}
                              Correct answer
                            </div>
                            <Textarea
                              variant="soft"
                              color="success"
                              required
                              placeholder="Long Answer"
                              className="w-full border border-slate-400"
                              value={question.answer}
                              onChange={(e) =>
                                handleAnswerChange(question.id, e, "generated")
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion defaultExpanded className="hover:bg-slate-50">
                <AccordionSummary>Custom questions</AccordionSummary>
                <AccordionDetails>
                  <div className="space-y-4 w-full">
                    {customQuestions.length > 0 ? (
                      customQuestions.map((question, index) => (
                        <div
                          key={question.id}
                          className="flex flex-col w-full rounded-lg border border-slate-200 hover:bg-blue-50 bg-slate-100 px-4 py-2 delay-75"
                        >
                          <div className="flex w-full items-baseline gap-x-3">
                            <div className="text-sm font-bold whitespace-nowrap">
                              {" "}
                              Question {" " + (index + 1)}
                            </div>
                            <Input
                              type="text"
                              variant="outlined"
                              required
                              size="sm"
                              className="font-medium w-full"
                              name="question"
                              placeholder={`Question ${index + 1}`}
                              value={question.question}
                              onChange={(e) =>
                                handleQuestionChange(question.id, e)
                              }
                            />
                            <Button
                              color="danger"
                              variant="soft"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              Delete
                            </Button>
                          </div>

                          {question.type === "mcq" &&
                            question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex flex-row items-baseline gap-x-4 my-2 ml-24 pr-[11.36rem] w-full"
                              >
                                <div className="text-sm font-bold">
                                  Option:{optionIndex + 1}
                                </div>
                                <Input
                                  variant="soft"
                                  required
                                  key={optionIndex}
                                  color={color_list[optionIndex]}
                                  type="text"
                                  size="sm"
                                  className="w-full border border-slate-300"
                                  placeholder={`Option ${optionIndex + 1}`}
                                  value={option}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      question.id,
                                      optionIndex,
                                      e
                                    )
                                  }
                                />
                              </div>
                            ))}
                          {question.type === "mcq" && (
                            <div className="flex flex-row items-baseline gap-x-4  w-fit">
                              <div className=" text-sm font-bold">
                                {" "}
                                Correct answer
                              </div>
                              <input
                                type="number"
                                required
                                className="flex w-16 pl-4 border border-slate-400 bg-green-200 rounded-lg font-bold"
                                value={question.answer}
                                onChange={(e) =>
                                  handleAnswerChange(question.id, e)
                                }
                                min={1}
                                max={4}
                              />
                            </div>
                          )}
                          {question.type === "subjective" && (
                            <div className="flex flex-row items-baseline gap-x-4 m-2 w-full">
                              <div className=" text-sm font-bold whitespace-nowrap ">
                                {" "}
                                Correct answer
                              </div>
                              <Textarea
                                variant="soft"
                                color="success"
                                required
                                placeholder="Long Answer"
                                className="w-full border border-slate-400"
                                value={question.answer}
                                onChange={(e) =>
                                  handleAnswerChange(question.id, e)
                                }
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="font-regular text-sm flex justify-center">
                        No custom questions added yet
                      </div>
                    )}
                    <div className="flex w-full justify-center space-x-4">
                      <Button
                        className="flex w-fit"
                        onClick={() => handleAddQuestion()}
                      >
                        Add Subjective
                      </Button>
                      <Button
                        className="flex w-fit"
                        onClick={() => handleAddQuestion("mcq")}
                      >
                        Add MCQ
                      </Button>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </AccordionGroup>
            <div className="sticky bottom-0 mt-10">
              {error && (
                <div className="text-red-500 font-semi text-lg text-center mb-2">
                  {error}
                </div>
              )}
              <div className="flex justify-center">
                <Button size="md" className="w-full flex " type="submit">
                  Save Test
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;
