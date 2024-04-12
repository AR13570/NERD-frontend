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
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (refresh == true) {
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
      setRefresh(false);
    }
  }, [refresh]);
  const images = [pic1, pic2, pic3, pic4, pic5];
  const dummy = [...tests, ...tests, ...tests, ...tests, ...tests, ...tests];
  return (
    <div className="grid grid-cols-3  gap-x-6 gap-y-8 justify-center w-full  p-4 h-full">
      {!loading ? (
        dummy.map((cardData, index) => {
          return (
            <div
              key={index}
              className="relative flex flex-col h-[340px] bg-white rounded-lg"
            >
              <img
                src={generate_image()}
                className={
                  cardData["is_active"]
                    ? "flex w-full h-full rounded-lg border bg-cover grayscale-0 "
                    : "flex w-full h-full rounded-lg border bg-cover grayscale cursor-not-allowed"
                }
                alt={cardData["subject"]}
              />
              <div className="absolute  w-full h-full bg-gradient-to-t from-black via-transparent/80 to-transparent rounded-lg">
                <div className="flex flex-row mt-[50%] w-full justify-between items-start pl-4 pr-2">
                  <div className=" text-white font-bold text-3xl  line-clamp-2">
                    {cardData["subject"]}
                  </div>
                  <div className="text-xs font-bold  m-1.5 ">
                    <div className="rounded-full  bg-white px-3 py-1 flex flex-row whitespace-nowrap items-center ">
                      <div>
                        <AccessTimeIcon />
                      </div>
                      <div>{cardData["duration"] + " mins"}</div>
                    </div>
                  </div>
                </div>
                <div className=" text-white font-semibold text-justify text-xs mt-2 px-4 line-clamp-3">
                  {cardData["description"]}
                </div>

                <div className=" absolute top-0 right-0 w-full  text-sm font-bold justify-end flex p-1.5">
                  <div
                    className={
                      cardData["is_active"]
                        ? "flex flex-row items-center rounded-tr-md rounded-bl-lg rounded-tl-sm rounded-br-sm px-2 border-[3px] border-green-500 bg-white"
                        : "flex flex-row items-center rounded-tr-md rounded-bl-lg rounded-tl-sm rounded-br-sm px-2 border-[3px] border-red-500 bg-white/80"
                    }
                  >
                    <div
                      className={
                        cardData["is_active"]
                          ? "  text-green-500"
                          : " text-red-500"
                      }
                    >
                      {cardData["is_active"] ? "Active" : "Inactive"}
                    </div>
                    <Switch
                      className={
                        cardData["is_active"]
                          ? " text-white rounded-full justify-center content-center "
                          : " text-white cursor-not-allowed rounded-full justify-center content-center  "
                      }
                      checked={cardData["is_active"]}
                      onChange={() => {
                        const prev = tests;
                        const access_token =
                          localStorage.getItem("accessToken");
                        axios
                          .post(
                            "http://localhost:8000/test/change_status",
                            {},
                            {
                              params: {
                                test_id: cardData._id,
                                is_active: !cardData.is_active,
                              },
                              headers: {
                                Authorization: `Bearer ${access_token}`,
                              },
                            }
                          )
                          .then(() => setRefresh(true))
                          .catch((e) => console.log(e));
                      }}
                    />{" "}
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
