import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import pic1 from "../../assets/pic1.jpeg";
import pic2 from "../../assets/pic2.jpeg";
import pic3 from "../../assets/pic3.jpg";
import pic4 from "../../assets/pic4.png";
import pic5 from "../../assets/pic5.jpg";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import { useState, useEffect } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTimeFilled";
import axios from "axios";

function generate_image() {
  const images = [pic1, pic2, pic3, pic4, pic5];

  // Function to generate a random index
  const getRandomIndex = () => Math.floor(Math.random() * images.length);

  // Get a random image source
  const randomImage = images[getRandomIndex()];
  return randomImage;
}
export default function TestCarousel() {
  const [tests, setTests] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const access_token = localStorage.getItem("accessToken");
    axios
      .get("http://localhost:8000/test/all_teacher", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setTests(res.data.tests);
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
  }, [refresh]);
  const images = [pic1, pic2, pic3, pic4, pic5];
  const getRandomIndex = () => Math.floor(Math.random() * images.length);
  return (
    <div className="flex  flex-row  gap-3 justify-center w-full  p-3">
      {!loading ? (
        tests.map((cardData, index) => {
          return (
            <div
              key={index}
              className=" flex flex-col w-[300px] m-4 h-[500px] bg-white rounded-lg"
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
                    <div className="flex text-sm font-semibold">Inactive</div>
                    <Switch
                      className={
                        cardData["is_active"]
                          ? " text-white rounded-full justify-center content-center  "
                          : " text-white cursor-not-allowed rounded-full justify-center content-center  "
                      }
                      checked={cardData["is_active"]}
                      onChange={() => {
                        const prev = tests;

                        axios
                          .post(
                            "http://localhost:8000/test/change_status",
                            {},
                            {
                              params: {
                                test_id: cardData._id,
                                is_active: !cardData.is_active,
                              },
                            }
                          )
                          .then(() => setRefresh(true))
                          .catch((e) => console.log(e));
                      }}
                    />{" "}
                    <div className="flex text-sm font-semibold">Active</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="items-center flex h-full w-full text-xl font-bold text-white justify-center">
          Loading...
        </div>
      )}
    </div>
  );
}
