import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { MyContext } from "../context/Context";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../shadcn/components/ui/card";
import { Label } from "../../shadcn/components/ui/label";
import { Input } from "../../shadcn/components/ui/input";
import { Button } from "../../shadcn/components/ui/button";

function ForgetPassword() {
  const { setlogedin, verify, setloading } = useContext(MyContext);
  const { register, handleSubmit } = useForm();
  const [otpSend, setotpSend] = useState(false);
  const Navigate = useNavigate();

  const getotp = async (formdata) => {
    const email = formdata.email;
    setloading(true);
    let { data } = await axios.post(process.env.REACT_APP_Backend + "sendotp", {
      email: email,
    });
    const otp = data?.otp;
    if (data.stat) {
      const from = process.env.REACT_APP_EMAILID;
      const password = process.env.REACT_APP_EMAILPASSWORD;
      const html = `<p>Your otp to reset your password is: <strong>${otp}</strong></p>`;
      const subject = "Password Reset Request on Money-Tracker";
      let { data } = await axios.post(
        "https://emailer-66pb.onrender.com/send",
        {
          password: password,
          from: from,
          to: email,
          html: html,
          subject: subject,
        }
      );

      if (data.stat) {
        setotpSend(true);
        toast.info("OTP sent To email", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.info("Email Don't Exist's", {
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
    } else {
      toast.info("Email Don't Exist's", {
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
    setloading(false);
  };

  const onSubmit = async (formdata) => {
    setloading(true);
    let { data } = await axios.post(
      process.env.REACT_APP_Backend + "reset-password",
      { email: formdata.email, password: formdata.password, otp: formdata.otp }
    );
    setloading(false);
    if (data.stat) {
      toast.success("Password reset sucessfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      Navigate("/");
    } else {
      toast.error("Wrong OTP", {
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
    <div className="mt-28 h-screen flex justify-center">
    <div className="dark max-w-[400px] w-[80%]  ">
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <form onSubmit={handleSubmit(getotp)}>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email", { required: true })}
                type="email"
                id="email"
                placeholder="Enter Email"
              />
            </div>
            {!otpSend ? (
              <div className="form-btn">
                <Button>Get Otp</Button>
              </div>
            ) : null}
          </form>

          <form onSubmit={handleSubmit(onSubmit)}>
            {otpSend ? (
              <>
               <div className="space-y-1">
                <Label htmlFor="pin">OTP</Label>
                <Input
                  type="password"
                  id="pin"
                  placeholder="Enter Otp"
                  {...register("otp", { required: true })}
                />
                </div>
                <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter New Password"
                  {...register("password", { required: true })}
                />
                </div>
                <div className="form-btn">
                  <Button>Reset Password</Button>
                </div>
              </>
            ) : null}
            <div className="form-btn">
              <p>
                <div onClick={() => Navigate("/")}>Login</div>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    <ToastContainer theme="dark" />
    </div>
  );
}

export default ForgetPassword;

// <div className="login-container">
//       <div className="form-container">
//         <ul>
//           <li key="signup">Forget Password</li>
//         </ul>
//         <form onSubmit={handleSubmit(getotp)}>
//           <div className="form">
//             <label htmlFor="email">Enter Email</label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Enter Email"
//               {...register("email", { required: true })}
//             />
//           </div>
//           {!otpSend ? (
//             <div className="form-btn">
//               <button>Get Otp</button>
//             </div>
//           ) : null}
//         </form>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           {otpSend ? (
//             <>
//               <div className="form">
//                 <label htmlFor="pin">OTP</label>
//                 <input
//                   type="password"
//                   id="pin"
//                   placeholder="Enter Otp"
//                   {...register("otp", { required: true })}
//                 />
//               </div>
//               <div className="form">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   type="password"
//                   id="password"
//                   placeholder="Enter New Password"
//                   {...register("password", { required: true })}
//                 />
//               </div>
//               <div className="form-btn">
//                 <button>Reset Password</button>
//               </div>
//             </>
//           ) : null}
//           <div className="form-btn">
//             <p>
//               <div onClick={() => Navigate("/")}>Login</div>
//             </p>
//           </div>
//         </form>
//       </div>
//       <ToastContainer></ToastContainer>
//     </div>
