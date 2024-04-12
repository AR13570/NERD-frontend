import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/joy/Button";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import axios from "axios";
import login from "./assets/login.jpg";
import loginGif from "./assets/NERD.gif";
import { useNavigate } from "react-router-dom";
const LoginPage = ({ user, setUser }) => {
  const [userType, setUserType] = useState("student");
  const [invalidUser, setInvalidUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = new FormData();
    formData.append("username", data.get("username"));
    formData.append("password", data.get("password"));

    if (data.get("username") === "" || data.get("password") === "") {
      setInvalidUser(true);
      return;
    }
    setInvalidUser(false);
    let url = "";
    if (userType === "student") {
      url = "http://localhost:8000/student/login";
    } else if (userType === "teacher") {
      url = "http://localhost:8000/teacher/login";
    }

    try {
      setLoading(true);
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Store user data in local storage upon successful login
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("username", data.get("username"));
      setUser(data.get("username"));
      if (userType == "student") navigate("/student");
      else navigate("/teacher");
    } catch (error) {
      setUser("");
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = () => {
    setUserType("student");
  };

  const handleTeacherClick = () => {
    setUserType("teacher");
  };

  return (
    <div className="flex flex-col w-full h-full">
      <Grid container component="main" className="h-full">
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${loginGif})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight={"bold"}>
              Sign in
            </Typography>
            <div
              className="button-container space-x-4"
              style={{ paddingTop: "20px" }}
            >
              <Button
                variant={userType === "student" ? "solid" : "outlined"}
                onClick={handleStudentClick}
              >
                Student
              </Button>
              <Button
                variant={userType === "teacher" ? "solid" : "outlined"}
                onClick={handleTeacherClick}
              >
                Teacher
              </Button>
            </div>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              {invalidUser && (
                <Typography variant="body2" color="error">
                  Please enter username and password.
                </Typography>
              )}
              <Button
                loading={loading}
                type="submit"
                fullWidth
                variant="solid"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginPage;
