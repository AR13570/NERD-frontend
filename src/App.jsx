import { useState } from "react";
import TestTakingPage from "./student/pages/TestTakingPage";
import QuestionGenerator from "./teacher/pages/QuestionGenerator";
import { test_dummy } from "./assets/output";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import StudentHomePage from "./student/pages/HomePage";
import Navbar from "./NavBar";
import TeacherHomePage from "./teacher/pages/HomePage";
import PerformancePage from "./teacher/pages/Performance";

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState("");

  return (
    <div className="flex flex-col w-screen h-screen  ">
      <Navbar user={user} setUser={setUser} />
      <div className=" h-full w-full overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={<LoginPage user={user} setUser={setUser} />}
          />
          <Route path="/student">
            <Route index element={<StudentHomePage />} />
            <Route path="test" element={<TestTakingPage />} />
          </Route>
          <Route path="/teacher">
            <Route index element={<TeacherHomePage />} />
            <Route path="generate" element={<QuestionGenerator />} />
            <Route path="performance" element={<PerformancePage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
