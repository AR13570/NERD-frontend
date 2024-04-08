import * as React from "react";
import Button from "@mui/material/Button";
import pic1 from "../../assets/pic1.jpeg";
import pic2 from "../../assets/pic2.jpeg";
import pic3 from "../../assets/pic3.jpg";
import pic4 from "../../assets/pic4.png";
import pic5 from "../../assets/pic5.jpg";
import Chip from "@mui/material/Chip";
import AccessTimeIcon from "@mui/icons-material/AccessTimeFilled";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function generate_image() {
  const images = [pic1, pic2, pic3, pic4, pic5];

  // Function to generate a random index
  const getRandomIndex = () => Math.floor(Math.random() * images.length);

  // Get a random image source
  const randomImage = images[getRandomIndex()];
  return randomImage;
}
export default function TestCarousel({ allTests }) {
  //const [testVal, setTestVal] = React.useState();

  const images = [pic1, pic2, pic3, pic4, pic5];
  const navigate = useNavigate();
  // Function to generate a random index
  const getRandomIndex = () => Math.floor(Math.random() * images.length);

  // Get a random image source
  const randomImage = images[getRandomIndex()];
  const enterFullscreen = () => {
    const confirm = window.confirm(
      "You are entering the test.\nDON'T CLICK ON ESCAPE otherwise it will end your test"
    );
    if (document.documentElement.requestFullscreen && confirm) {
      document.documentElement.requestFullscreen();
    }
  };
  const dummy = [
    ...allTests,
    ...allTests,
    ...allTests,
    ...allTests,
    ...allTests,
    ...allTests,
    ...allTests,
    ...allTests,
    ...allTests,
    ...allTests,
    ...allTests,
    ...allTests,
  ];
  return (
    <div className="w-full h-full bg-indigo-950 my-6">
      <div className="grid grid-cols-4 gap-4 w-full  bg-indigo-950 overflow-x-hidden px-6 py-6">
        {allTests.length >= 0 &&
          allTests.map((cardData, index) => {
            return (
              <div
                key={index}
                className=" flex flex-col w-[85%]  h-[500px] bg-white rounded-lg"
              >
                <Chip
                  icon={<AccessTimeIcon />}
                  color="warning"
                  className="ml-4 my-2  w-fit"
                  label={cardData["duration"] + " mins"}
                />
                <div className="w-full h-full flex flex-col justify-start items-center">
                  <img
                    src={generate_image()}
                    className={
                      cardData["is_active"]
                        ? "flex w-[95%] h-[200px]  bg-cover grayscale-0 "
                        : "flex w-[95%] h-[200px]  bg-cover grayscale cursor-not-allowed"
                    }
                    alt={cardData["subject"]}
                  />
                  <div
                    className={
                      cardData["is_active"]
                        ? "text-2xl font-bold text-black"
                        : "text-2xl font-bold text-slate-500 cursor-not-allowed"
                    }
                  >
                    {cardData["subject"]}
                  </div>
                  <div className="h-28 px-3 w-full overflow-y-auto">
                    <div
                      className={
                        cardData["is_active"]
                          ? "text-black  h-fit flex text-justify content-center text-ellipsis truncate text-md  pt-2 "
                          : "text-slate-500 cursor-not-allowed h-fit flex text-justify content-center text-ellipsis truncate text-md  pt-2"
                      }
                    ></div>
                    {cardData["description"]}
                  </div>
                  <div className=" flex-1 flex-col  place-content-end mb-3 ">
                    <div className="  text-black items-center  justify-end flex">
                      <Button
                        class={`rounded-full justify-center content-center px-6 py-2 ${
                          cardData["is_active"]
                            ? "bg-sky-500 text-white"
                            : "bg-slate-400 text-white cursor-not-allowed"
                        }`}
                        disabled={!cardData["is_active"]}
                        onClick={(e) => {
                          e.preventDefault();
                          enterFullscreen();
                          navigate("/student/test", {
                            state: { testDetails: cardData },
                          });
                        }}
                      >
                        Take Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
