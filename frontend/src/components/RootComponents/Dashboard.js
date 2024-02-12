import React, { useContext, useEffect } from "react";
import { MyContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import Addtransaction from "../Transactions/Addtransaction";
import DisplayTransactions from "../Transactions/DisplayTransactions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../shadcn/components/ui/card";
import { TableCaption } from "../../shadcn/components/ui/table";
import { Skeleton } from "../../shadcn/components/ui/skeleton";

function Dashboard() {
  const { setlogedin, firstName, lastName, verify, dailyBudget, dailyexpense, loading } =
    useContext(MyContext);
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
      <div className="flex flex-col  justify-center items-center w-full mt-[25px]">
        <div className="flex flex-col max-w-6xl w-[80%] gap-4 ">
          <h2 className="text-3xl font-bold tracking-tight text-white  ">
            Dashboard
          </h2>
          <div className="flex justify-between items-center">
            <TableCaption className="self-start text-start mt-0">
              Hi, &nbsp;
              {!firstName ? <Skeleton className="h-2 w-[50%] inline-block" /> :
                <span className="font-bold text-sm text-white">{firstName.charAt(0).toUpperCase() + firstName.slice(1) }</span>}
              <br></br>
              <span className="font-medium">Your Daily Stats</span>
            </TableCaption>
            <Addtransaction />
          </div>
          <div className="dark flex items-center justify-between max-w-6xl w-[100%] gap-4  mb-5">
            <Card className="w-[49%]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-m font-semibold">
                  Today's Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right">
                 {!dailyBudget?<Skeleton className="h-5 w-[20%] inline-block" />: <>&#8377;&nbsp;{dailyBudget.toFixed(2)}</>}
                </div>
              </CardContent>
            </Card>
            <Card className="w-[49%]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-m font-semibold">
                  Today's Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold text-right ${dailyBudget < dailyexpense ? "expense" : "income"
                    }`}
                >
                 {!dailyBudget? <Skeleton className="h-5 w-[20%] inline-block" />:
                <>&#8377;&nbsp;{dailyexpense.toFixed(2)}</>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DisplayTransactions />
      </div>
    </>
  );
}

export default Dashboard;
