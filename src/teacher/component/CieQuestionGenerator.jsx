import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/joy/Button";

function CieQuestionGenerator() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [sub, setSub] = useState(true); // Changed to boolean
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
        response && setDisplayText("Successfully Generated!");
      }
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const handleFileChange = (event) => {
    setError(false);
    setFiles(Array.from(event.target.files));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const params = {
      sub: sub ? 1 : 0, // Convert boolean to integer (0 or 1)
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/process_qa/",
        formData,
        { params }
      );
      setResponse(response.data); // Assuming backend returns the Word document here
      exportToTxtFile(response.data.result);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setError("Error uploading PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToTxtFile = (content) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "exported_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div>
      <div>
        <div className="text-xl font-bold flex justify-center">
          Generate CIE paper
        </div>
        <div className="flex flex-row gap-x-2 mt-4">
          <div className="text-base font-medium flex ">Choose:</div>
          <div className="flex flex-col">
            <label>
              <input
                className="mr-2"
                type="radio"
                value="q_a"
                checked={sub}
                onChange={() => setSub(true)}
              />
              Questions and Answers
            </label>
            <label>
              <input
                className="mr-2"
                type="radio"
                value="q"
                checked={!sub}
                onChange={() => setSub(false)}
              />
              Only Questions
            </label>
          </div>
        </div>
      </div>
      <div className="text-base font-medium mb-2">Upload files</div>
      <input
        className="flex justify-center mb-4"
        type="file"
        accept=".pdf,.ppt,.pptx"
        onChange={handleFileChange}
        multiple
      />

      <Button
        className="border border-slate-400 rounded-full px-3 py-2 text-base font-medium bg-blue-500 text-white flex justify-center w-full my-4"
        onClick={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? "Uploading..." : "Upload PDF"}
      </Button>
      {!error && (
        <div className=" text-slate-600 font-light text-sm flex justify-center my-4">
          {displayText}
        </div>
      )}
      {error && (
        <p className="text-red-500 font-medium flex justify-center my-4">
          Error: {error}
        </p>
      )}
      {response && (
        <div>
          <Button
            className="border border-slate-400 rounded-full px-3 py-2 text-base font-medium bg-blue-500 text-white flex justify-center w-full my-4"
            onClick={() => exportToTxtFile(response.result)}
          >
            Download Text File
          </Button>
        </div>
      )}
    </div>
  );
}

export default CieQuestionGenerator;
