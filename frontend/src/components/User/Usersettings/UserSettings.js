import React, { useContext, useEffect } from "react";
import { MyContext } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import Editableinputs from "./Editableinputs";
import "../../../assets/usersetting.css";
import AddWallet from "./AddWallet";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shadcn/components/ui/card";

function UserSettings() {
  const {
    setlogedin,
    getemail,
    lastName,
    firstName,
    verify,
    monthCycle,
    monthlyBudget,
    wallets,
  } = useContext(MyContext);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verify(token);
    } else {
      setlogedin(false);
      nav("/login");
    }
  }, []);

  return (
    <>
      <div className="flex  form-container items-center wallet text-white dark overflow-y-scroll max-h-[70vh] h-[100%] no-scrollbar pt-0">
        <form className="w-[100%] flex flex-col">
          
          <Card className="flex items-center px-6 bg-dark border-0 w-[100%]">
            <CardHeader className="w-[60%]">
              <CardTitle className="font-medium capitalize justify-end">
              <label className="usersettingFields text-end">First Name</label>
              </CardTitle>
            </CardHeader>
            <CardContent className="w-[40%] flex  pt-6">
            <Editableinputs text={firstName} field={"firstName"} />
            </CardContent>
          </Card>
          <Card className="flex items-center px-6 bg-dark border-0 w-[100%]">
            <CardHeader className="w-[60%]">
              <CardTitle className="font-medium capitalize justify-end">
              <label className="usersettingFields">Last Name</label>
              </CardTitle>
            </CardHeader>
            <CardContent className="w-[40%] pt-6">
            <Editableinputs text={lastName} field={"lastName"} />
            </CardContent>
          </Card>
         
          <Card className="flex items-center px-6 bg-dark border-0 w-[100%]">
            <CardHeader className="w-[60%]">
              <CardTitle className="font-medium capitalize justify-end">
              <label className="usersettingFields">Month Cycle</label>
              </CardTitle>
            </CardHeader>
            <CardContent className="w-[40%] pt-6">
            <Editableinputs text={monthCycle} field={"monthCycle"} />
            </CardContent>
          </Card>
         
          <Card className="flex items-center px-6 bg-dark border-0 w-[100%]">
            <CardHeader className="w-[60%]">
              <CardTitle className="font-medium capitalize justify-end">
              <label className="usersettingFields">Email</label>
              </CardTitle>
            </CardHeader>
            <CardContent className="w-[40%] pt-6">
            <label className="usersettingFields">{getemail}</label>
            </CardContent>
          </Card>
          
        </form>
      </div>
    </>
  );
}

export default UserSettings;
