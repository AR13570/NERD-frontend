import React, { useState, useEffect } from "react";
import TestCarousel from "../components/TestCarousel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const dummy_tests_student = {
  tests: [
    {
      _id: "6600721c0540767d3bd2edb9",
      teacher_id: "6600493f5085d84287dab52c",
      subject: "Artificial Intelligence",
      description: "CHATGPT is going to take our jobs. Time to cry",
      duration: 30,
      sem: 3,
      is_active: false,
      subjective: [
        {
          question:
            "What is the most effective approach to managing project scope creep?",
          answer:
            "The most effective approach to managing project scope creep is to have a clear and detailed project scope statement, regularly review and update the scope with stakeholders, and have a change management process in place to assess and approve any changes to the project scope.",
        },
        {
          question:
            "How can project managers ensure that their team members are properly trained and equipped to handle the tasks assigned to them?",
          answer:
            "Project managers can ensure that their team members are properly trained and equipped to handle the tasks assigned to them by providing regular training and development opportunities, offering mentorship and guidance, and using project management tools and software to streamline tasks and improve efficiency.",
        },
        {
          question:
            "What is the key to successfully managing a distributed project team?",
          answer:
            "The key to successfully managing a distributed project team is to establish clear communication channels, set clear expectations and goals, and use project management tools and software to facilitate collaboration and coordination among team members.",
        },
        {
          question:
            "How can project managers balance the competing demands of scope, time, and cost constraints?",
          answer:
            "Project managers can balance the competing demands of scope, time, and cost constraints by prioritizing tasks and resources, using project management tools and software to track progress and identify potential issues, and regularly communicating with stakeholders to ensure that their needs are being met.",
        },
        {
          question:
            "What is the biggest challenge that project managers face in terms of stakeholder management, and how can they address it?",
          answer:
            "The biggest challenge that project managers face in terms of stakeholder management is managing the expectations and needs of a diverse group of stakeholders, including project sponsors, team members, and end-users. To address this challenge, project managers can use stakeholder management techniques such as identifying key stakeholders, assessing their needs and expectations, and regularly communicating with them to ensure that their needs are being met.",
        },
        {
          question:
            "How can project managers ensure that their projects are delivering value to the organization and its stakeholders?",
          answer:
            "Project managers can ensure that their projects are delivering value to the organization and its stakeholders by setting clear project goals and objectives, regularly monitoring and assessing progress, and using project management tools and software to track key performance indicators (KPIs) and measure project success.",
        },
      ],
      mcq: [
        {
          question:
            "Which of the following is NOT a project management process group?",
          options: [
            "Initiating",
            "Planning",
            "Executing",
            "Monitoring and Controlling",
          ],
          answer: 2,
        },
        {
          question:
            "Which of the following is a tool and technique used in the Project Integration Management knowledge area?",
          options: [
            "Work Breakdown Structure",
            "Gantt charts",
            "Earned Value Management",
            "Risk Management Plan",
          ],
          answer: 2,
        },
        {
          question:
            "What is the primary purpose of the Project Management Plan?",
          options: [
            "To provide a framework for the project",
            "To define the project scope",
            "To outline the project timeline",
            "To allocate resources",
          ],
          answer: 2,
        },
        {
          question:
            "Which of the following is a characteristic of a project team member?",
          options: [
            "Has a fixed role and responsibilities",
            "Reports to the project manager only",
            "Has a diverse set of skills and expertise",
            "Is not accountable for the project's success",
          ],
          answer: 3,
        },
        {
          question:
            "Which of the following is an output of the Project Human Resource Management knowledge area?",
          options: [
            "Project Management Plan",
            "Work Breakdown Structure",
            "Resource Allocation Chart",
            "Team Charter",
          ],
          answer: 4,
        },
      ],
    },
    {
      _id: "6600721c0540767d3bd2edb9",
      teacher_id: "6600493f5085d84287dab52c",
      subject: "Artificial Intelligence",
      description: "CHATGPT is going to take our jobs. Time to cry",
      duration: 30,
      sem: 3,
      is_active: false,
      subjective: [
        {
          question:
            "What is the most effective approach to managing project scope creep?",
          answer:
            "The most effective approach to managing project scope creep is to have a clear and detailed project scope statement, regularly review and update the scope with stakeholders, and have a change management process in place to assess and approve any changes to the project scope.",
        },
        {
          question:
            "How can project managers ensure that their team members are properly trained and equipped to handle the tasks assigned to them?",
          answer:
            "Project managers can ensure that their team members are properly trained and equipped to handle the tasks assigned to them by providing regular training and development opportunities, offering mentorship and guidance, and using project management tools and software to streamline tasks and improve efficiency.",
        },
        {
          question:
            "What is the key to successfully managing a distributed project team?",
          answer:
            "The key to successfully managing a distributed project team is to establish clear communication channels, set clear expectations and goals, and use project management tools and software to facilitate collaboration and coordination among team members.",
        },
        {
          question:
            "How can project managers balance the competing demands of scope, time, and cost constraints?",
          answer:
            "Project managers can balance the competing demands of scope, time, and cost constraints by prioritizing tasks and resources, using project management tools and software to track progress and identify potential issues, and regularly communicating with stakeholders to ensure that their needs are being met.",
        },
        {
          question:
            "What is the biggest challenge that project managers face in terms of stakeholder management, and how can they address it?",
          answer:
            "The biggest challenge that project managers face in terms of stakeholder management is managing the expectations and needs of a diverse group of stakeholders, including project sponsors, team members, and end-users. To address this challenge, project managers can use stakeholder management techniques such as identifying key stakeholders, assessing their needs and expectations, and regularly communicating with them to ensure that their needs are being met.",
        },
        {
          question:
            "How can project managers ensure that their projects are delivering value to the organization and its stakeholders?",
          answer:
            "Project managers can ensure that their projects are delivering value to the organization and its stakeholders by setting clear project goals and objectives, regularly monitoring and assessing progress, and using project management tools and software to track key performance indicators (KPIs) and measure project success.",
        },
      ],
      mcq: [
        {
          question:
            "Which of the following is NOT a project management process group?",
          options: [
            "Initiating",
            "Planning",
            "Executing",
            "Monitoring and Controlling",
          ],
          answer: 2,
        },
        {
          question:
            "Which of the following is a tool and technique used in the Project Integration Management knowledge area?",
          options: [
            "Work Breakdown Structure",
            "Gantt charts",
            "Earned Value Management",
            "Risk Management Plan",
          ],
          answer: 2,
        },
        {
          question:
            "What is the primary purpose of the Project Management Plan?",
          options: [
            "To provide a framework for the project",
            "To define the project scope",
            "To outline the project timeline",
            "To allocate resources",
          ],
          answer: 2,
        },
        {
          question:
            "Which of the following is a characteristic of a project team member?",
          options: [
            "Has a fixed role and responsibilities",
            "Reports to the project manager only",
            "Has a diverse set of skills and expertise",
            "Is not accountable for the project's success",
          ],
          answer: 3,
        },
        {
          question:
            "Which of the following is an output of the Project Human Resource Management knowledge area?",
          options: [
            "Project Management Plan",
            "Work Breakdown Structure",
            "Resource Allocation Chart",
            "Team Charter",
          ],
          answer: 4,
        },
      ],
    },
  ],
};
const StudentHomePage = () => {
  const [allTests, setAlltests] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType == null || userType != "student") {
      localStorage.removeItem("userType");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      navigate("/");
    }
  }, []);
  useEffect(() => {
    setLoading(true);
    const access_token = localStorage.getItem("accessToken");
    axios
      .get("http://localhost:8000/test/all_student", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        console.log(res.data);
        setAlltests(res.data.tests);
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status == 401) {
          localStorage.removeItem("userType");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("username");
          navigate("/");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#1a1331] h-full w-full ">
      {/* <HeaderFile /> */}

      <div className="flex flex-col w-full h-full text-indigo-950 overflow-y-auto">
        <div className="text-stone-200  text-4xl font-bold h-10 p-4 ">
          Your upcoming tests
        </div>
        {!loading ? (
          allTests.length > 0 ? (
            <TestCarousel allTests={allTests} />
          ) : (
            <div className="font-bold text-white text-2xl flex w-full h-full justify-center items-center">
              No tests pending
            </div>
          )
        ) : (
          <div className="items-center flex h-full w-full text-xl font-bold text-white justify-center">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentHomePage;
