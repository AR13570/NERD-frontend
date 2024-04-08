import React, { useState, useEffect } from "react";
import Test from "./student/pages/TestTakingPage";
import { q_gen_dummy } from "./assets/output";
export const SelectTest = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const [timeAllotted, setTimeAllotted] = useState(10); // State to store time allotted

  const enterFullscreen = () => {
    const confirm = window.confirm(
      "You are entering the test. DON'T CLICK ON ESCAPE otherwise it will end your test"
    );
    if (document.documentElement.requestFullscreen && confirm) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    }
  };

  const handleExitConfirmed = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleTimeAllottedChange = (e) => {
    setTimeAllotted(e.target.value); // Update time allotted when the input changes
  };

  return (
    // <div className="w-full h-full flex flex-row">
    //   <div className=" relative flex text-white flex-col opacity-100 space-y-4 w-[700px] h-full  overflow-y-auto bg-cover bg-center bg-[url('C:/Users/arnav/Downloads/FinalProject/frontend/src/assets/bg.jpg')]">
    //     {/* <div className='absolute inset-0 w-full h-full bg-gradient-to-b from-black/5 to bg-transparent/45 z-10 '></div> */}
    //     <div className="space-y-4 z-20 bg-gradient-to-t from-[#0a0430] to bg-transparent/20   h-full px-4 py-8">
    //       <div className="text-2xl font-bold -mb-2 ">Generate Questions</div>
    //     </div>
    //   </div>
    //   <div className="flex w-1 bg-black h-full"></div>
    //   <div className="flex w-full h-full"></div>
    // </div>
    <div>
      {!fullscreen ? (
        <div>
          <label htmlFor="timeAllotted">Time Allotted (in minutes): </label>
          <input value={timeAllotted} onChange={handleTimeAllottedChange} />
          <button onClick={enterFullscreen}>Enter Fullscreen</button>
        </div>
      ) : (
        <Test
          exitFullscreen={handleExitConfirmed}
          timeAllotted={timeAllotted}
          json={json}
        /> // Pass time allotted as prop to Test component
      )}
    </div>
  );
};

export default SelectTest;
