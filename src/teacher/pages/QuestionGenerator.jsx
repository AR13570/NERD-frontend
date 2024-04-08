import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizForm from "../component/QuizForm";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";

export const QuestionGenerator = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [sub, setSub] = useState(0);
  const [startPage, setStartPage] = useState(0);
  const [endPage, setEndPage] = useState(0);
  const [mcq, setMcq] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timeout;
    if (error) {
      setDisplayText("Failed!!");
    } else {
      if (isLoading) {
        timeout = setTimeout(() => {
          setDisplayText("Uploading Pdf.....");
        }, 0);
        setTimeout(() => {
          setDisplayText("Calling LLM.....");
        }, 4000);
        setTimeout(() => {
          setDisplayText("Generating Question answer pairs....");
        }, 7000);
      } else {
        response && setDisplayText("SuccessFully Generated!");
      }
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    // Validation checks
    if (Math.abs(startPage - endPage) >= 20) {
      setError("The maximum number of pages that can be selected is 20");
      return;
    }
    if (mcq > 10 || sub > 10) {
      setError("Maximum 10 MCQ and 10 Subjective questions are allowed.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("pdf_file", file);

    const params = {
      sub: parseInt(sub, 10),
      start_page: parseInt(startPage, 10),
      end_page: parseInt(endPage, 10),
      mcq: parseInt(mcq, 10),
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/generate",
        formData,
        { params }
      );
      setResponse(response.data);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setError("Error uploading PDF");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full h-full flex flex-row">
      <div className=" relative flex text-white flex-col opacity-100 space-y-4 w-[650px] h-full  overflow-y-auto bg-cover bg-center bg-[url('C:/Users/arnav/Downloads/FinalProject/frontend/src/assets/bg.jpg')]">
        {/* <div className='absolute inset-0 w-full h-full bg-gradient-to-b from-black/5 to bg-transparent/45 z-10 '></div> */}
        <div className="space-y-4 z-20 bg-gradient-to-t from-[#0a0430] to bg-transparent/20   h-full px-4 py-8">
          <div className="text-2xl font-bold -mb-2 ">Generate Questions</div>
          <div className="px-4">
            <div className="text-lg font-bold">Upload a PDF</div>
            <div className="text-sm font-light text-justify mb-2">
              Choose a file to generate questions from it. You can choose the
              number of subjective and objective type of questions, and also
              specify the page numbers between which the context will be taken
              from.
            </div>

            <Input
              size="sm"
              variant="outlined"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
          {file && (
            <div className="flex flex-col gap-y-4 px-4 ">
              <div className="flex flex-col">
                <div className="text-base font-bold">Number of Questions</div>
                <div className="text-sm font-light text-justify mb-2">
                  A maximum of 10 questions can be chosen
                </div>
                <div className="flex flex-row justify-center gap-x-8">
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-slate-200">
                      Subjective
                    </div>
                    <Input
                      variant="outlined"
                      type="number"
                      className="w-24"
                      value={sub}
                      onChange={(e) =>
                        setSub(
                          Math.max(
                            Math.min(parseInt(e.target.value, 10), 10),
                            0
                          )
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-slate-200">MCQ</div>
                    <Input
                      variant="outlined"
                      type="number"
                      className="w-24"
                      value={mcq}
                      onChange={(e) =>
                        setMcq(
                          Math.max(
                            0,
                            Math.min(parseInt(e.target.value, 10), 10)
                          )
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-">
                <div className="text-base font-bold ">Choose page numbers</div>
                <div className="text-sm font-light text-justify mb-2">
                  The maximum number of pages that can be chosen is 20
                </div>
                <div className="flex flex-row justify-center gap-x-8">
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-slate-200">From</div>
                    <Input
                      variant="outlined"
                      type="number"
                      className="w-24"
                      value={startPage}
                      onChange={(e) =>
                        setStartPage(Math.max(0, parseInt(e.target.value, 10)))
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-slate-200">To</div>
                    <Input
                      variant="outlined"
                      type="number"
                      className="w-24"
                      value={endPage}
                      onChange={(e) =>
                        setEndPage(
                          Math.max(
                            0,
                            Math.min(
                              parseInt(e.target.value, 10),
                              startPage + 20
                            )
                          )
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <Button
                type="button"
                onClick={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
              >
                Submit
              </Button>
              {error && (
                <div className="font-light text-red-500 text-sm flex justify-center">
                  Error: {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex w-1 bg-black h-full"></div>
      <div className="w-full h-full">
        <QuizForm jsonData={response} />
      </div>
    </div>
  );

  // return (
  //   <div>

  //     <div>
  //       <label htmlFor="subInput">Sub:</label>
  //       <input id="subInput" type="number" value={sub} onChange={(e) => setSub(parseInt(e.target.value, 10))} />
  //     </div>
  //     <div>
  //       <label htmlFor="startPageInput">Start Page:</label>
  //       <input id="startPageInput" type="number" value={startPage} onChange={(e) => setStartPage(parseInt(e.target.value, 10))} />
  //     </div>
  //     <div>
  //       <label htmlFor="endPageInput">End Page:</label>
  //       <input id="endPageInput" type="number" value={endPage} onChange={(e) => setEndPage(parseInt(e.target.value, 10))} />
  //     </div>
  //     <div>
  //       <label htmlFor="mcqInput">MCQ:</label>
  //       <input id="mcqInput" type="number" value={mcq} onChange={(e) => setMcq(parseInt(e.target.value, 10))} />
  //     </div>
  //     <input type="file" accept=".pdf" onChange={handleFileChange} />
  //     <button onClick={handleSubmit} disabled={isLoading}>
  //       {isLoading ? 'Uploading...' : 'Upload PDF'}
  //     </button>
  //     <div>{displayText}</div>
  //     {error && <p>Error: {error}</p>}
  //     <div>
  //       <QuizForm jsonData={response} />
  //     </div>

  //   </div>
  // );
};

export default QuestionGenerator;
