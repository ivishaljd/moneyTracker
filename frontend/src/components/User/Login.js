import axios, { Axios } from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import "../../assets/login.css";
import { MyContext } from "../context/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../../shadcn/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../shadcn/components/ui/card";
import { Input } from "../../shadcn/components/ui/input";
import { Label } from "../../shadcn/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../shadcn/components/ui/tabs";

import { useToast } from "../../shadcn/components/ui/use-toast"

function Login() {
  const {
    setlogedin,
    verify,
    getCurrentDateTime,
    setloading,
  } = useContext(MyContext);

  const nav = useNavigate();
  const { register: loginRegister, handleSubmit: loginHandleSubmit } = useForm();
  const { register: signupRegister, handleSubmit: signupHandleSubmit } = useForm();

  function getNextMonthDate(dateString) {
    const [day, month, year] = dateString.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day); // Note: Month is 0-based in JavaScript Date constructor

    // Get the date for the next month
    const nextMonth =
      inputDate.getMonth() === 11 ? 0 : inputDate.getMonth() + 1;
    const nextYear =
      inputDate.getMonth() === 11
        ? inputDate.getFullYear() + 1
        : inputDate.getFullYear();

    // Create the next month's date
    const nextMonthDate = new Date(nextYear, nextMonth, day);

    // Format the result in "dd/mm/yyyy" format
    const formattedDate = `${nextMonthDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${(nextMonthDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${nextMonthDate.getFullYear()}`;
    return formattedDate;
  }

  const onlogin = async (formdata) => {
    const email = formdata.email;
    const password = formdata.password;
    const firstName = formdata.firstname;
    const lastName = formdata.lastname;
    const datelatest = getCurrentDateTime();
    const nextmonth = getNextMonthDate(
      datelatest.date + "/" + datelatest.month + "/" + datelatest.year
    );
    const bag = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      monthCycle: nextmonth,
      monthlyBudget: "0",
    };

    setloading(true);
    let { data } = await axios.post(
      process.env.REACT_APP_Backend + "login",
      bag
    );
    setloading(false);
    if (data === "notfound") {
      toast.error("User not Exists! Please signupp", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    if (data.stat === "fail") {
      toast.warning("Wrong Password", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    if (data.stat === "sucess") {
      localStorage.setItem("token", data.token);
      verify(data.token, "/")?nav('/'):nav('/login');
    }
  };

  const onsignup = async (formdata) => {
    const email = formdata.email;
    const password = formdata.password;
    const firstName = formdata.firstname;
    const lastName = formdata.lastname;
    const datelatest = getCurrentDateTime();
    const nextmonth = getNextMonthDate(
      datelatest.date + "/" + datelatest.month + "/" + datelatest.year
    );
    const bag = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      monthCycle: nextmonth,
      monthlyBudget: "0",
    };

    setloading(true);
    let { data } = await axios.post(
      process.env.REACT_APP_Backend + "signup",
      bag
    );
    if (data == "already exist") {
      setloading(false);
      toast.error("User already Exists!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    if (data == "created") {
      const from = process.env.REACT_APP_EMAILID;
      const password = process.env.REACT_APP_EMAILPASSWORD;
      const html = `<h3>Hei ${firstName}</h3><br><p>welcome to Money Tracker</p>`;
      const subject = "Welcome to Money-Tracker";
      axios.post("https://emailer-66pb.onrender.com/send", {
        password: password,
        from: from,
        to: email,
        html: html,
        subject: subject,
      });

      toast.success("Signup sucessfully Please Login", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setloading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verify(token, "/");
    } else {
      setlogedin(false);
    }
  }, []);

  return (
    <div className="h-screen flex justify-center mt-28">
      <Tabs defaultValue="Login" className="max-w-[400px] w-[80%] dark">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="Login">
          <form onSubmit={loginHandleSubmit(onlogin)}>
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...loginRegister("email", { required: true })}
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Enter Password"
                    {...loginRegister("password", { required: true })}
                  />
                  <Label
                    className="mr-1 cursor-pointer"
                    onClick={() => nav("/forgot-password")}
                  >
                    Forgot Password?
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Submit</Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        <TabsContent value="signup">
          <form onSubmit={signupHandleSubmit(onsignup)}>
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...signupRegister("email", { required: true })}
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Enter Password"
                    {...signupRegister("password", { required: true })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    type="text"
                    id="firstname"
                    placeholder="First Name"
                    {...signupRegister("firstname", { required: true })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    type="text"
                    id="lastname"
                    placeholder="Last Name"
                    {...signupRegister("lastname", { required: true })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Submit</Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
      <ToastContainer theme="dark"/>
    </div>
  );
}

export default Login;
