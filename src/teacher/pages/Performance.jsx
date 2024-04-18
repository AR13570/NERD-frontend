import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import PerfModal from "../component/Modal";
import PerfHistogram from "../component/Histogram";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";

export default function PerformancePage() {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState();
  const [anchorEl, setAnchorEl] = useState();
  const [selectedTest, setSelectedTest] = useState();
  const [selectedStudent, setSelectedStudent] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [testSelected, setTestSelected] = useState(false);
  const theme = useTheme();
  let metrics = {
    highest: 0,
    lowest: 0,
    average: 0,
  };

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");

    axios
      .get("http://localhost:8000/test/all_teacher", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        if (response.data.tests && Array.isArray(response.data.tests)) {
          setTests(response.data.tests);
        } else {
          setError("Invalid response format. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error fetching test details:", error);
        setError("Invalid token. Please log in again.");
      });
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTestClick = (testId) => {
    const access_token = localStorage.getItem("accessToken");

    axios
      .get(`http://localhost:8000/test/perf?test_id=${testId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        setSelectedTest(response.data.tests[0]);
        console.log(response.data.tests[0]);
        setTestSelected(true);
        handleClose();
      })
      .catch((error) => {
        console.error("Error fetching test details:", error);
      });
  };

  const handleUSNClick = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const generateChartData = () => {
    if (
      !selectedTest ||
      !selectedTest.students ||
      selectedTest.students.length == 0
    ) {
      console.log("L time");
      return [];
    }
    const marksFrequency = {};
    let totalMarks = 0;
    let maxMark = 0;
    let minMark = 100;

    selectedTest.students.forEach((student) => {
      const marks = student.marks.toString();
      marksFrequency[marks] = marksFrequency[marks]
        ? marksFrequency[marks] + 1
        : 1;
      maxMark = Math.max(maxMark, marks);
      minMark = Math.min(minMark, marks);
      let marksNumber = parseInt(marks);
      totalMarks += marksNumber;
    });
    let averageMark = Math.round(totalMarks / selectedTest.students.length);
    /////////////
    // dummy test data
    // for (let i = 1; i < 7; i++) {
    //   const marks = (i % 3).toString();
    //   marksFrequency[marks] = marksFrequency[marks]
    //     ? marksFrequency[marks] + 1
    //     : 1;
    //   maxMark = Math.max(maxMark, marks);
    //   minMark = Math.min(minMark, marks);
    //   let marksNumber = parseInt(marks);
    //   totalMarks += marksNumber;
    // }
    // averageMark = Math.round(totalMarks / (selectedTest.students.length + 6));
    //////////////

    metrics.highest = maxMark;
    metrics.lowest = minMark;
    metrics.average = averageMark;
    return Object.keys(marksFrequency).map((mark) => ({
      mark: mark,
      frequency: marksFrequency[mark],
    }));
  };
  return (
    <div className="w-full flex flex-col h-full">
      <div className=" flex flex-col w-full h-full overflow-auto">
        <div className="w-full flex justify-center py-4 bg-[#635985]">
          <Box className="w-52 flex">
            <button
              className="border-2 w-full border-white rounded-lg text-base font-semibold text-white px-3 py-2 bg-[#988ac9]"
              onClick={handleClick}
            >
              {selectedTest == undefined
                ? "Select Subject"
                : selectedTest["subject"]}
            </button>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            getContentAnchorEl={null}
            PaperProps={{
              style: {
                width: anchorEl ? anchorEl.clientWidth : undefined,
              },
            }}
          >
            {tests.map((test) => (
              <MenuItem
                key={test._id}
                onClick={() => handleTestClick(test._id)}
              >
                {test.subject}
              </MenuItem>
            ))}
          </Menu>
        </div>
        {testSelected ? (
          selectedTest != undefined && generateChartData().length > 0 ? (
            <>
              <div className="w-full h-1 bg-black"></div>
              <div className="w-full h-full flex flex-row">
                <div className="w-[740px] bg-[#443C68] h-full text-black flex flex-col ">
                  {selectedTest && <PerfHistogram data={generateChartData()} />}
                  {selectedTest && (
                    <TableContainer
                      component={Paper}
                      style={{
                        backgroundColor: "#f5f5f5",
                        maxWidth: "50%",
                        margin: "auto",
                        marginBottom: "130px",
                        color: "#fff",
                      }}
                    >
                      <Table className="border-2 border-white">
                        <TableHead>
                          <TableRow className="bg-[#412e7c]">
                            <TableCell
                              align="center"
                              style={{
                                fontWeight: "bold",
                                fontSize: "18px",
                                color: "#ffffff",
                              }}
                            >
                              Metric
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                fontWeight: "bold",
                                fontSize: "18px",
                                color: "#ffffff",
                              }}
                            >
                              Marks
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              style={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                fontSize: "15px",
                              }}
                              align="center"
                            >
                              Highest Marks
                            </TableCell>
                            <TableCell
                              style={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                fontSize: "15px",
                              }}
                              align="center"
                            >
                              {metrics.highest}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              style={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                fontSize: "15px",
                              }}
                              align="center"
                            >
                              Average Marks
                            </TableCell>
                            <TableCell
                              style={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                fontSize: "15px",
                              }}
                              align="center"
                            >
                              {metrics.average}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              style={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                fontSize: "15px",
                              }}
                              align="center"
                            >
                              Lowest Marks
                            </TableCell>
                            <TableCell
                              style={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                fontSize: "15px",
                              }}
                              align="center"
                            >
                              {metrics.lowest}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </div>
                <div className="h-full bg-black w-1"></div>
                <div className="w-full h-full bg-[#18122B] ">
                  {" "}
                  {/* right side component */}
                  {selectedTest && (
                    <div className="flex justify-center">
                      <TableContainer
                        component={Paper}
                        style={{
                          backgroundColor: "#7368a5",
                          marginTop: "50px",
                          width: "900px",
                        }}
                      >
                        <Table className="border-2 border-white">
                          <TableHead>
                            <TableRow className="bg-[#412e7c]">
                              <TableCell
                                align="center"
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                  color: "#ffffff",
                                }}
                              >
                                USN
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                  color: "#ffffff",
                                }}
                              >
                                Obtained Marks
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                  color: "#ffffff",
                                }}
                              >
                                Total Marks
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedTest.students.map((student) => (
                              <TableRow
                                key={student.student_usn}
                                onClick={() => handleUSNClick(student)}
                                style={{ cursor: "pointer" }}
                              >
                                <TableCell
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    color: "#ffffff",
                                  }}
                                  align="center"
                                >
                                  {student.student_usn}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    color: "#ffffff",
                                  }}
                                  align="center"
                                >
                                  {student.marks}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    color: "#ffffff",
                                  }}
                                  align="center"
                                >
                                  {student.total_marks}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  )}
                  {openDialog && (
                    <PerfModal
                      open={openDialog}
                      handleClose={handleCloseDialog}
                      student={selectedStudent}
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex text-2xl font-bold justify-center items-center">
              No test data available
            </div>
          )
        ) : (
          <div className="w-full h-full flex text-2xl font-bold justify-center items-center">
            Please select a test to view performance
          </div>
        )}
      </div>
    </div>
  );
}
