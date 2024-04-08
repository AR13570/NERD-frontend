import * as React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Popover } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
export default function Navbar({ user, setUser }) {
  //const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username == null && window.location != "/") {
      localStorage.removeItem("userType");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      navigate("/");
    } else {
      setUser(username);
    }
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div className="bg-slate-100 w-full h-12">
      <div className="flex  items-center px-4 py-2">
        <div className=" text-2xl font-bold flex-grow text-center">
          Ramaiah Institute of Technology
        </div>
        {user != "" && (
          <>
            <button
              className="text-indigo-950"
              aria-label="menu"
              aria-describedby={id}
              onClick={handleClick}
            >
              <AccountCircleIcon
                className="text-indigo-950 text-4xl"
                fontSize="large"
              />
            </button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              transitionDuration={200}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}
            >
              <div className=" flex items-center gap-4 border-b py-2 px-4 bg-slate-100">
                <div className="inline-flex items-center justify-center w-12 h-12 text-xl text-white bg-red-500 rounded-full">
                  {user.slice(0, 2)}
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray">
                    {user}
                  </Typography>
                  {/* <Typography
                variant="small"
                color="gray"
                className="font-medium text-blue-gray-500"
              >
                1MS20CS023
              </Typography> */}
                </div>
              </div>
              {/* <Typography className="p-2">UserName</Typography>
      <Typography className="p-2">Extra</Typography> */}
              <div className="flex justify-center pb-2 bg-slate-100">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    localStorage.removeItem("userType");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("username");
                    setUser("");
                    navigate("/");
                  }}
                >
                  Log out
                </Button>
              </div>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
}
